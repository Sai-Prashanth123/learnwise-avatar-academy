
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuizResult, LearningPreference, DegreeType } from '../types';

interface AppContextType {
  user: User | null;
  quizResults: QuizResult[];
  isOnboarded: boolean;
  isOnboardingQuizCompleted: boolean;
  setUser: (user: User | null) => void;
  setQuizResults: (results: QuizResult[]) => void;
  addQuizResult: (result: QuizResult) => void;
  setIsOnboarded: (value: boolean) => void;
  setIsOnboardingQuizCompleted: (value: boolean) => void;
  attentionScore: number;
  setAttentionScore: (score: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isOnboardingQuizCompleted, setIsOnboardingQuizCompleted] = useState<boolean>(false);
  const [attentionScore, setAttentionScore] = useState<number>(0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedQuizResults = localStorage.getItem('quizResults');
    const storedOnboardingStatus = localStorage.getItem('isOnboarded');
    const storedQuizStatus = localStorage.getItem('isOnboardingQuizCompleted');
    const storedAttentionScore = localStorage.getItem('attentionScore');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedQuizResults) setQuizResults(JSON.parse(storedQuizResults));
    if (storedOnboardingStatus) setIsOnboarded(JSON.parse(storedOnboardingStatus));
    if (storedQuizStatus) setIsOnboardingQuizCompleted(JSON.parse(storedQuizStatus));
    if (storedAttentionScore) setAttentionScore(JSON.parse(storedAttentionScore));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    localStorage.setItem('isOnboarded', JSON.stringify(isOnboarded));
    localStorage.setItem('isOnboardingQuizCompleted', JSON.stringify(isOnboardingQuizCompleted));
    localStorage.setItem('attentionScore', JSON.stringify(attentionScore));
  }, [user, quizResults, isOnboarded, isOnboardingQuizCompleted, attentionScore]);

  const addQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [...prev, result]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        quizResults,
        isOnboarded,
        isOnboardingQuizCompleted,
        setUser,
        setQuizResults,
        addQuizResult,
        setIsOnboarded,
        setIsOnboardingQuizCompleted,
        attentionScore,
        setAttentionScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
