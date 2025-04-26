
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight } from 'lucide-react';
import { nanoid } from 'nanoid';

// Sample onboarding quiz questions
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
    question: 'Which of these is NOT a programming language?',
    options: [
      'Python',
      'Java',
      'Linux',
      'JavaScript'
    ],
    correctAnswer: 'Linux',
    type: 'MCQ'
  },
  {
    id: '3',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyper Transfer Markup Language',
      'Home Tool Markup Language'
    ],
    correctAnswer: 'Hyper Text Markup Language',
    type: 'MCQ'
  },
  {
    id: '4',
    question: 'True or False: The Internet and the World Wide Web are the same thing.',
    options: [
      'True',
      'False'
    ],
    correctAnswer: 'False',
    type: 'TrueFalse'
  },
  {
    id: '5',
    question: 'What is the main function of an operating system?',
    options: [
      'To provide a user interface',
      'To manage hardware resources',
      'To run applications',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    type: 'MCQ'
  }
];

interface QuizAnswer {
  questionId: string;
  answer: string;
  timeTaken: number; // in seconds
  isCorrect: boolean;
}

const OnboardingQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addQuizResult, setIsOnboardingQuizCompleted } = useAppContext();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [progress, setProgress] = useState(0);

  // Update progress when current question changes
  useEffect(() => {
    setProgress((currentQuestionIndex / sampleQuestions.length) * 100);
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) {
      toast({
        title: "Selection Required",
        description: "Please select an answer before continuing.",
        variant: "destructive"
      });
      return;
    }

    const currentQuestion = sampleQuestions[currentQuestionIndex];
    const timeTaken = (Date.now() - questionStartTime) / 1000; // Convert to seconds
    
    // Record answer
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedOption,
      timeTaken,
      isCorrect: selectedOption === currentQuestion.correctAnswer
    };
    
    setAnswers([...answers, answer]);

    // Move to next question or finish quiz
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate overall results
      const correctAnswers = answers.filter(a => a.isCorrect).length + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
      const totalTime = answers.reduce((total, a) => total + a.timeTaken, 0) + timeTaken;
      const accuracy = ((correctAnswers / sampleQuestions.length) * 100);
      
      // Generate weak points based on incorrect answers
      const weakPointsIndices = answers.map((a, index) => a.isCorrect ? null : index)
        .filter((index): index is number => index !== null);
      
      // Add last question if it's incorrect
      if (selectedOption !== currentQuestion.correctAnswer) {
        weakPointsIndices.push(currentQuestionIndex);
      }
      
      const weakPoints = weakPointsIndices.map(index => {
        const q = sampleQuestions[index];
        return `Understanding ${q.question.split(' ').slice(0, 3).join(' ')}...`;
      });

      // Add quiz result to context
      addQuizResult({
        id: nanoid(),
        score: correctAnswers,
        totalQuestions: sampleQuestions.length,
        timeTaken: totalTime,
        accuracy,
        date: new Date(),
        weakPoints
      });

      setIsOnboardingQuizCompleted(true);
      onComplete();
    }
  };

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full mx-auto"
    >
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Initial Assessment Quiz</h2>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <div
                key={option}
                className={`quiz-option ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNextQuestion}
            disabled={!selectedOption}
          >
            {currentQuestionIndex < sampleQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default OnboardingQuiz;
