/**
 * Example: How to integrate AI Adaptive Learning into Mathify
 * This file shows how to use the AI adapter in your existing system
 */

const AdaptiveLearningAI = require('./ai-adapter');
const db = require('./database'); // Your existing database module

// Initialize AI adapter (set OPENAI_API_KEY in environment variables)
const aiAdapter = new AdaptiveLearningAI(process.env.OPENAI_API_KEY);

/**
 * Example 1: Analyze student performance and get recommendations
 */
async function analyzeStudentPerformanceExample(userId, grade) {
  try {
    // Get student progress from database
    const progressResult = await window.electronAPI.invoke('get-student-topic-progress', userId, grade);
    const curriculumResult = await window.electronAPI.invoke('get-curriculum-topics', grade);
    
    const studentData = {
      grade: grade,
      progress: progressResult.progress || [],
      completedCount: progressResult.progress?.filter(p => p.completed).length || 0
    };
    
    // Get AI analysis
    const analysis = await aiAdapter.analyzeStudentPerformance(
      studentData,
      curriculumResult.topics || []
    );
    
    if (analysis.success) {
      console.log('AI Analysis:', analysis.analysis);
      
      // Save recommendations to database
      if (analysis.analysis.recommendedTopics) {
        for (const topic of analysis.analysis.recommendedTopics) {
          // Save to ai_recommendations table (you'll need to create this)
          await saveAIRecommendation(userId, topic, analysis.analysis);
        }
      }
      
      return analysis.analysis;
    } else {
      // Use fallback recommendations
      console.log('Using fallback recommendations:', analysis.fallback);
      return analysis.fallback;
    }
  } catch (error) {
    console.error('Error in performance analysis:', error);
    return null;
  }
}

/**
 * Example 2: Generate adaptive content for a topic
 */
async function generateAdaptiveContentExample(userId, topicId) {
  try {
    // Get topic and student progress
    const topicResult = await window.electronAPI.invoke('get-curriculum-topic', topicId);
    const progressResult = await window.electronAPI.invoke('get-student-topic-progress', userId, null);
    
    const topic = topicResult.topic;
    const studentProgress = progressResult.progress?.find(p => p.topic_id === topicId) || {
      progress_percentage: 0,
      best_score: 0,
      attempts: 0
    };
    
    // Generate adaptive content
    const contentResult = await aiAdapter.generateAdaptiveContent(topic, studentProgress);
    
    if (contentResult.success) {
      console.log('Generated Content:', contentResult.content);
      
      // Save to database
      await saveAdaptiveContent(userId, topicId, contentResult.content);
      
      return contentResult.content;
    } else {
      // Use fallback content
      console.log('Using fallback content:', contentResult.fallback);
      return contentResult.fallback;
    }
  } catch (error) {
    console.error('Error generating adaptive content:', error);
    return null;
  }
}

/**
 * Example 3: Get personalized learning path
 */
async function getPersonalizedLearningPath(userId, grade) {
  try {
    // Get student data
    const progressResult = await window.electronAPI.invoke('get-student-topic-progress', userId, grade);
    const curriculumResult = await window.electronAPI.invoke('get-curriculum-topics', grade);
    
    const studentData = {
      grade: grade,
      progress: progressResult.progress || [],
      completedCount: progressResult.progress?.filter(p => p.completed).length || 0
    };
    
    // Get AI recommendations
    const pathResult = await aiAdapter.recommendLearningPath(
      studentData,
      curriculumResult.topics || []
    );
    
    if (pathResult.success) {
      console.log('Recommended Path:', pathResult.recommendations);
      return pathResult.recommendations;
    } else {
      // Use fallback path
      console.log('Using fallback path:', pathResult.fallback);
      return pathResult.fallback;
    }
  } catch (error) {
    console.error('Error getting learning path:', error);
    return null;
  }
}

/**
 * Example 4: Integrate into student dashboard
 * Add this to your student-dashboard.html
 */
async function loadAIRecommendations() {
  if (!currentUser) return;
  
  try {
    // Show loading state
    const aiSuggestionsDiv = document.getElementById('aiSuggestions');
    if (aiSuggestionsDiv) {
      aiSuggestionsDiv.innerHTML = '<p>🤖 AI is analyzing your performance...</p>';
    }
    
    // Get AI analysis
    const analysis = await analyzeStudentPerformanceExample(
      currentUser.id,
      currentUser.studentGrade
    );
    
    if (analysis) {
      // Display recommendations
      displayAIRecommendations(analysis);
    }
  } catch (error) {
    console.error('Error loading AI recommendations:', error);
  }
}

function displayAIRecommendations(analysis) {
  const container = document.getElementById('aiSuggestions');
  if (!container) return;
  
  container.innerHTML = `
    <div class="ai-suggestions">
      <h3>🤖 AI Learning Recommendations</h3>
      
      ${analysis.summary ? `
        <div class="suggestion-item">
          <strong>Summary:</strong> ${analysis.summary}
        </div>
      ` : ''}
      
      ${analysis.strengths && analysis.strengths.length > 0 ? `
        <div class="suggestion-item">
          <strong>Your Strengths:</strong>
          <ul>
            ${analysis.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${analysis.weaknesses && analysis.weaknesses.length > 0 ? `
        <div class="suggestion-item">
          <strong>Areas to Improve:</strong>
          <ul>
            ${analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${analysis.recommendedTopics && analysis.recommendedTopics.length > 0 ? `
        <div class="suggestion-item">
          <strong>Recommended Next Topics:</strong>
          <ul>
            ${analysis.recommendedTopics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Example 5: Use adaptive content in game interface
 */
async function loadAdaptiveContentForTopic(topic) {
  if (!currentUser || !topic) return null;
  
  try {
    // Get student's progress on this topic
    const progressResult = await window.electronAPI.invoke(
      'get-student-topic-progress',
      currentUser.id,
      currentUser.studentGrade
    );
    
    const studentProgress = progressResult.progress?.find(p => p.topic_id === topic.id) || {
      progress_percentage: 0,
      best_score: 0,
      attempts: 0
    };
    
    // Generate adaptive content
    const content = await generateAdaptiveContentExample(currentUser.id, topic.id);
    
    if (content) {
      // Use adaptive explanation in game
      if (content.explanation) {
        // Display explanation before starting questions
        showAdaptiveExplanation(content.explanation);
      }
      
      // Use adaptive practice problems
      if (content.practiceProblems && content.practiceProblems.length > 0) {
        // Integrate into question generation
        return adaptQuestionsToContent(content.practiceProblems);
      }
      
      // Show remediation if needed
      if (content.remediationSuggestions && content.remediationSuggestions.length > 0) {
        showRemediationSuggestions(content.remediationSuggestions);
      }
    }
    
    return content;
  } catch (error) {
    console.error('Error loading adaptive content:', error);
    return null;
  }
}

// Helper functions (you'll need to implement these based on your database structure)
async function saveAIRecommendation(userId, topic, analysis) {
  // Save to ai_recommendations table
  // Implementation depends on your database structure
}

async function saveAdaptiveContent(userId, topicId, content) {
  // Save to adaptive_content table
  // Implementation depends on your database structure
}

function showAdaptiveExplanation(explanation) {
  // Display explanation in UI
  // You can add this to your game interface
}

function adaptQuestionsToContent(practiceProblems) {
  // Convert AI-generated problems into game questions
  // This would integrate with your generateGameQuestions function
}

function showRemediationSuggestions(suggestions) {
  // Display remediation suggestions
  // Could be a modal or sidebar in the game interface
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeStudentPerformanceExample,
    generateAdaptiveContentExample,
    getPersonalizedLearningPath,
    loadAIRecommendations,
    loadAdaptiveContentForTopic
  };
}

