'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Users, Clock, CheckCircle, XCircle, Trophy, Play, RotateCcw, Timer, MessageSquare } from 'lucide-react';

interface Scenario {
  id: number;
  category: string;
  scenario: string;
  shouldDelegate: boolean;
  feedback: {
    correct: string;
    incorrect: string;
  };
  funnyWrong: string;
}

type GameState = 'setup' | 'playing' | 'results' | 'finished';

const ShouldIDelegateGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [groupDecision, setGroupDecision] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const scenarios: Scenario[] = useMemo(() => [
    {
      id: 1,
      category: "Teacher Task",
      scenario: "Ms. Johnson needs to create 25 different math word problems about fractions for tomorrow's worksheet.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Smart choice! AI can generate varied practice problems efficiently, letting Ms. Johnson focus on reviewing them and planning instruction.",
        incorrect: "❌ Oops! This is perfect for AI - generating problem variations saves hours and lets teachers focus on pedagogy."
      },
      funnyWrong: "Ms. Johnson stayed up until 2 AM writing 'Sally has 3/4 of a pizza...' for the 23rd time! 😴"
    },
    {
      id: 2,
      category: "Student Support",
      scenario: "A student asks if AI can help them understand why their answer to a chemistry problem is wrong.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Great! AI can provide step-by-step explanations and catch conceptual gaps, supporting learning perfectly.",
        incorrect: "❌ This is actually ideal for AI - it can give patient, detailed explanations that help students learn from mistakes."
      },
      funnyWrong: "The student is still staring at their wrong answer, wondering if osmosis will help it become correct! 🤔"
    },
    {
      id: 3,
      category: "Leadership Decision",
      scenario: "The principal needs to decide which three teachers should receive extra professional development support this year.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Absolutely right! This requires human judgment about individual teachers, relationships, and professional growth needs.",
        incorrect: "❌ Yikes! AI doesn't know your teachers personally or understand the nuanced professional relationships involved."
      },
      funnyWrong: "AI just recommended sending the three teachers with the most vowels in their names to training! 🤖"
    },
    {
      id: 4,
      category: "Student Assessment",
      scenario: "Determining which students in the class are struggling with reading comprehension and need additional support.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Exactly! This requires teacher observation, understanding of individual students, and professional assessment skills.",
        incorrect: "❌ This needs human expertise! Teachers observe student behavior, engagement, and individual needs that AI can't assess."
      },
      funnyWrong: "AI analyzed typing speed and concluded that slow typers need reading help. Plot twist: some are just careful! ⌨️"
    },
    {
      id: 5,
      category: "Content Creation",
      scenario: "Creating a template email to send to parents about the upcoming science fair.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Perfect delegation! AI can draft professional communication templates that you can personalize and review.",
        incorrect: "❌ This is ideal for AI! It can create professional communication drafts, saving time for more important work."
      },
      funnyWrong: "Three hours later, you're still trying to decide between 'Dear Parents' and 'Greetings, Guardians'! 📧"
    },
    {
      id: 6,
      category: "Curriculum Planning",
      scenario: "Deciding which novel to teach in 9th grade English based on your specific students' interests and maturity levels.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Spot on! This requires deep knowledge of your students, community context, and professional curriculum judgment.",
        incorrect: "❌ This needs your expertise! You know your students' backgrounds, interests, and what will engage them effectively."
      },
      funnyWrong: "AI recommended 'War and Peace' because it has the most pages and therefore must be the most educational! 📚"
    }
  ], []);

  const startGame = (): void => {
    setGameState('playing');
    setCurrentScenario(0);
    setTimeLeft(45);
    setTimerActive(true);
    setGroupDecision(null);
    setShowFeedback(false);
    setScore(0);
    setRound(1);
  };

  const makeDecision = useCallback((decision: boolean): void => {
    if (groupDecision !== null) return; // Already decided

    setGroupDecision(decision);
    setTimerActive(false);

    const correct = decision === scenarios[currentScenario].shouldDelegate;
    if (correct) {
      setScore(prevScore => prevScore + 100);
    }

    setTimeout(() => {
      setShowFeedback(true);
    }, 500);
  }, [groupDecision, scenarios, currentScenario]);

  const handleTimeUp = (): void => {
    setGameState('results');
    setShowFeedback(true);
  };

  const nextScenario = useCallback((): void => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setTimeLeft(45);
      setTimerActive(true);
      setGroupDecision(null);
      setShowFeedback(false);
      if (currentScenario === 2) {
        setRound(2);
      }
    } else {
      setGameState('finished');
    }
  }, [currentScenario, scenarios.length]);

  const resetGame = (): void => {
    setGameState('setup');
    setCurrentScenario(0);
    setTimeLeft(45);
    setTimerActive(false);
    setGroupDecision(null);
    setScore(0);
    setRound(1);
    setShowFeedback(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (groupDecision === null) {
        // Time's up, force a decision or show timeout
        handleTimeUp();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, groupDecision]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'playing' && !showFeedback && groupDecision === null && timeLeft > 0) {
        if (e.key === 'ArrowLeft' || e.key === '1') {
          makeDecision(true); // Delegate to AI
        } else if (e.key === 'ArrowRight' || e.key === '2') {
          makeDecision(false); // Keep human
        }
      } else if (showFeedback && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextScenario();
      } else if (gameState === 'finished' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, showFeedback, groupDecision, timeLeft, currentScenario]);

  const getTimerColor = (): string => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimerProgress = (): number => {
    return (timeLeft / 45) * 100;
  };

  // Swipe detection for navigation
  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50 && Math.abs(distanceY) < 100;
    const isRightSwipe = distanceX < -50 && Math.abs(distanceX) < 100;
    const isDownSwipe = distanceY < -50 && Math.abs(distanceX) < 100;

    if (gameState === 'playing' && showFeedback && isLeftSwipe) {
      nextScenario();
    } else if (gameState === 'finished' && isDownSwipe) {
      resetGame();
    } else if (isRightSwipe && currentScenario > 0 && !timerActive) {
      // Could add previous scenario navigation if needed
    }
  };

  if (gameState === 'setup') {
    return (
      <main className="min-h-screen bg-white" role="main">
        <div className="animate-fade-in max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Should I Delegate This?</h1>
            <p className="text-xl text-gray-600 mb-2">AI Decision Experience for School Leaders</p>
            <p className="text-gray-500">Learn when to delegate tasks to AI versus keeping them human-driven</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-6">How This Works</h2>
              <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Timer className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Thoughtful Timing</h3>
                    <p className="text-sm text-blue-800">Consider each scenario with your team</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Collaborative Choice</h3>
                    <p className="text-sm text-green-800">Discuss and decide together</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Immediate Insights</h3>
                    <p className="text-sm text-purple-800">Get expert feedback instantly</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              aria-label="Start the AI delegation decision experience"
            >
              <Play className="w-5 h-5" />
              <span>Begin Experience</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === 'finished') {
    const maxScore = scenarios.length * 100;
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen bg-white animate-fade-in">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Experience Complete!</h1>
            <p className="text-xl text-gray-600">Great work on the delegation challenges</p>
        </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8 text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-1">{score}</div>
            <div className="text-sm md:text-base text-gray-600 mb-1">out of {maxScore} points</div>
            <div className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">{percentage}% Accuracy</div>
          </div>

          {/* Key Insights */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Key Delegation Insights</h2>
            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Ideal for AI</h3>
                  <p className="text-sm text-green-800">Content generation, variations, drafts, formatting, research</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Keep Human</h3>
                  <p className="text-sm text-blue-800">Student assessment, personal decisions, context-specific choices</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Remember</h3>
                  <p className="text-sm text-purple-800">AI amplifies human judgment—doesn&apos;t replace expertise</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={resetGame}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              aria-label="Start the experience again from the beginning"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Experience Again</span>
            </button>

            {/* Discreet continue button */}
            <Link
              href="/prompts"
              className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Continue to Description →
            </Link>

            {/* Navigation to AI Fluency Tool */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Ready for Advanced AI Prompting?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Now that you understand AI delegation, learn how to craft powerful prompts using the 4D Framework.
              </p>
              <Link
                href="/prompts"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Try the AI Fluency Tool</span>
                <MessageSquare className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const isCorrect = groupDecision === scenario.shouldDelegate;

  return (
    <main
      className="min-h-screen bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="main"
      aria-live="polite"
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Delegation Game</h1>
                <p className="text-gray-600 text-sm">Round {round} • Scenario {currentScenario + 1} of {scenarios.length}</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">points</div>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">{timeLeft}s remaining</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                  timeLeft > 30 ? 'bg-green-500' :
                  timeLeft > 15 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${getTimerProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Scenario Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{scenario.category}</span>
            </div>
            <p id="scenario-description" className="text-gray-700 text-base md:text-lg leading-relaxed" role="main">{scenario.scenario}</p>
          </div>

          {/* Decision Buttons */}
          {!showFeedback && groupDecision === null && (
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 animate-slide-in">
              <button
                onClick={() => makeDecision(true)}
                disabled={timeLeft === 0}
                className="w-full bg-green-600 text-white p-6 md:p-8 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Choose to delegate this task to AI assistant"
                aria-describedby="scenario-description"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-90">DELEGATE TO</div>
                    <div className="text-lg font-semibold">AI Assistant</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => makeDecision(false)}
                disabled={timeLeft === 0}
                className="w-full bg-red-600 text-white p-6 md:p-8 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Choose to keep this task with human experts"
                aria-describedby="scenario-description"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-90">KEEP WITH</div>
                    <div className="text-lg font-semibold">Human Expert</div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Decision Made */}
          {groupDecision !== null && !showFeedback && (
            <div className="text-center mb-6 animate-fade-in">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isCorrect ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {isCorrect ? <CheckCircle className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-1">
                You chose: {groupDecision ? 'AI Assistant' : 'Human Expert'}
              </div>
              <div className="text-base text-gray-600 animate-pulse">Preparing feedback...</div>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="space-y-4 animate-slide-in">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                    isCorrect ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <XCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {isCorrect ? 'Excellent Choice!' : 'Learning Opportunity'}
                    </h3>
                    <p className={`text-base ${
                      isCorrect ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {isCorrect ? '+100 points earned' : 'Consider this insight'}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {isCorrect ? scenario.feedback.correct : scenario.feedback.incorrect}
                  </p>
                </div>

                {!isCorrect && scenario.funnyWrong && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">💭</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-base mb-1">What might happen instead?</h4>
                        <p className="text-sm text-gray-700">{scenario.funnyWrong}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextScenario}
                className="w-full bg-blue-600 text-white py-4 md:py-6 px-6 md:px-8 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
                aria-label={currentScenario < scenarios.length - 1 ? 'Continue to next scenario' : 'View final results and summary'}
              >
                {currentScenario < scenarios.length - 1 ? (
                  'Continue Journey →'
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>View Results</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShouldIDelegateGame;