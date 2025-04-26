
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import UserDetailsForm from '@/components/onboarding/UserDetailsForm';
import OnboardingQuiz from '@/components/onboarding/OnboardingQuiz';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isOnboarded, isOnboardingQuizCompleted } = useAppContext();
  const [showQuiz, setShowQuiz] = useState(false);
  
  // If user is already onboarded and completed the quiz, redirect to dashboard
  React.useEffect(() => {
    if (isOnboarded && isOnboardingQuizCompleted) {
      navigate('/dashboard');
    }
  }, [isOnboarded, isOnboardingQuizCompleted, navigate]);

  const handleUserDetailsComplete = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-avatar-primary/10 to-white p-6">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">LearnWise Avatar Academy</h1>
          <p className="text-xl text-gray-600">Personalized AI-driven learning experience</p>
        </motion.div>
        
        {isOnboarded && !isOnboardingQuizCompleted ? (
          <OnboardingQuiz onComplete={handleQuizComplete} />
        ) : !isOnboarded ? (
          showQuiz ? (
            <OnboardingQuiz onComplete={handleQuizComplete} />
          ) : (
            <UserDetailsForm onComplete={handleUserDetailsComplete} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default Index;
