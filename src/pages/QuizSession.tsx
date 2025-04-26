
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Flag, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

// Sample quiz questions
const sampleQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the primary goal of machine learning?',
    options: [
      'To create computer programs that can think like humans',
      'To enable computers to learn without explicit programming',
      'To replace human workers with robots',
      'To increase computer processing speeds'
    ],
    correctAnswer: 'To enable computers to learn without explicit programming',
    type: 'MCQ'
  },
  {
    id: '2',
    question: 'Which of these is NOT a supervised learning algorithm?',
    options: [
      'Linear Regression',
      'K-means Clustering',
      'Random Forest',
      'Support Vector Machines'
    ],
    correctAnswer: 'K-means Clustering',
    type: 'MCQ'
  },
  {
    id: '3',
    question: 'True or False: Deep learning is a subset of machine learning.',
    options: [
      'True',
      'False'
    ],
    correctAnswer: 'True',
    type: 'TrueFalse'
  },
  {
    id: '4',
    question: 'What does CNN stand for in the context of deep learning?',
    options: [
      'Computer Neural Network',
      'Convolutional Neural Network',
      'Computational Neural Network',
      'Connected Node Network'
    ],
    correctAnswer: 'Convolutional Neural Network',
    type: 'MCQ'
  },
  {
    id: '5',
    question: 'Which of the following is NOT a common activation function in neural networks?',
    options: [
      'ReLU (Rectified Linear Unit)',
      'Sigmoid',
      'Tanh',
      'Quadratic'
    ],
    correctAnswer: 'Quadratic',
    type: 'MCQ'
  },
  {
    id: '6',
    question: 'What is the purpose of the backpropagation algorithm in neural networks?',
    options: [
      'To calculate the output of the network',
      'To optimize network weights based on error gradient',
      'To generate new training data',
      'To compress the neural network model'
    ],
    correctAnswer: 'To optimize network weights based on error gradient',
    type: 'MCQ'
  },
  {
    id: '7',
    question: 'True or False: Overfitting occurs when a model learns the training data too well, including its noise and outliers.',
    options: [
      'True',
      'False'
    ],
    correctAnswer: 'True',
    type: 'TrueFalse'
  },
];

interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

const QuizSession: React.FC = () => {
  const navigate = useNavigate();
  const { addQuizResult } = useAppContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Update timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Reset question timer when changing questions
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  
  const handleFlagQuestion = () => {
    if (flaggedQuestions.includes(currentQuestion.id)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestion.id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion.id]);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    // Record answer and time
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
      timeTaken
    };
    
    setUserAnswers([...userAnswers, newAnswer]);
    
    // Move to next question or finish quiz
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Complete quiz
      setIsQuizComplete(true);
      
      // Calculate quiz statistics
      const correctAnswers = [...userAnswers, newAnswer].filter(a => a.isCorrect).length;
      const totalTimeTaken = [...userAnswers, newAnswer].reduce((total, a) => total + a.timeTaken, 0);
      const accuracy = (correctAnswers / sampleQuestions.length) * 100;
      
      // Generate weak points based on incorrect answers
      const incorrectAnswers = [...userAnswers, newAnswer].filter(a => !a.isCorrect);
      const weakPoints = incorrectAnswers.map(a => {
        const question = sampleQuestions.find(q => q.id === a.questionId);
        return `Understanding ${question?.question.split(' ').slice(0, 3).join(' ')}...`;
      });
      
      // Save quiz result
      addQuizResult({
        id: nanoid(),
        score: correctAnswers,
        totalQuestions: sampleQuestions.length,
        timeTaken: totalTimeTaken,
        accuracy,
        date: new Date(),
        weakPoints
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderQuizResults = () => {
    // Calculate statistics
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = (correctAnswers / sampleQuestions.length) * 100;
    const averageTime = userAnswers.reduce((total, a) => total + a.timeTaken, 0) / userAnswers.length;
    
    // Group questions by topic (in a real app, we'd have actual topics)
    const topicPerformance = {
      'Machine Learning Basics': { correct: 2, total: 3 },
      'Neural Networks': { correct: 3, total: 4 }
    };
    
    // Identify weak areas
    const weakAreas = userAnswers
      .filter(a => !a.isCorrect)
      .map(a => {
        const question = sampleQuestions.find(q => q.id === a.questionId);
        return question?.question.split(' ').slice(0, 4).join(' ') + '...';
      });

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <p className="text-gray-600">Great job completing the quiz!</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className="text-3xl font-bold">{correctAnswers}/{sampleQuestions.length}</p>
                <p className="text-avatar-primary font-medium">{accuracy.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                <p className="text-3xl font-bold">{formatTime(timer)}</p>
                <p className="text-gray-500">{averageTime.toFixed(1)}s per question</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Accuracy</p>
                <p className="text-3xl font-bold">{accuracy.toFixed(0)}%</p>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                  <div 
                    className="bg-avatar-primary h-full rounded-full" 
                    style={{ width: `${accuracy}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(topicPerformance).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{topic}</span>
                    <span>{data.correct}/{data.total} correct</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div 
                      className="bg-avatar-primary h-full rounded-full" 
                      style={{ width: `${(data.correct / data.total) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {weakAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Areas to Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weakAreas.map((area, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p>{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/quiz')}>
            New Quiz
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  if (isQuizComplete) {
    return renderQuizResults();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Quiz Session</h1>
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(timer)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {sampleQuestions.length}</p>
          <p className="text-sm font-medium">
            {userAnswers.filter(a => a.isCorrect).length} correct of {userAnswers.length} answered
          </p>
        </div>
        
        <Progress value={(currentQuestionIndex / sampleQuestions.length) * 100} className="h-2" />
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <CardTitle>
              <span className="mr-2">{currentQuestionIndex + 1}.</span>
              {currentQuestion.question}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFlagQuestion}
              className={flaggedQuestions.includes(currentQuestion.id) ? 'text-red-500' : ''}
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <motion.div
                key={option}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "quiz-option",
                  selectedOption === option && "selected"
                )}
              >
                {option}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          disabled={currentQuestionIndex === 0}
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
              setSelectedOption(userAnswers[currentQuestionIndex - 1]?.userAnswer || null);
            }
          }}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedOption}
        >
          {currentQuestionIndex < sampleQuestions.length - 1 ? 'Next' : 'Finish Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default QuizSession;
