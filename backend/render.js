const { contextBridge, ipcRenderer } = require('electron')

// Expose navigation functions to renderer process securely
contextBridge.exposeInMainWorld('navigateToLanding', () => {
  ipcRenderer.send('navigate-to', 'landing')
})

contextBridge.exposeInMainWorld('navigateToAuth', () => {
  ipcRenderer.send('navigate-to', 'auth')
})

contextBridge.exposeInMainWorld('navigateToStudentDashboard', () => {
  ipcRenderer.send('navigate-to', 'student-dashboard')
})

contextBridge.exposeInMainWorld('navigateToAdminDashboard', () => {
  ipcRenderer.send('navigate-to', 'admin-dashboard')
})

// Session token management (using Electron's safeStorage or sessionStorage)
// Note: In Electron, we'll use a simple in-memory approach with IPC to main process
let sessionToken = null

// Helper to get/set token from renderer's sessionStorage
const getToken = () => {
  try {
    return sessionStorage.getItem('sessionToken')
  } catch (e) {
    return null
  }
}

const setToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem('sessionToken', token)
    } else {
      sessionStorage.removeItem('sessionToken')
    }
  } catch (e) {
    // Ignore if sessionStorage not available
  }
}

// Expose authentication functions
contextBridge.exposeInMainWorld('auth', {
  register: async (userData) => {
    const result = await ipcRenderer.invoke('register', userData)
    if (result.success && result.token) {
      sessionToken = result.token
      setToken(result.token)
    }
    return result
  },
  login: async (email, password) => {
    const result = await ipcRenderer.invoke('login', email, password)
    if (result.success && result.token) {
      sessionToken = result.token
      setToken(result.token)
    }
    return result
  },
  getCurrentUser: async () => {
    if (!sessionToken) {
      sessionToken = getToken()
    }
    return ipcRenderer.invoke('get-current-user', sessionToken)
  },
  logout: async () => {
    const result = await ipcRenderer.invoke('logout', sessionToken)
    sessionToken = null
    setToken(null)
    return result
  },
  validateSession: async () => {
    if (!sessionToken) {
      sessionToken = getToken()
    }
    if (!sessionToken) return { valid: false }
    return ipcRenderer.invoke('validate-session', sessionToken)
  },
  getChildren: (parentId) => ipcRenderer.invoke('get-children', parentId),
  addChild: (parentId, childName, grade) => ipcRenderer.invoke('add-child', parentId, childName, grade),
  deleteChild: (childId) => ipcRenderer.invoke('delete-child', childId),
  getChild: (childId) => ipcRenderer.invoke('get-child', childId),
  updateChild: (childId, updates) => ipcRenderer.invoke('update-child', childId, updates),
  updateStudentGrade: (userId, grade) => ipcRenderer.invoke('update-student-grade', userId, grade),
  requestPasswordReset: (email) => ipcRenderer.invoke('request-password-reset', email),
  resetPassword: (token, newPassword) => ipcRenderer.invoke('reset-password', token, newPassword)
})

// Expose electron API for student features
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => {
    // Automatically attach the current session token as the last argument
    if (!sessionToken) {
      sessionToken = getToken()
    }
    return ipcRenderer.invoke(channel, ...args, sessionToken)
  }
})

// Expose account creation function (admin only)
contextBridge.exposeInMainWorld('adminAPI', {
  createUser: (userData) => ipcRenderer.invoke('create-user', userData)
})
