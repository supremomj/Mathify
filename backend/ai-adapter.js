/**
 * AI Adapter for Adaptive Learning in Mathify
 * Integrates with OpenAI API to provide personalized learning content
 * based on student activity results and DepEd MATATAG Curriculum
 */

const OpenAI = require('openai');

class AdaptiveLearningAI {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
    this.curriculumContext = null;
  }

  /**
   * Analyze student performance and generate recommendations
   * @param {Object} studentData - Student progress data
   * @param {Array} curriculumTopics - Available curriculum topics
   * @returns {Promise<Object>} Analysis and recommendations
   */
  async analyzeStudentPerformance(studentData, curriculumTopics) {
    try {
      const prompt = this.buildAnalysisPrompt(studentData, curriculumTopics);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an educational AI assistant helping Filipino students learn mathematics according to DepEd MATATAG Curriculum standards. 
            Your role is to analyze student performance and provide personalized learning recommendations that align with the official curriculum.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const analysis = this.parseAnalysisResponse(response.choices[0].message.content);
      return {
        success: true,
        analysis: analysis,
        rawResponse: response.choices[0].message.content
      };
    } catch (error) {
      console.error('Error analyzing student performance:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackRecommendations(studentData)
      };
    }
  }

  /**
   * Generate adaptive content for a specific topic based on student performance
   * @param {Object} topic - Curriculum topic
   * @param {Object} studentProgress - Student's progress on this topic
   * @returns {Promise<Object>} Adaptive content (explanations, practice problems, etc.)
   */
  async generateAdaptiveContent(topic, studentProgress) {
    try {
      const prompt = this.buildContentPrompt(topic, studentProgress);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a math teacher creating personalized learning content for Filipino students. 
            All content must align with DepEd MATATAG Curriculum standards. Use Filipino context and examples where appropriate.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const content = this.parseContentResponse(response.choices[0].message.content);
      return {
        success: true,
        content: content
      };
    } catch (error) {
      console.error('Error generating adaptive content:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackContent(topic, studentProgress)
      };
    }
  }

  /**
   * Recommend next learning path based on student performance
   * @param {Object} studentData - Complete student progress data
   * @param {Array} availableTopics - Available curriculum topics
   * @returns {Promise<Object>} Recommended learning path
   */
  async recommendLearningPath(studentData, availableTopics) {
    try {
      const prompt = this.buildPathRecommendationPrompt(studentData, availableTopics);
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an educational advisor recommending learning paths for students. 
            Recommendations must follow DepEd MATATAG Curriculum sequence and consider student's current performance.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      const recommendations = this.parsePathRecommendations(response.choices[0].message.content);
      return {
        success: true,
        recommendations: recommendations
      };
    } catch (error) {
      console.error('Error recommending learning path:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackPath(studentData, availableTopics)
      };
    }
  }

  /**
   * Build prompt for performance analysis
   */
  buildAnalysisPrompt(studentData, curriculumTopics) {
    const completedTopics = studentData.progress?.filter(p => p.completed) || [];
    const inProgressTopics = studentData.progress?.filter(p => !p.completed && p.progress_percentage > 0) || [];
    const weakAreas = this.identifyWeakAreas(studentData.progress || []);
    
    return `
Analyze this Filipino student's math learning performance and provide recommendations:

STUDENT PERFORMANCE DATA:
- Grade Level: ${studentData.grade}
- Completed Topics: ${completedTopics.length}
- In Progress Topics: ${inProgressTopics.length}
- Average Score: ${this.calculateAverageScore(studentData.progress || [])}%
- Weak Areas: ${weakAreas.map(a => a.topic_title).join(', ') || 'None identified'}

TOPIC PROGRESS:
${(studentData.progress || []).map(p => 
  `- ${p.topic_title}: ${p.progress_percentage}% (Score: ${p.best_score}%, Attempts: ${p.attempts})`
).join('\n')}

AVAILABLE CURRICULUM TOPICS (DepEd MATATAG):
${curriculumTopics.slice(0, 10).map(t => 
  `- ${t.topic_title} (${t.category}) - ${t.learning_outcome}`
).join('\n')}

Please provide:
1. Performance Summary (2-3 sentences)
2. Top 3 Strengths
3. Top 3 Areas Needing Improvement
4. Recommended Next Topics (with reasoning)
5. Remedial Actions Needed (if any)
6. Difficulty Adjustment Recommendations

Format your response as JSON with these keys: summary, strengths, weaknesses, recommendedTopics, remedialActions, difficultyAdjustment
    `;
  }

  /**
   * Build prompt for adaptive content generation
   */
  buildContentPrompt(topic, studentProgress) {
    const difficulty = this.calculateDifficulty(studentProgress);
    const needsRemediation = studentProgress.progress_percentage < 70;
    
    return `
Generate adaptive learning content for a Filipino student learning mathematics.

CURRICULUM TOPIC (DepEd MATATAG):
- Title: ${topic.topic_title}
- Grade: ${topic.grade}
- Learning Outcome: ${topic.learning_outcome}
- Category: ${topic.category}

STUDENT PERFORMANCE:
- Current Progress: ${studentProgress.progress_percentage}%
- Best Score: ${studentProgress.best_score}%
- Attempts: ${studentProgress.attempts}
- Difficulty Level Needed: ${difficulty}/5
- Needs Remediation: ${needsRemediation ? 'Yes' : 'No'}

Generate the following content:

1. BRIEF EXPLANATION (2-3 sentences)
   - Adjust complexity to student's level
   - Use simple, clear language
   - Include Filipino context if relevant

2. THREE PRACTICE PROBLEMS
   - Difficulty appropriate for student's level
   - Include answer key
   - Use Filipino context (Philippine money, local examples)

3. REMEDIATION SUGGESTIONS (if score < 70%)
   - Specific areas to focus on
   - Step-by-step approach
   - Additional practice recommendations

Format as JSON with keys: explanation, practiceProblems (array), remediationSuggestions
    `;
  }

  /**
   * Build prompt for learning path recommendation
   */
  buildPathRecommendationPrompt(studentData, availableTopics) {
    return `
Recommend the optimal learning path for this student based on their performance and DepEd MATATAG Curriculum sequence.

STUDENT DATA:
- Grade: ${studentData.grade}
- Completed: ${studentData.completedCount || 0} topics
- Average Performance: ${this.calculateAverageScore(studentData.progress || [])}%

AVAILABLE TOPICS:
${availableTopics.map(t => 
  `- ${t.topic_title} (Order: ${t.order_index}, Category: ${t.category})`
).join('\n')}

Provide:
1. Next 3 recommended topics in sequence
2. Reasoning for each recommendation
3. Prerequisites to review (if any)
4. Estimated time to complete

Format as JSON with keys: nextTopics (array), reasoning, prerequisites, estimatedTime
    `;
  }

  /**
   * Parse AI analysis response
   */
  parseAnalysisResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: parse structured text
      return {
        summary: this.extractSection(response, 'Performance Summary', 'Top 3 Strengths'),
        strengths: this.extractList(response, 'Top 3 Strengths'),
        weaknesses: this.extractList(response, 'Top 3 Areas'),
        recommendedTopics: this.extractList(response, 'Recommended'),
        remedialActions: this.extractList(response, 'Remedial'),
        difficultyAdjustment: this.extractSection(response, 'Difficulty', '')
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return { raw: response };
    }
  }

  /**
   * Parse content response
   */
  parseContentResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        explanation: this.extractSection(response, 'EXPLANATION', 'PRACTICE'),
        practiceProblems: this.extractPracticeProblems(response),
        remediationSuggestions: this.extractSection(response, 'REMEDIATION', '')
      };
    } catch (error) {
      console.error('Error parsing content response:', error);
      return { raw: response };
    }
  }

  /**
   * Parse path recommendations
   */
  parsePathRecommendations(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        nextTopics: this.extractList(response, 'Next'),
        reasoning: this.extractSection(response, 'Reasoning', ''),
        prerequisites: this.extractList(response, 'Prerequisites'),
        estimatedTime: this.extractSection(response, 'Estimated', '')
      };
    } catch (error) {
      console.error('Error parsing path recommendations:', error);
      return { raw: response };
    }
  }

  // Helper methods
  identifyWeakAreas(progress) {
    return progress
      .filter(p => p.best_score < 70 || p.progress_percentage < 50)
      .sort((a, b) => a.best_score - b.best_score)
      .slice(0, 3);
  }

  calculateAverageScore(progress) {
    if (!progress || progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + (p.best_score || 0), 0);
    return Math.round(total / progress.length);
  }

  calculateDifficulty(studentProgress) {
    if (!studentProgress || studentProgress.progress_percentage === 0) return 3;
    if (studentProgress.progress_percentage < 50) return 1; // Very easy
    if (studentProgress.progress_percentage < 70) return 2; // Easy
    if (studentProgress.progress_percentage < 85) return 3; // Medium
    if (studentProgress.progress_percentage < 95) return 4; // Hard
    return 5; // Very hard
  }

  extractSection(text, startMarker, endMarker) {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
    return text.substring(startIndex + startMarker.length, endIndex).trim();
  }

  extractList(text, marker) {
    const section = this.extractSection(text, marker, '');
    const lines = section.split('\n').filter(line => line.trim().match(/^[-•\d]/));
    return lines.map(line => line.replace(/^[-•\d.\s]+/, '').trim());
  }

  extractPracticeProblems(text) {
    const problems = [];
    const problemMatches = text.match(/\d+\.\s*[^\d]+/g);
    if (problemMatches) {
      problems.push(...problemMatches.slice(0, 3));
    }
    return problems;
  }

  // Fallback methods (rule-based when AI fails)
  generateFallbackRecommendations(studentData) {
    const progress = studentData.progress || [];
    const weakAreas = this.identifyWeakAreas(progress);
    
    return {
      summary: `Student has completed ${progress.filter(p => p.completed).length} topics. Focus on areas with scores below 70%.`,
      recommendedTopics: weakAreas.map(w => w.topic_title),
      difficultyAdjustment: 'Medium'
    };
  }

  generateFallbackContent(topic, studentProgress) {
    const needsRemediation = studentProgress.progress_percentage < 70;
    
    return {
      explanation: `Let's learn about ${topic.topic_title}. This topic covers ${topic.learning_outcome}.`,
      practiceProblems: [
        `Practice problem 1 for ${topic.topic_title}`,
        `Practice problem 2 for ${topic.topic_title}`,
        `Practice problem 3 for ${topic.topic_title}`
      ],
      remediationSuggestions: needsRemediation 
        ? ['Review basic concepts', 'Practice more examples', 'Take your time']
        : []
    };
  }

  generateFallbackPath(studentData, availableTopics) {
    const completedIds = (studentData.progress || [])
      .filter(p => p.completed)
      .map(p => p.topic_id);
    
    const nextTopics = availableTopics
      .filter(t => !completedIds.includes(t.id))
      .sort((a, b) => a.order_index - b.order_index)
      .slice(0, 3);
    
    return {
      nextTopics: nextTopics.map(t => t.topic_title),
      reasoning: 'Following curriculum sequence',
      prerequisites: [],
      estimatedTime: '2-3 weeks'
    };
  }
}

module.exports = AdaptiveLearningAI;

