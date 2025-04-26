import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { DegreeType, LearningPreference } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [degreeType, setDegreeType] = useState<DegreeType>('College');
  const [learningPreferences, setLearningPreferences] = useState<LearningPreference[]>([]);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLearningPreferenceChange = (preference: LearningPreference) => {
    setLearningPreferences(current => 
      current.includes(preference) 
        ? current.filter(p => p !== preference)
        : [...current, preference]
    );
  };

  const handleContinue = () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (learningPreferences.length === 0) {
      setError('Please select at least one learning preference');
      return;
    }
    
    try {
      await register(email, password, name, degreeType, learningPreferences);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-avatar-primary flex items-center justify-center text-white font-bold text-xl mb-4">
            LW
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LearnWise</h1>
          <p className="text-gray-600 mt-1">Your AI Learning Companion</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>
              {step === 1 ? 'Account Information' : 'Learning Preferences'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 1 && (
              <div className="mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading || isLoading}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" fill="currentColor"></path>
                    </g>
                  </svg>
                  {isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}
                </Button>
              </div>
            )}
            
            {step === 1 && (
              <div className="relative my-4">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500">or continue with email</span>
                </div>
              </div>
            )}
            
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleContinue(); } : handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="degreeType">Education Level</Label>
                    <Select 
                      value={degreeType} 
                      onValueChange={(value) => setDegreeType(value as DegreeType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="School">School</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="University">University</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Learning Preferences</Label>
                    <p className="text-xs text-gray-500">Select all that apply</p>
                    
                    <div className="space-y-2">
                      {[
                        { id: 'visual', label: 'Visual', value: 'Visual' as LearningPreference },
                        { id: 'auditory', label: 'Auditory', value: 'Auditory' as LearningPreference },
                        { id: 'reading', label: 'Reading', value: 'Reading' as LearningPreference },
                        { id: 'writing', label: 'Writing', value: 'Writing' as LearningPreference }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={item.id} 
                            checked={learningPreferences.includes(item.value)}
                            onCheckedChange={() => handleLearningPreferenceChange(item.value)}
                          />
                          <label
                            htmlFor={item.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {step === 1 ? (
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Create Account'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-avatar-primary hover:underline font-medium">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register; 