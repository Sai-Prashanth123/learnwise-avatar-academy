
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { LearningPreference, DegreeType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/Avatar';

const UserDetailsForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setUser, setIsOnboarded } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [degreeType, setDegreeType] = useState<DegreeType | ''>('');
  const [learningPreferences, setLearningPreferences] = useState<LearningPreference[]>([]);

  const handlePreferenceToggle = (pref: LearningPreference) => {
    setLearningPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!degreeType) {
      toast({
        title: "Education Level Required",
        description: "Please select your current education level.",
        variant: "destructive"
      });
      return;
    }

    if (learningPreferences.length === 0) {
      toast({
        title: "Learning Preference Required",
        description: "Please select at least one learning preference.",
        variant: "destructive"
      });
      return;
    }

    setUser({
      name,
      degreeType: degreeType as DegreeType,
      learningPreferences
    });
    setIsOnboarded(true);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <div className="flex justify-center mb-6">
        <Avatar size="md" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">Welcome to LearnWise</h2>
      <p className="text-center text-gray-600 mb-8">Tell us a bit about yourself so we can personalize your learning experience</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">Education Level</Label>
          <Select value={degreeType} onValueChange={(value: string) => setDegreeType(value as DegreeType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your education level" />
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
          <p className="text-sm text-gray-500">Select all that apply:</p>
          
          <div className="grid grid-cols-2 gap-3">
            {(['Visual', 'Auditory', 'Reading', 'Writing'] as LearningPreference[]).map((pref) => (
              <Button
                key={pref}
                type="button"
                variant="outline"
                className={cn(
                  "flex justify-between items-center",
                  learningPreferences.includes(pref) && "border-primary bg-primary/10"
                )}
                onClick={() => handlePreferenceToggle(pref)}
              >
                <span>{pref}</span>
                {learningPreferences.includes(pref) && (
                  <CheckCircle className="h-4 w-4 ml-2 text-primary" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
};

export default UserDetailsForm;
