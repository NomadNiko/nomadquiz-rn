// Quiz Service for Open Trivia Database API integration
import { leaderboardService } from './leaderboardService';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizCategory {
  id: number | null; // null for "all categories" (PubQuiz)
  name: string;
  displayName: string;
}

export interface TriviaQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  answers: string[];
  difficulty: QuizDifficulty;
}

export interface QuizSession {
  id: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  timePerQuestion: number;
  startTime: Date | string; // Can be string when serialized through router params
  isLoadingMoreQuestions?: boolean; // Background loading state
  expectedTotalQuestions: number; // Total questions we expect to have
}

export interface QuizResult {
  sessionId: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  averageTimePerQuestion: number;
  completedAt: Date;
}

class QuizService {
  private readonly TRIVIA_API_BASE = 'https://opentdb.com';
  private readonly QUESTIONS_PER_QUIZ = 10;
  private readonly TIME_PER_QUESTION = 10; // seconds
  
  // Session token management
  private sessionToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  private readonly TOKEN_LIFETIME_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  // Available quiz categories
  readonly CATEGORIES: QuizCategory[] = [
    { id: null, name: 'pubquiz', displayName: 'PubQuiz' },
    { id: 9, name: 'general', displayName: 'General' },
    { id: 18, name: 'computers', displayName: 'Computers' },
    { id: 20, name: 'mythology', displayName: 'Mythology' },
    { id: 23, name: 'history', displayName: 'History' },
    { id: 29, name: 'comics', displayName: 'Comics' },
    { id: 30, name: 'gadgets', displayName: 'Gadgets' },
    { id: 32, name: 'toons', displayName: 'Toons' },
  ];

  // Decode HTML entities from Open Trivia DB (React Native compatible)
  private decodeHtml(html: string): string {
    const htmlEntities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&apos;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
      '&pi;': 'π',
      '&deg;': '°',
      '&nbsp;': ' ',
    };

    return html.replace(/&[#\w]+;/g, (entity) => {
      return htmlEntities[entity] || entity;
    });
  }

  // Shuffle array helper
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Session token management methods
  private async getSessionToken(): Promise<string> {
    const now = Date.now();
    
    // Check if we have a valid token that hasn't expired
    if (this.sessionToken && this.tokenExpiryTime && now < this.tokenExpiryTime) {
      console.log('🎫 Using existing session token');
      return this.sessionToken;
    }
    
    console.log('🎫 Requesting new session token');
    try {
      const response = await fetch(`${this.TRIVIA_API_BASE}/api_token.php?command=request`);
      if (!response.ok) {
        throw new Error(`Failed to get session token: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.response_code !== 0 || !data.token) {
        throw new Error(`Invalid token response: ${data.response_code}`);
      }
      
      this.sessionToken = data.token;
      this.tokenExpiryTime = now + this.TOKEN_LIFETIME_MS;
      console.log('✅ New session token acquired');
      return this.sessionToken;
    } catch (error) {
      console.error('❌ Failed to get session token:', error);
      // Continue without token if it fails
      return '';
    }
  }

  private async resetSessionToken(): Promise<void> {
    if (!this.sessionToken) return;
    
    console.log('🔄 Resetting session token due to exhausted questions');
    try {
      const response = await fetch(`${this.TRIVIA_API_BASE}/api_token.php?command=reset&token=${this.sessionToken}`);
      if (!response.ok) {
        throw new Error(`Failed to reset token: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.response_code === 0) {
        console.log('✅ Session token reset successfully');
        // Update expiry time since reset refreshes the token
        this.tokenExpiryTime = Date.now() + this.TOKEN_LIFETIME_MS;
      } else {
        console.warn('⚠️ Token reset returned non-zero code:', data.response_code);
        // Clear token to force new one
        this.sessionToken = null;
        this.tokenExpiryTime = null;
      }
    } catch (error) {
      console.error('❌ Failed to reset session token:', error);
      // Clear token to force new one
      this.sessionToken = null;
      this.tokenExpiryTime = null;
    }
  }

  async fetchInitialQuestions(difficulty: QuizDifficulty, category: QuizCategory): Promise<QuizQuestion[]> {
    console.log(`🎯 Starting fetchInitialQuestions for ${difficulty} difficulty, category: ${category.displayName} (ID: ${category.id})`);
    
    try {
      if (difficulty === 'easy') {
        console.log('📝 Easy mode: Fetching 10 easy questions');
        const questions = await this.fetchQuestionsForDifficulty('easy', category, 10);
        console.log(`✅ Easy mode complete: Got ${questions.length} questions`);
        return questions;
      } else if (difficulty === 'medium') {
        console.log('📝 Medium mode: Fetching first 5 easy questions to start quiz');
        const easyQuestions = await this.fetchQuestionsForDifficulty('easy', category, 5);
        console.log(`✅ Got ${easyQuestions.length} easy questions - quiz can start!`);
        return easyQuestions;
      } else if (difficulty === 'hard') {
        console.log('📝 Hard mode: Fetching first 5 medium questions to start quiz');
        const mediumQuestions = await this.fetchQuestionsForDifficulty('medium', category, 5);
        console.log(`✅ Got ${mediumQuestions.length} medium questions - quiz can start!`);
        return mediumQuestions;
      }

      throw new Error('Invalid difficulty level');
    } catch (error) {
      console.error('❌ Error in fetchInitialQuestions:', error);
      
      // Check if it's a rate limit or server busy error
      if (error instanceof Error && (
        error.message.includes('429') || 
        error.message.includes('Rate Limited') ||
        error.message.includes('Too many requests')
      )) {
        throw new Error('The quiz server is currently busy. Please wait a moment and try again.');
      }
      
      // Check if it's insufficient questions error
      if (error instanceof Error && error.message.includes('No Results')) {
        throw new Error(`Not enough ${difficulty} questions available for ${category.displayName}. Please try a different category or difficulty.`);
      }
      
      // Generic fallback
      throw new Error('Unable to load quiz questions right now. Please check your internet connection and try again.');
    }
  }

  async fetchRemainingQuestions(difficulty: QuizDifficulty, category: QuizCategory): Promise<QuizQuestion[]> {
    console.log(`🔄 Background: Fetching remaining questions for ${difficulty} mode`);
    
    try {
      if (difficulty === 'easy') {
        // Easy mode already has all 10 questions
        return [];
      } else if (difficulty === 'medium') {
        console.log('🔄 Background: Fetching 5 medium questions...');
        const mediumQuestions = await this.fetchQuestionsForDifficulty('medium', category, 5);
        console.log(`✅ Background: Got ${mediumQuestions.length} medium questions`);
        return mediumQuestions;
      } else if (difficulty === 'hard') {
        console.log('🔄 Background: Fetching 5 hard questions...');
        const hardQuestions = await this.fetchQuestionsForDifficulty('hard', category, 5);
        console.log(`✅ Background: Got ${hardQuestions.length} hard questions`);
        return hardQuestions;
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching remaining questions in background:', error);
      // Don't throw - we'll keep retrying in background
      return [];
    }
  }

  private async fetchQuestionsForDifficulty(
    difficulty: 'easy' | 'medium' | 'hard', 
    category: QuizCategory, 
    amount: number,
    retryAttempt: number = 0
  ): Promise<QuizQuestion[]> {
    const maxRetries = 3;
    const baseDelay = 2000; // Start with 2 seconds
    
    // Get session token for unique questions
    const token = await this.getSessionToken();
    
    // Build URL with optional category parameter and session token
    let url = `${this.TRIVIA_API_BASE}/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple&encode=url3986`;
    if (category.id !== null) {
      url += `&category=${category.id}`;
    }
    if (token) {
      url += `&token=${token}`;
    }
    
    const attemptLabel = retryAttempt > 0 ? ` (Retry ${retryAttempt}/${maxRetries})` : '';
    console.log(`🌐 Making API call${attemptLabel}: ${url}`);
    const startTime = Date.now();
    
    try {
      const response = await fetch(url);
      const duration = Date.now() - startTime;
      
      console.log(`📡 API Response: ${response.status} (${duration}ms)${attemptLabel}`);

      if (!response.ok) {
        if (response.status === 429 && retryAttempt < maxRetries) {
          // Rate limited - retry with exponential backoff
          const delay = baseDelay * Math.pow(2, retryAttempt); // 2s, 4s, 8s
          console.log(`⏳ Rate limited! Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchQuestionsForDifficulty(difficulty, category, amount, retryAttempt + 1);
        }
        
        console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TriviaResponse = await response.json();
      console.log(`📊 API Response Data:`, {
        response_code: data.response_code,
        results_count: data.results?.length || 0,
        requested_amount: amount,
        requested_difficulty: difficulty,
        category_id: category.id
      });

      if (data.response_code !== 0) {
        // Handle token-specific errors
        if (data.response_code === 3) { // Token Not Found
          console.log('🔄 Token not found, requesting new token...');
          this.sessionToken = null;
          this.tokenExpiryTime = null;
          if (retryAttempt < maxRetries) {
            return this.fetchQuestionsForDifficulty(difficulty, category, amount, retryAttempt + 1);
          }
        } else if (data.response_code === 4) { // Token Empty - reset and retry
          console.log('🔄 Token exhausted, resetting token...');
          await this.resetSessionToken();
          if (retryAttempt < maxRetries) {
            return this.fetchQuestionsForDifficulty(difficulty, category, amount, retryAttempt + 1);
          }
        } else if (data.response_code === 5 && retryAttempt < maxRetries) { // Rate limit response code
          const delay = baseDelay * Math.pow(2, retryAttempt);
          console.log(`⏳ API rate limited! Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchQuestionsForDifficulty(difficulty, category, amount, retryAttempt + 1);
        }
        
        console.error(`❌ Trivia API Error Code: ${data.response_code}`);
        // Log common error codes for debugging
        const errorMessages = {
          1: 'No Results: Could not return results. The API doesn\'t have enough questions for your query.',
          2: 'Invalid Parameter: Contains an invalid parameter. Arguements passed in aren\'t valid.',
          3: 'Token Not Found: Session Token does not exist.',
          4: 'Token Empty: Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.',
          5: 'Rate Limited: Too many requests. Please slow down your requests.'
        };
        const errorMsg = errorMessages[data.response_code as keyof typeof errorMessages] || `Unknown error code: ${data.response_code}`;
        console.error(`📝 Error Details: ${errorMsg}`);
        throw new Error(`Trivia API error! code: ${data.response_code} - ${errorMsg}`);
      }

      const questions = data.results.map((question, index) => {
        // Decode URL-encoded strings first, then HTML entities
        const decodedQuestion = this.decodeHtml(decodeURIComponent(question.question));
        const decodedCorrect = this.decodeHtml(decodeURIComponent(question.correct_answer));
        const decodedIncorrected = question.incorrect_answers.map(answer => 
          this.decodeHtml(decodeURIComponent(answer))
        );

        // Create shuffled answers array
        const allAnswers = [decodedCorrect, ...decodedIncorrected];
        const shuffledAnswers = this.shuffleArray(allAnswers);

        return {
          id: `q_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: question.category,
          question: decodedQuestion,
          correctAnswer: decodedCorrect,
          answers: shuffledAnswers,
          difficulty: difficulty as QuizDifficulty, // Use the actual difficulty of the question
        };
      });

      console.log(`✅ Successfully processed ${questions.length} questions for ${difficulty} difficulty${attemptLabel}`);
      return questions;
      
    } catch (error) {
      if (retryAttempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryAttempt);
        console.log(`⏳ Request failed! Retrying in ${delay}ms... (${retryAttempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchQuestionsForDifficulty(difficulty, category, amount, retryAttempt + 1);
      }
      
      // All retries exhausted
      console.error(`❌ All ${maxRetries} retry attempts failed for ${difficulty} questions`);
      throw error;
    }
  }

  createQuizSession(difficulty: QuizDifficulty, category: QuizCategory, questions: QuizQuestion[]): QuizSession {
    // Easy mode gets 20 seconds, others get 10 seconds
    const timePerQuestion = difficulty === 'easy' ? 20 : this.TIME_PER_QUESTION;
    const expectedTotal = this.QUESTIONS_PER_QUIZ;
    const needsMoreQuestions = difficulty !== 'easy' && questions.length < expectedTotal;
    
    return {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      difficulty,
      category,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      timePerQuestion,
      startTime: new Date(),
      isLoadingMoreQuestions: needsMoreQuestions,
      expectedTotalQuestions: expectedTotal,
    };
  }

  updateSessionWithMoreQuestions(session: QuizSession, additionalQuestions: QuizQuestion[]): QuizSession {
    return {
      ...session,
      questions: [...session.questions, ...additionalQuestions],
      isLoadingMoreQuestions: false,
    };
  }

  calculateScore(timeRemaining: number, difficulty: QuizDifficulty): number {
    const wholeSeconds = Math.floor(timeRemaining);
    // Easy mode: just the seconds remaining (no doubling)
    // Other modes: seconds × 2
    return difficulty === 'easy' ? wholeSeconds : wholeSeconds * 2;
  }

  completeQuizSession(session: QuizSession, correctAnswers: number): QuizResult {
    const endTime = new Date();
    // Handle case where startTime might be a string due to serialization
    const startTime = session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
    const totalTimeMs = endTime.getTime() - startTime.getTime();
    const averageTimePerQuestion = totalTimeMs / 1000 / session.questions.length;

    return {
      sessionId: session.id,
      difficulty: session.difficulty,
      category: session.category,
      totalQuestions: session.questions.length,
      correctAnswers,
      totalScore: session.score,
      averageTimePerQuestion,
      completedAt: endTime,
    };
  }

  async submitQuizScore(authToken: string, result: QuizResult, username: string): Promise<void> {
    try {
      // Create leaderboard ID in format {category}-{difficulty}
      const leaderboardId = `${result.category.name}-${result.difficulty}`;
      
      console.log('Quiz service submitting:', {
        leaderboardId,
        score: result.totalScore,
        username,
        difficulty: result.difficulty,
        category: result.category.displayName
      });
      
      await leaderboardService.submitScore(authToken, leaderboardId, result.totalScore, username);
    } catch (error) {
      console.error('Error submitting quiz score:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          throw new Error(`Quiz ${result.difficulty} leaderboard not found. Please contact support.`);
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (error.message.includes('422')) {
          throw new Error('Invalid score data. Please try again.');
        }
      }
      
      throw new Error('Failed to submit score to leaderboard. Please try again.');
    }
  }

  // Get available categories from Open Trivia DB
  async getCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await fetch(`${this.TRIVIA_API_BASE}/api_category.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.trivia_categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get question count for a category
  async getCategoryQuestionCount(categoryId: number): Promise<{
    total: number;
    easy: number;
    medium: number;
    hard: number;
  }> {
    try {
      const response = await fetch(`${this.TRIVIA_API_BASE}/api_count.php?category=${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        total: data.category_question_count?.total_question_count || 0,
        easy: data.category_question_count?.total_easy_question_count || 0,
        medium: data.category_question_count?.total_medium_question_count || 0,
        hard: data.category_question_count?.total_hard_question_count || 0,
      };
    } catch (error) {
      console.error('Error fetching category question count:', error);
      return { total: 0, easy: 0, medium: 0, hard: 0 };
    }
  }
}

export const quizService = new QuizService();