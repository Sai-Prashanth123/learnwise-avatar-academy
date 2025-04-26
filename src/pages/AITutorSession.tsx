
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, ThumbsUp, ThumbsDown, PlayCircle, PauseCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AITutorSession: React.FC = () => {
  const { setAttentionScore } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'thinking' | 'explaining' | 'confused'>('explaining');
  const [micOn, setMicOn] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [lessonProgress, setLessonProgress] = useState<number>(0);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi there! I'm your AI tutor. I'll help you understand this material. Let me break it down for you.", isUser: false }
  ]);

  // Simulate avatar speaking
  useEffect(() => {
    if (!isPaused) {
      const speakingInterval = setInterval(() => {
        setIsSpeaking(prev => !prev);
      }, 3000);
      
      return () => clearInterval(speakingInterval);
    }
  }, [isPaused]);

  // Simulate lesson progress
  useEffect(() => {
    if (!isPaused) {
      const progressInterval = setInterval(() => {
        setLessonProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 500);
      
      return () => clearInterval(progressInterval);
    }
  }, [isPaused]);

  // Simulate emotions changing
  useEffect(() => {
    if (!isPaused) {
      const emotions: ('happy' | 'thinking' | 'explaining' | 'confused')[] = [
        'explaining', 'thinking', 'happy', 'explaining', 'confused'
      ];
      
      const emotionInterval = setInterval(() => {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(randomEmotion);
        
        if (randomEmotion === 'confused') {
          addMessage("You seem a bit confused. Let me explain this in a simpler way...", false);
        }
      }, 8000);
      
      return () => clearInterval(emotionInterval);
    }
  }, [isPaused]);
  
  // Simulate attention detection
  useEffect(() => {
    const attentionUpdateInterval = setInterval(() => {
      // In a real app, this would use webcam data
      const randomAttention = Math.floor(Math.random() * 30) + 70; // 70-100%
      setAttentionScore(randomAttention);
      
      if (randomAttention < 80 && !isPaused) {
        addMessage("I notice you might be getting distracted. Let's try a different approach.", false);
      }
    }, 10000);
    
    return () => clearInterval(attentionUpdateInterval);
  }, [setAttentionScore, isPaused]);

  // Helper to add messages
  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => [...prev, { text, isUser }]);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!cameraOn) {
      toast({
        title: "Camera Access Requested",
        description: "This will allow the AI to adapt to your emotions and attention level.",
      });
    }
    setCameraOn(!cameraOn);
  };

  // Toggle mic
  const toggleMic = () => {
    if (!micOn) {
      toast({
        title: "Microphone Access Requested",
        description: "This will allow you to ask questions by voice.",
      });
    }
    setMicOn(!micOn);
  };

  // Handle user questions
  const handleAskQuestion = () => {
    addMessage("I have a question about this concept...", true);
    
    // Simulate AI response
    setTimeout(() => {
      addMessage("Great question! Let me explain it in more detail...", false);
    }, 1000);
  };

  // Simulate feedback response
  const handleFeedback = (isPositive: boolean) => {
    if (isPositive) {
      toast({
        title: "Positive Feedback Recorded",
        description: "Thank you! I'll continue with this teaching approach.",
      });
      addMessage("I'm glad this is helpful! Let's continue.", false);
    } else {
      toast({
        title: "Feedback Recorded",
        description: "I'll adjust my teaching approach.",
      });
      addMessage("Let me try explaining this differently to make it clearer.", false);
    }
  };

  const handleEndSession = () => {
    toast({
      title: "Learning Session Complete",
      description: "Great job! You can now take a quiz to test your knowledge.",
    });
    navigate('/quiz');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Learning Session</h1>
          <p className="text-gray-600">Your AI tutor is explaining the material</p>
        </div>
        <div>
          <Button variant="outline" onClick={handleEndSession}>End Session</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2 space-y-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Content Overview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? (
                    <PlayCircle className="h-5 w-5" />
                  ) : (
                    <PauseCircle className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <div className="mb-4">
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    className="bg-avatar-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${lessonProgress}%` }} 
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium">{lessonProgress}%</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h3>Introduction to Machine Learning</h3>
                <p>Machine learning is a branch of artificial intelligence that focuses on developing systems that learn from data. Unlike traditional programming where explicit rules are defined, machine learning algorithms use statistical methods to enable systems to improve through experience.</p>
                
                <h4>Key Concepts in Machine Learning</h4>
                <ul>
                  <li><strong>Supervised Learning:</strong> The algorithm is trained on labeled data.</li>
                  <li><strong>Unsupervised Learning:</strong> The algorithm finds patterns in unlabeled data.</li>
                  <li><strong>Reinforcement Learning:</strong> The algorithm learns through trial and error.</li>
                </ul>
                
                <p>Machine learning has numerous applications across various domains, including:</p>
                <ul>
                  <li>Image and speech recognition</li>
                  <li>Natural language processing</li>
                  <li>Recommendation systems</li>
                  <li>Autonomous vehicles</li>
                  <li>Medical diagnosis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Conversation</h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-avatar-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAskQuestion} className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFeedback(true)}
                  className="flex-none"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFeedback(false)}
                  className="flex-none"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="card-hover h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-6">Your AI Tutor</h2>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Avatar
                    size="lg"
                    speaking={isSpeaking}
                    emotion={currentEmotion}
                    className="mb-4"
                  />
                </motion.div>
                
                <p className="mb-6 text-center">
                  {isSpeaking ? "I'm explaining the concepts to help you understand." : "Listening to your questions..."}
                </p>
                
                <div className="flex gap-4 mb-4">
                  <Button
                    variant={cameraOn ? "default" : "outline"}
                    size="icon"
                    onClick={toggleCamera}
                  >
                    {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={micOn ? "default" : "outline"}
                    size="icon"
                    onClick={toggleMic}
                  >
                    {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Personalization</h3>
                <p className="text-sm text-gray-600 mb-3">The AI is adapting to your learning style:</p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Visual Content</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div className="bg-avatar-primary h-full rounded-full" style={{ width: '73%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Auditory Content</span>
                      <span className="font-medium">58%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div className="bg-avatar-primary h-full rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Interactive Elements</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div className="bg-avatar-primary h-full rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AITutorSession;
