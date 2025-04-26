import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import UserDetailsForm from '@/components/onboarding/UserDetailsForm';
import OnboardingQuiz from '@/components/onboarding/OnboardingQuiz';

enum OnboardingStep {
  USER_DETAILS = 'user_details',
  QUIZ = 'quiz',
  COMPLETED = 'completed'
}

const Onboarding: React.FC = () => {
  const { isOnboarded, isOnboardingQuizCompleted, isAuthenticated } = useAppContext();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    if (isOnboarded && isOnboardingQuizCompleted) {
      return OnboardingStep.COMPLETED;
    } else if (isOnboarded) {
      return OnboardingStep.QUIZ;
    } else {
      return OnboardingStep.USER_DETAILS;
    }
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If already completed onboarding, redirect to dashboard
  if (currentStep === OnboardingStep.COMPLETED) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {currentStep === OnboardingStep.USER_DETAILS && (
        <UserDetailsForm onComplete={() => setCurrentStep(OnboardingStep.QUIZ)} />
      )}
      
      {currentStep === OnboardingStep.QUIZ && (
        <OnboardingQuiz onComplete={() => setCurrentStep(OnboardingStep.COMPLETED)} />
      )}
    </div>
  );
};

export default Onboarding; 