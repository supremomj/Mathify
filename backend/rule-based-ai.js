/**
 * Rule-Based AI for Adaptive Learning in Mathify
 * Provides personalized recommendations using predefined rules and logic
 * No external API required - works offline and is privacy-friendly
 */

class RuleBasedAI {
  constructor() {
    // Performance thresholds
    this.THRESHOLDS = {
      EXCELLENT: 90,    // 90%+ = Excellent
      GOOD: 70,         // 70-89% = Good
      NEEDS_PRACTICE: 50, // 50-69% = Needs Practice
      WEAK: 0           // <50% = Weak
    };

    // Difficulty levels
    this.DIFFICULTY_LEVELS = {
      VERY_EASY: 1,
      EASY: 2,
      MEDIUM: 3,
      HARD: 4,
      VERY_HARD: 5
    };
  }

  /**
   * Analyze student performance and generate recommendations
   * @param {Object} studentData - Student progress data
   * @param {Array} curriculumTopics - Available curriculum topics
   * @returns {Object} Analysis and recommendations
   */
  analyzeStudentPerformance(studentData, curriculumTopics) {
    const progress = studentData.progress || [];
    const grade = studentData.grade;

    // Calculate statistics
    const stats = this.calculateStatistics(progress);
    
    // Identify strengths and weaknesses
    const strengths = this.identifyStrengths(progress);
    const weaknesses = this.identifyWeaknesses(progress);
    
    // Recommend next topics
    const recommendedTopics = this.recommendNextTopics(
      progress,
      curriculumTopics,
      grade
    );
    
    // Determine if remediation is needed
    const needsRemediation = this.needsRemediation(progress);
    
    // Generate summary
    const summary = this.generateSummary(stats, progress.length, grade);
    
    // Difficulty adjustment
    const difficultyAdjustment = this.recommendDifficultyAdjustment(stats);

    return {
      success: true,
      analysis: {
        summary: summary,
        strengths: strengths,
        weaknesses: weaknesses,
        recommendedTopics: recommendedTopics,
        remedialActions: needsRemediation ? this.getRemedialActions(weaknesses) : [],
        difficultyAdjustment: difficultyAdjustment,
        statistics: stats
      }
    };
  }

  /**
   * Calculate performance statistics
   */
  calculateStatistics(progress) {
    if (!progress || progress.length === 0) {
      return {
        averageScore: 0,
        completionRate: 0,
        totalTopics: 0,
        completedTopics: 0,
        inProgressTopics: 0,
        notStartedTopics: 0
      };
    }

    const completed = progress.filter(p => p.completed);
    const inProgress = progress.filter(p => !p.completed && p.progress_percentage > 0);
    const totalScore = progress.reduce((sum, p) => sum + (p.best_score || 0), 0);
    const avgScore = Math.round(totalScore / progress.length);

    return {
      averageScore: avgScore,
      completionRate: Math.round((completed.length / progress.length) * 100),
      totalTopics: progress.length,
      completedTopics: completed.length,
      inProgressTopics: inProgress.length,
      notStartedTopics: progress.length - completed.length - inProgress.length
    };
  }

  /**
   * Identify student strengths (topics with high scores)
   */
  identifyStrengths(progress) {
    const strengths = progress
      .filter(p => p.best_score >= this.THRESHOLDS.EXCELLENT && p.completed)
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, 3)
      .map(p => p.topic_title || `Topic with ${p.best_score}% score`);

    if (strengths.length === 0) {
      // If no excellent scores, find good scores
      const goodTopics = progress
        .filter(p => p.best_score >= this.THRESHOLDS.GOOD)
        .sort((a, b) => b.best_score - a.best_score)
        .slice(0, 3)
        .map(p => p.topic_title || `Topic with ${p.best_score}% score`);
      
      return goodTopics.length > 0 ? goodTopics : ['Keep practicing to build your strengths!'];
    }

    return strengths;
  }

  /**
   * Identify areas needing improvement
   */
  identifyWeaknesses(progress) {
    const weaknesses = progress
      .filter(p => 
        (p.best_score < this.THRESHOLDS.GOOD && p.attempts > 0) ||
        (p.progress_percentage > 0 && p.progress_percentage < 50)
      )
      .sort((a, b) => (a.best_score || 0) - (b.best_score || 0))
      .slice(0, 3)
      .map(p => ({
        topic: p.topic_title || 'Unknown Topic',
        score: p.best_score || 0,
        progress: p.progress_percentage || 0
      }));

    return weaknesses.map(w => 
      `${w.topic} (Score: ${w.score}%, Progress: ${w.progress}%)`
    );
  }

  /**
   * Recommend next topics based on curriculum order and performance
   */
  recommendNextTopics(progress, curriculumTopics, grade) {
    if (!curriculumTopics || curriculumTopics.length === 0) {
      return [];
    }

    // Get completed topic IDs
    const completedIds = progress
      .filter(p => p.completed)
      .map(p => p.topic_id);

    // Find next uncompleted topics in curriculum order
    const availableTopics = curriculumTopics
      .filter(t => !completedIds.includes(t.id))
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    // Rule 1: If student has weak areas, recommend reviewing those first
    const weakTopics = progress
      .filter(p => p.best_score < this.THRESHOLDS.GOOD && !p.completed && p.attempts > 0)
      .map(p => {
        const topic = curriculumTopics.find(t => t.id === p.topic_id);
        return topic ? { ...topic, priority: 'remediation' } : null;
      })
      .filter(t => t !== null)
      .slice(0, 2);

    // Rule 2: Recommend next topics in curriculum sequence
    const nextInSequence = availableTopics.slice(0, 3);

    // Rule 3: If student is doing well, skip ahead to next category
    const stats = this.calculateStatistics(progress);
    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT && stats.completionRate >= 80) {
      // Student is excelling - recommend next category
      const currentCategories = progress
        .filter(p => p.completed)
        .map(p => {
          const topic = curriculumTopics.find(t => t.id === p.topic_id);
          return topic ? topic.category : null;
        })
        .filter(c => c !== null);
      
      const nextCategoryTopics = availableTopics
        .filter(t => !currentCategories.includes(t.category))
        .slice(0, 2);
      
      if (nextCategoryTopics.length > 0) {
        return nextCategoryTopics.map(t => t.topic_title);
      }
    }

    // Combine recommendations: remediation first, then sequence
    const recommendations = [
      ...weakTopics.map(t => t.topic_title),
      ...nextInSequence.map(t => t.topic_title)
    ].slice(0, 3);

    return recommendations.length > 0 
      ? recommendations 
      : ['Great job! You\'ve completed all available topics.'];
  }

  /**
   * Check if student needs remediation
   */
  needsRemediation(progress) {
    const stats = this.calculateStatistics(progress);
    
    // Rule: Need remediation if average score < 70% or completion rate < 50%
    return stats.averageScore < this.THRESHOLDS.GOOD || 
           stats.completionRate < 50 ||
           progress.some(p => p.best_score < this.THRESHOLDS.NEEDS_PRACTICE && p.attempts >= 2);
  }

  /**
   * Get remedial actions based on weaknesses
   */
  getRemedialActions(weaknesses) {
    if (weaknesses.length === 0) {
      return [];
    }

    const actions = [
      'Review the basic concepts of the weak topics',
      'Practice more problems in those areas',
      'Take your time and don\'t rush',
      'Ask for help if needed'
    ];

    return actions;
  }

  /**
   * Generate performance summary
   */
  generateSummary(stats, totalProgress, grade) {
    if (stats.totalTopics === 0) {
      return `Welcome to Grade ${grade}! Start your learning journey by completing your first topic.`;
    }

    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT) {
      return `Excellent work! You're performing at ${stats.averageScore}% average with ${stats.completedTopics} topics completed. Keep up the great progress!`;
    } else if (stats.averageScore >= this.THRESHOLDS.GOOD) {
      return `Good progress! You're averaging ${stats.averageScore}% with ${stats.completedTopics} topics completed. Continue practicing to improve further.`;
    } else if (stats.averageScore >= this.THRESHOLDS.NEEDS_PRACTICE) {
      return `You've completed ${stats.completedTopics} topics with a ${stats.averageScore}% average. Focus on reviewing weak areas to improve your scores.`;
    } else {
      return `You've started ${stats.totalTopics} topics. Your current average is ${stats.averageScore}%. Let's focus on building a strong foundation - review the basics and practice more.`;
    }
  }

  /**
   * Recommend difficulty adjustment
   */
  recommendDifficultyAdjustment(stats) {
    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT) {
      return 'Increase difficulty - You\'re ready for more challenging problems!';
    } else if (stats.averageScore >= this.THRESHOLDS.GOOD) {
      return 'Maintain current difficulty - You\'re doing well at this level.';
    } else if (stats.averageScore >= this.THRESHOLDS.NEEDS_PRACTICE) {
      return 'Slightly reduce difficulty - Focus on mastering the basics first.';
    } else {
      return 'Reduce difficulty - Let\'s go back to fundamentals and build confidence.';
    }
  }

  /**
   * Calculate appropriate difficulty level for a topic
   */
  calculateDifficulty(studentProgress) {
    if (!studentProgress || studentProgress.progress_percentage === 0) {
      return this.DIFFICULTY_LEVELS.MEDIUM; // Default for new topics
    }

    const score = studentProgress.best_score || 0;
    const progress = studentProgress.progress_percentage || 0;

    if (score >= this.THRESHOLDS.EXCELLENT && progress >= 90) {
      return this.DIFFICULTY_LEVELS.VERY_HARD;
    } else if (score >= this.THRESHOLDS.GOOD && progress >= 70) {
      return this.DIFFICULTY_LEVELS.HARD;
    } else if (score >= this.THRESHOLDS.NEEDS_PRACTICE || progress >= 50) {
      return this.DIFFICULTY_LEVELS.MEDIUM;
    } else if (score >= this.THRESHOLDS.WEAK || progress >= 25) {
      return this.DIFFICULTY_LEVELS.EASY;
    } else {
      return this.DIFFICULTY_LEVELS.VERY_EASY;
    }
  }

  /**
   * Recommend learning path based on performance
   */
  recommendLearningPath(studentData, availableTopics) {
    const progress = studentData.progress || [];
    const recommendedTopics = this.recommendNextTopics(progress, availableTopics, studentData.grade);
    const stats = this.calculateStatistics(progress);

    // Estimate time based on performance
    let estimatedTime = '2-3 weeks';
    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT) {
      estimatedTime = '1-2 weeks';
    } else if (stats.averageScore < this.THRESHOLDS.NEEDS_PRACTICE) {
      estimatedTime = '3-4 weeks';
    }

    // Determine prerequisites
    const prerequisites = [];
    if (stats.averageScore < this.THRESHOLDS.GOOD) {
      prerequisites.push('Review basic concepts from previous topics');
    }

    return {
      success: true,
      recommendations: {
        nextTopics: recommendedTopics,
        reasoning: this.generatePathReasoning(stats, progress, availableTopics),
        prerequisites: prerequisites,
        estimatedTime: estimatedTime
      }
    };
  }

  /**
   * Generate reasoning for learning path
   */
  generatePathReasoning(stats, progress, availableTopics) {
    if (stats.completedTopics === 0) {
      return 'Start with the first topic in the curriculum to build a strong foundation.';
    }

    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT) {
      return 'You\'re excelling! Continue with the next topics in sequence. You may be ready to explore more advanced concepts.';
    } else if (stats.averageScore >= this.THRESHOLDS.GOOD) {
      return 'You\'re doing well! Follow the curriculum sequence and maintain your current pace.';
    } else {
      return 'Focus on mastering the current topics before moving forward. Review weak areas and practice more.';
    }
  }

  /**
   * Get personalized encouragement message
   */
  getEncouragementMessage(stats) {
    if (stats.completedTopics === 0) {
      return '🎯 Ready to start your math journey? Let\'s begin with your first topic!';
    }

    if (stats.averageScore >= this.THRESHOLDS.EXCELLENT) {
      return '🌟 Amazing work! You\'re a math superstar! Keep challenging yourself!';
    } else if (stats.averageScore >= this.THRESHOLDS.GOOD) {
      return '👍 Great job! You\'re making excellent progress. Keep it up!';
    } else if (stats.averageScore >= this.THRESHOLDS.NEEDS_PRACTICE) {
      return '💪 You\'re improving! Keep practicing and you\'ll get even better!';
    } else {
      return '🌱 Every expert was once a beginner. Keep practicing and you\'ll improve!';
    }
  }
}

module.exports = RuleBasedAI;

