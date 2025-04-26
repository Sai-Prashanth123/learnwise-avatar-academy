import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuizResult, LearningPreference, DegreeType, AuthUser } from '../types';
import { auth, loginWithEmailAndPassword, registerWithEmailAndPassword, logoutUser, signInWithGoogle } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User | null;
  authUser: AuthUser | null;
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, degreeType: DegreeType, learningPreferences: LearningPreference[]) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isOnboardingQuizCompleted, setIsOnboardingQuizCompleted] = useState<boolean>(false);
  const [attentionScore, setAttentionScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        // User is signed in
        setAuthUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email
        });
        
        // Try to load user profile from localStorage
        const storedUser = localStorage.getItem(`user_${firebaseUser.uid}`);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (firebaseUser.displayName) {
          // If we don't have stored user data but have a display name from Google
          // Create a new user profile
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName,
            degreeType: 'College', // Default
            learningPreferences: ['Visual'] // Default
          };
          setUser(newUser);
          localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(newUser));
        }
      } else {
        // User is signed out
        setAuthUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (authUser?.uid) {
      const storedUser = localStorage.getItem(`user_${authUser.uid}`);
      const storedQuizResults = localStorage.getItem(`quizResults_${authUser.uid}`);
      const storedOnboardingStatus = localStorage.getItem(`isOnboarded_${authUser.uid}`);
      const storedQuizStatus = localStorage.getItem(`isOnboardingQuizCompleted_${authUser.uid}`);
      const storedAttentionScore = localStorage.getItem(`attentionScore_${authUser.uid}`);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedQuizResults) setQuizResults(JSON.parse(storedQuizResults));
      if (storedOnboardingStatus) setIsOnboarded(JSON.parse(storedOnboardingStatus));
      if (storedQuizStatus) setIsOnboardingQuizCompleted(JSON.parse(storedQuizStatus));
      if (storedAttentionScore) setAttentionScore(JSON.parse(storedAttentionScore));
    }
  }, [authUser]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (authUser?.uid) {
      if (user) localStorage.setItem(`user_${authUser.uid}`, JSON.stringify(user));
      localStorage.setItem(`quizResults_${authUser.uid}`, JSON.stringify(quizResults));
      localStorage.setItem(`isOnboarded_${authUser.uid}`, JSON.stringify(isOnboarded));
      localStorage.setItem(`isOnboardingQuizCompleted_${authUser.uid}`, JSON.stringify(isOnboardingQuizCompleted));
      localStorage.setItem(`attentionScore_${authUser.uid}`, JSON.stringify(attentionScore));
    }
  }, [user, quizResults, isOnboarded, isOnboardingQuizCompleted, attentionScore, authUser]);

  const addQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [...prev, result]);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await loginWithEmailAndPassword(email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome back to LearnWise!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Logged in successfully",
        description: "Welcome to LearnWise!",
      });
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    degreeType: DegreeType, 
    learningPreferences: LearningPreference[]
  ) => {
    try {
      setIsLoading(true);
      const firebaseUser = await registerWithEmailAndPassword(email, password);
      
      // Create user profile
      const newUser: User = {
        uid: firebaseUser.uid,
        email,
        name,
        degreeType,
        learningPreferences
      };
      
      setUser(newUser);
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Welcome to LearnWise!",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      // Clear local state
      setUser(null);
      setQuizResults([]);
      setIsOnboarded(false);
      setIsOnboardingQuizCompleted(false);
      setAttentionScore(0);
      
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authUser,
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
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!authUser,
        isLoading,
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
