import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, ThumbsUp, ThumbsDown, PlayCircle, PauseCircle, BrainCircuit } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// Define explanation level type
type ExplanationLevel = 'simple' | 'moderate' | 'advanced';

const AITutorSession: React.FC = () => {
  const { setAttentionScore } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the explanation level from navigation state, default to moderate
  const explanationLevel = (location.state?.explanationLevel || 'moderate') as ExplanationLevel;
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'thinking' | 'explaining' | 'confused'>('explaining');
  const [micOn, setMicOn] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const [lessonProgress, setLessonProgress] = useState<number>(0);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { 
      text: getInitialGreeting(explanationLevel), 
      isUser: false 
    }
  ]);

  // Function to get the initial greeting based on the explanation level
  function getInitialGreeting(level: ExplanationLevel): string {
    switch(level) {
      case 'simple':
        return "Hi there! I'm your AI tutor. I'll explain everything in simple terms with clear examples.";
      case 'moderate':
        return "Hello! I'm your AI tutor. I'll provide a balanced explanation with practical examples.";
      case 'advanced':
        return "Welcome! I'm your AI tutor. I'll dive deep into the concepts with comprehensive explanations and detailed context.";
      default:
        return "Hi there! I'm your AI tutor. I'll help you understand this material.";
    }
  }

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
          // Different confusion responses based on explanation level
          if (explanationLevel === 'simple') {
            addMessage("You seem a bit confused. Let me break this down even more simply...", false);
          } else if (explanationLevel === 'moderate') {
            addMessage("I notice some confusion. Let me clarify this with a different example...", false);
          } else {
            addMessage("This complex topic can be challenging. Let me approach it from a different angle...", false);
          }
        }
      }, 8000);
      
      return () => clearInterval(emotionInterval);
    }
  }, [isPaused, explanationLevel]);
  
  // Simulate attention detection
  useEffect(() => {
    const attentionUpdateInterval = setInterval(() => {
      // In a real app, this would use webcam data
      const randomAttention = Math.floor(Math.random() * 30) + 70; // 70-100%
      setAttentionScore(randomAttention);
      
      if (randomAttention < 80 && !isPaused) {
        // Different attention responses based on explanation level
        if (explanationLevel === 'simple') {
          addMessage("Hey there! Let's focus on this simple explanation.", false);
        } else if (explanationLevel === 'moderate') {
          addMessage("I notice you might be getting distracted. Let's try a different approach.", false);
        } else {
          addMessage("This advanced material requires concentration. Let me highlight the key insights.", false);
        }
      }
    }, 10000);
    
    return () => clearInterval(attentionUpdateInterval);
  }, [setAttentionScore, isPaused, explanationLevel]);

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
    
    // Simulate AI response based on explanation level
    setTimeout(() => {
      if (explanationLevel === 'simple') {
        addMessage("Great question! Let me explain it in the simplest way...", false);
      } else if (explanationLevel === 'moderate') {
        addMessage("Good question! Here's a balanced explanation with examples...", false);
      } else {
        addMessage("Excellent question! Let me provide an in-depth analysis of this concept...", false);
      }
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
      
      // Different negative feedback responses based on explanation level
      if (explanationLevel === 'simple') {
        addMessage("I'll use even simpler terms and more basic examples.", false);
      } else if (explanationLevel === 'moderate') {
        addMessage("Let me try explaining this differently to make it clearer.", false);
      } else {
        addMessage("I'll adjust the level of detail to make this advanced content more accessible.", false);
      }
    }
  };

  const handleEndSession = () => {
    toast({
      title: "Learning Session Complete",
      description: "Great job! You can now take a quiz to test your knowledge.",
    });
    navigate('/quiz');
  };

  // Function to get explanation level badge color
  const getLevelBadgeColor = (level: ExplanationLevel): string => {
    switch(level) {
      case 'simple': return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'moderate': return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
      case 'advanced': return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
      default: return '';
    }
  };

  // Get content based on explanation level
  const getExplanationContent = () => {
    switch(explanationLevel) {
      case 'simple':
        return (
          <>
            <h3>What is Machine Learning?</h3>
            <p>Machine learning is like teaching computers to learn from examples, just like you learn from practice. Instead of telling the computer exactly what to do, we show it examples and it figures out the patterns.</p>
            
            <h4>Main Types of Machine Learning</h4>
            <ul>
              <li><strong>Supervised Learning:</strong> Like learning with a teacher who shows you the right answers</li>
              <li><strong>Unsupervised Learning:</strong> Like finding patterns in things without being told what to look for</li>
              <li><strong>Reinforcement Learning:</strong> Like learning through trial and error - think of a game where you get points</li>
            </ul>
            
            <p>Machine learning is used in many everyday things like:</p>
            <ul>
              <li>Face recognition in your phone camera</li>
              <li>Voice assistants like Siri or Alexa</li>
              <li>Netflix suggestions</li>
              <li>Self-driving cars</li>
              <li>Disease detection</li>
            </ul>
          </>
        );
      case 'advanced':
        return (
          <>
            <h3>Advanced Principles of Machine Learning</h3>
            <p>Machine learning is a subfield of artificial intelligence that employs statistical methods to enable systems to improve through experience. The fundamental distinction from traditional programming paradigms lies in its data-driven approach to problem-solving, where algorithmic behavior emerges from exposure to representative datasets rather than explicit programming.</p>
            
            <h4>Theoretical Foundations and Methodologies</h4>
            <ul>
              <li><strong>Supervised Learning:</strong> Involves learning a mapping function from labeled input-output pairs, employing algorithms such as Support Vector Machines, Random Forests, and Neural Networks with backpropagation optimization.</li>
              <li><strong>Unsupervised Learning:</strong> Encompasses techniques for discovering latent structures within unlabeled data, including clustering algorithms (K-means, DBSCAN, hierarchical), dimensionality reduction methods (PCA, t-SNE), and generative models (VAEs, GANs).</li>
              <li><strong>Reinforcement Learning:</strong> Utilizes Markov Decision Processes as a mathematical framework where agents learn optimal policies through environmental interaction, balancing exploration and exploitation via techniques like Q-learning, Policy Gradients, and Deep Q-Networks.</li>
            </ul>
            
            <p>The field encompasses several advanced concepts including:</p>
            <ul>
              <li>Feature engineering and representation learning</li>
              <li>Bias-variance tradeoff and regularization techniques</li>
              <li>Transfer learning and meta-learning approaches</li>
              <li>Ensemble methods and boosting algorithms</li>
              <li>Bayesian inference and probabilistic graphical models</li>
              <li>Deep learning architectures (CNNs, RNNs, Transformers)</li>
              <li>Ethics, fairness, and interpretability considerations</li>
            </ul>
          </>
        );
      default: // moderate
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Learning Session</h1>
          <p className="text-gray-600">Your AI tutor is explaining the material</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline"
            className={`flex items-center gap-1 ${getLevelBadgeColor(explanationLevel)}`}
          >
            <BrainCircuit className="h-3.5 w-3.5 mr-0.5" />
            <span className="capitalize">{explanationLevel} Explanation</span>
          </Badge>
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
                {getExplanationContent()}
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
                  size="icon"
                  onClick={toggleMic}
                  className={micOn ? "bg-avatar-primary/10 text-avatar-primary border-avatar-primary/20" : ""}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold mb-1">Your AI Tutor</h2>
                <p className="text-sm text-gray-500">Adapting to your learning style</p>
              </div>
              
              <div className="mb-4">
                <Avatar 
                  size="lg" 
                  speaking={isSpeaking}
                  emotion={currentEmotion}
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm font-medium">
                  {currentEmotion === 'explaining' && "I'm explaining this concept..."}
                  {currentEmotion === 'thinking' && "I'm considering the best way to explain..."}
                  {currentEmotion === 'happy' && "I'm glad you're understanding!"}
                  {currentEmotion === 'confused' && "Let me clarify this for you..."}
                </p>
              </div>
              
              <div className="w-full space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">How am I doing?</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleFeedback(true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleFeedback(false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={toggleCamera}
                  >
                    {cameraOn ? (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Disable Attention Tracking
                      </>
                    ) : (
                      <>
                        <CameraOff className="h-4 w-4 mr-2" />
                        Enable Attention Tracking
                      </>
                    )}
                  </Button>
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
