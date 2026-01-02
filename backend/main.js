const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const db = require('./database')
const RuleBasedAI = require('./rule-based-ai')
const CurriculumQuestionGenerator = require('./curriculum-question-generator')
const logger = require('./logger')

let win
// Session storage: token -> user data
const activeSessions = new Map()

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'render.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Load landing page when app opens
  win.loadFile('src/landing.html')
}

// Initialize database when app is ready
app.whenReady().then(async () => {
  logger.info('Application starting...')
  try {
    await db.initDatabase()
    logger.info('Database initialized successfully')
    
    // Check if admin exists, create default admin if not
    try {
      const adminCheck = await db.getUserByEmail('admin@mathify.local')
      if (!adminCheck) {
        logger.info('Admin account not found. Creating default admin account...')
        try {
          const adminResult = await db.createAdminAccount({
            fullName: 'Administrator',
            email: 'admin@mathify.local',
            password: 'Admin123!',
            userType: 'admin'
          })
          logger.warn('✅ Default admin account created successfully!')
          logger.warn('📧 Email: admin@mathify.local')
          logger.warn('🔑 Password: Admin123!')
          logger.warn('⚠️  IMPORTANT: Change this password after first login!')
        } catch (createErr) {
          logger.error('Failed to create admin account', createErr)
          // Try to see if it already exists (race condition)
          const recheck = await db.getUserByEmail('admin@mathify.local')
          if (recheck) {
            logger.info('Admin account exists (created by another process)')
          } else {
            logger.error('CRITICAL: Could not create admin account. Please check database permissions.')
          }
        }
      } else {
        logger.info('Admin account already exists')
      }
    } catch (err) {
      logger.error('Failed to check/create admin account', err)
      logger.error('Error details:', err.message, err.stack)
    }
    
    createWindow()
  } catch (err) {
    logger.error('Failed to initialize database', err)
    createWindow()
  }
})

// Navigation handlers
ipcMain.on('navigate-to', (event, page) => {
  const pages = {
    'landing': 'src/landing.html',
    'auth': 'src/auth.html',
    'student-dashboard': 'src/student-dashboard.html',
    'admin-dashboard': 'src/admin-dashboard.html'
  }
  
  if (pages[page]) {
    win.loadFile(pages[page])
  }
})

// Authentication handlers - Registration disabled, only admin can create accounts
ipcMain.handle('register', async (event, userData) => {
  try {
    logger.warn('Registration attempt blocked - registration is disabled', { email: userData.email })
    throw new Error('Registration is disabled. Please contact your administrator to create an account.')
  } catch (error) {
    logger.error('Registration failed', error, { email: userData.email })
    return { success: false, error: error.message }
  }
})

// Admin-only account creation handler
ipcMain.handle('create-user', async (event, userData) => {
  try {
    // TODO: Add admin verification here (check session token)
    // For now, allow account creation (can be restricted later with proper session validation)
    
    logger.info('User creation attempt', { email: userData.email, userType: userData.userType })
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      logger.warn('Invalid email format during user creation', { email: userData.email })
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const hasUpperCase = /[A-Z]/.test(userData.password);
    const hasLowerCase = /[a-z]/.test(userData.password);
    const hasNumber = /[0-9]/.test(userData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    }

    // Validate user type
    if (!['admin', 'teacher', 'student'].includes(userData.userType)) {
      throw new Error('Invalid user type. Must be admin, teacher, or student')
    }
    
    // For students, grade is required
    if (userData.userType === 'student' && !userData.studentGrade) {
      throw new Error('Grade is required for student accounts')
    }

    // For teachers, at least one grade is required
    if (userData.userType === 'teacher') {
      if (!userData.teacherGrades || !Array.isArray(userData.teacherGrades) || userData.teacherGrades.length === 0) {
        throw new Error('At least one grade is required for teacher accounts')
      }
    }

    const result = await db.registerUser(userData)

    // Save teacher grades if needed
    if (userData.userType === 'teacher') {
      try {
        await db.setTeacherGrades(result.id, userData.teacherGrades)
      } catch (gradesErr) {
        logger.error('Failed to set teacher grades', gradesErr, { teacherId: result.id })
      }
    }
    
    logger.info('User created successfully', { userId: result.id, email: userData.email, userType: userData.userType })
    return { success: true, user: result }
  } catch (error) {
    logger.error('User creation failed', error, { email: userData.email })
    return { success: false, error: error.message }
  }
})

ipcMain.handle('login', async (event, email, password) => {
  try {
    logger.info('Login attempt', { email })
    const user = await db.loginUser(email, password)
    
    // Create session
    const session = await db.createSession(user.id)
    activeSessions.set(session.token, user)
    
    logger.info('Login successful', { userId: user.id, email, userType: user.userType || user.user_type })
    return { success: true, user: user, token: session.token }
  } catch (error) {
    logger.warn('Login failed', { email, error: error.message })
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-current-user', async (event, token) => {
  try {
    if (!token) {
      return null
    }
    
    // Check active sessions first (faster)
    if (activeSessions.has(token)) {
      return activeSessions.get(token)
    }
    
    // Check database for session
    const session = await db.getSessionByToken(token)
    if (session) {
      activeSessions.set(token, session)
      return session
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
})

ipcMain.handle('logout', async (event, token) => {
  try {
    if (token) {
      await db.deleteSession(token)
      activeSessions.delete(token)
      logger.info('User logged out', { token: token.substring(0, 8) + '...' })
    }
  return { success: true }
  } catch (error) {
    logger.error('Error logging out', error, { token: token ? token.substring(0, 8) + '...' : 'none' })
    return { success: false, error: error.message }
  }
})

ipcMain.handle('validate-session', async (event, token) => {
  try {
    if (!token) {
      return { valid: false }
    }
    
    // Check active sessions first
    if (activeSessions.has(token)) {
      return { valid: true, user: activeSessions.get(token) }
    }
    
    // Check database
    const session = await db.getSessionByToken(token)
    if (session) {
      activeSessions.set(token, session)
      return { valid: true, user: session }
    }
    
    return { valid: false }
  } catch (error) {
    console.error('Error validating session:', error)
    return { valid: false }
  }
})

ipcMain.handle('get-children', async (event, parentId) => {
  try {
    const children = await db.getChildrenByParentId(parentId)
    return { success: true, children: children }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-all-students', async (event, gradeFilter = null, token = null) => {
  try {
    let scope = 'admin'
    let scopedGradeFilter = gradeFilter

    if (token) {
      const sessionInfo = await db.getSessionByToken(token)
      if (sessionInfo && sessionInfo.user_type) {
        if (sessionInfo.user_type === 'teacher') {
          scope = 'teacher'
          // For teachers, we will ignore arbitrary gradeFilter and instead use their assigned grades
          scopedGradeFilter = null
        } else if (sessionInfo.user_type === 'student') {
          scope = 'student'
        }
      }
    }

    let students
    if (scope === 'teacher') {
      students = await db.getStudentsForTeacher(token)
    } else if (scope === 'student') {
      students = await db.getOwnStudentRecord(token)
    } else {
      students = await db.getAllStudents(scopedGradeFilter)
    }

    logger.info('Students retrieved', { count: students.length, gradeFilter: scopedGradeFilter, scope })
    return { success: true, students }
  } catch (error) {
    logger.error('Error getting students', error, { gradeFilter })
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-all-teachers', async (event, gradeFilter = null) => {
  try {
    const teachers = await db.getAllTeachers(gradeFilter)
    logger.info('Teachers retrieved', { count: teachers.length, gradeFilter })
    return { success: true, teachers: teachers }
  } catch (error) {
    logger.error('Error getting teachers', error, { gradeFilter })
    return { success: false, error: error.message }
  }
})

// Get grade levels for the logged-in teacher
ipcMain.handle('get-teacher-grades', async (event, token = null) => {
  try {
    const grades = await db.getTeacherGradesByToken(token)
    return { success: true, grades }
  } catch (error) {
    logger.error('Error getting teacher grades', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('add-child', async (event, parentId, childName, grade) => {
  try {
    const child = await db.addChild(parentId, childName, grade)
    return { success: true, child: child }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('update-student-grade', async (event, userId, grade) => {
  try {
    if (!userId || !grade) {
      return { success: false, error: 'User ID and grade are required' }
    }
    const result = await db.updateStudentGrade(userId, grade)
    if (result.success) {
      // Note: Session-based auth means we don't need to update in-memory user
      // The user data will be fetched from database on next request
      return { success: true }
    } else {
      return { success: false, error: 'Failed to update grade' }
    }
  } catch (error) {
    console.error('Error updating student grade:', error)
    return { success: false, error: error.message || 'Failed to update grade' }
  }
})

ipcMain.handle('get-user-by-id', async (event, userId, token = null) => {
  try {
    // token is automatically appended by electronAPI.invoke, but we ignore it here
    const user = await db.getUserById(userId)
    if (user) {
      // Normalize student_grade to studentGrade for consistency
      if (user.student_grade !== undefined) {
        user.studentGrade = user.student_grade
      }
      return { success: true, user: user }
    } else {
      return { success: false, error: 'User not found' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Curriculum and progress handlers
ipcMain.handle('get-curriculum-topics', async (event, grade, quarter = null, token = null) => {
  try {
    // token is automatically appended by electronAPI.invoke, but we ignore it here
    // quarter might be null or undefined, ensure it's handled correctly
    const actualQuarter = (quarter !== null && quarter !== undefined && typeof quarter === 'number') ? quarter : null
    const topics = await db.getCurriculumTopics(grade, actualQuarter)
    console.log(`Fetched ${topics.length} topics for grade ${grade}, quarter ${actualQuarter}`)
    return { success: true, topics: topics }
  } catch (error) {
    console.error('Error getting curriculum topics:', error)
    return { success: false, error: error.message, topics: [] }
  }
})

ipcMain.handle('get-quarters-for-grade', async (event, grade, token = null) => {
  try {
    // token is automatically appended by electronAPI.invoke, but we ignore it here
    const quarters = await db.getQuartersForGrade(grade)
    console.log(`Fetched quarters [${quarters.join(', ')}] for grade ${grade}`)
    return { success: true, quarters: quarters }
  } catch (error) {
    console.error('Error getting quarters:', error)
    return { success: false, error: error.message, quarters: [] }
  }
})

ipcMain.handle('get-student-topic-progress', async (event, userId, grade) => {
  try {
    const progress = await db.getStudentTopicProgress(userId, grade)
    return { success: true, progress: progress }
  } catch (error) {
    console.error('Error getting student topic progress:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('update-student-topic-progress', async (event, userId, topicId, progressData) => {
  try {
    const result = await db.updateStudentTopicProgress(userId, topicId, progressData)
    return result
  } catch (error) {
    console.error('Error updating student topic progress:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-student-progress', async (event, userId) => {
  try {
    const progress = await db.getStudentProgress(userId)
    return { success: true, progress: progress }
  } catch (error) {
    console.error('Error getting student progress:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('update-student-progress', async (event, userId, progressData) => {
  try {
    const result = await db.updateStudentProgress(userId, progressData)
    return result
  } catch (error) {
    console.error('Error updating student progress:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-practice-sessions', async (event, userId) => {
  try {
    const sessions = await db.getPracticeSessions(userId)
    return { success: true, sessions: sessions }
  } catch (error) {
    console.error('Error getting practice sessions:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('save-practice-session', async (event, userId, topicId, score, totalQuestions) => {
  try {
    const result = await db.savePracticeSession(userId, topicId, score, totalQuestions)
    return result
  } catch (error) {
    console.error('Error saving practice session:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-daily-tasks', async (event, userId) => {
  try {
    const tasks = await db.getDailyTasks(userId)
    return { success: true, tasks: tasks }
  } catch (error) {
    console.error('Error getting daily tasks:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('complete-daily-task', async (event, taskId) => {
  try {
    const result = await db.completeDailyTask(taskId)
    return result
  } catch (error) {
    console.error('Error completing daily task:', error)
    return { success: false, error: error.message }
  }
})

// Rule-based AI handlers
ipcMain.handle('analyze-student-performance', async (event, userId, grade) => {
  try {
    const ai = new RuleBasedAI()
    
    // Get student progress
    const progressResult = await db.getStudentTopicProgress(userId, grade)
    const topicsResult = await db.getCurriculumTopics(grade)
    
    const studentData = {
      grade: grade,
      progress: progressResult || []
    }
    
    const analysis = ai.analyzeStudentPerformance(studentData, topicsResult || [])
    return analysis
  } catch (error) {
    console.error('Error analyzing student performance:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('recommend-learning-path', async (event, userId, grade) => {
  try {
    const ai = new RuleBasedAI()
    
    // Get student progress and topics
    const progressResult = await db.getStudentTopicProgress(userId, grade)
    const topicsResult = await db.getCurriculumTopics(grade)
    
    const studentData = {
      grade: grade,
      progress: progressResult || []
    }
    
    const recommendations = ai.recommendLearningPath(studentData, topicsResult || [])
    return recommendations
  } catch (error) {
    console.error('Error recommending learning path:', error)
    return { success: false, error: error.message }
  }
})

// Curriculum-based question generation
ipcMain.handle('generate-curriculum-questions', async (event, topic, count = 10) => {
  try {
    const generator = new CurriculumQuestionGenerator()
    const questions = generator.generateQuestionsForTopic(topic, count, 0)
    return { success: true, questions: questions }
  } catch (error) {
    logger.error('Error generating curriculum questions', error)
    return { success: false, error: error.message }
  }
})

// Cleanup on app quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.closeDatabase().then(() => {
      app.quit()
    })
  }
})

// Password reset handlers
ipcMain.handle('request-password-reset', async (event, email) => {
  try {
    logger.info('Password reset requested', { email })
    const user = await db.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      logger.warn('Password reset requested for non-existent email', { email })
      return { success: true, message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    const tokenData = await db.createPasswordResetToken(user.id);
    logger.info('Password reset token created', { userId: user.id, email })
    
    // In a real application, you would send an email here
    // For now, we'll return the token (in production, this should be sent via email)
    return { 
      success: true, 
      message: 'Password reset token generated. In production, this would be sent via email.',
      token: tokenData.token // Only for development/testing
    };
  } catch (error) {
    logger.error('Password reset request failed', error, { email })
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reset-password', async (event, token, newPassword) => {
  try {
    logger.info('Password reset attempt', { token: token.substring(0, 8) + '...' })
    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Validate token
    const tokenData = await db.validatePasswordResetToken(token);
    if (!tokenData) {
      logger.warn('Invalid or expired password reset token', { token: token.substring(0, 8) + '...' })
      throw new Error('Invalid or expired reset token');
    }

    // Update password
    await db.updateUserPassword(tokenData.user_id, newPassword);
    
    // Mark token as used
    await db.usePasswordResetToken(token);
    
    // Invalidate all sessions for this user
    await db.deleteUserSessions(tokenData.user_id);
    
    logger.info('Password reset successful', { userId: tokenData.user_id })
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    logger.error('Password reset failed', error, { token: token.substring(0, 8) + '...' })
    return { success: false, error: error.message };
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
