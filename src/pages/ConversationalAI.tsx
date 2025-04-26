import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Upload, ExternalLink, Clock, X, FileText, Youtube, Link2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { ContentInput } from '@/types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ConversationalAI: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<'PDF' | 'YouTube' | 'Website' | 'Text' | null>(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [contentInput, setContentInput] = useState<ContentInput | null>(null);
  const [feedbackQuestion, setFeedbackQuestion] = useState("As a UX designer, can you share a specific example of how you adapted your communication style to effectively convey complex design concepts to a non-technical stakeholder?");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionStarted) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionStarted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleContentTypeSelect = (type: 'PDF' | 'YouTube' | 'Website' | 'Text') => {
    setSelectedContentType(type);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentInput({
        type: 'PDF',
        content: file
      });
      toast({
        title: "File Selected",
        description: `${file.name} has been selected.`
      });
    }
  };

  const handleStartSession = () => {
    if (!selectedContentType) {
      toast({
        title: "Selection Required",
        description: "Please select a content type to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSessionStarted(true);
    
    // Reset the messages for a new session
    setMessages([
      {
        id: '1',
        text: `Welcome to your ${selectedContentType} learning session! How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const handleExitSession = () => {
    setIsSessionStarted(false);
    setSelectedContentType(null);
    setContentInput(null);
    setSessionTimer(0);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      {
        id: userMessageId,
        text: newMessage,
        isUser: true,
        timestamp: new Date()
      }
    ]);
    
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      setIsTyping(false);
      setIsSpeaking(true);
      
      // Sample responses based on keywords
      let response = '';
      const lowercaseMessage = newMessage.toLowerCase();
      
      if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
        response = "Hello! It's nice to chat with you. How can I assist with your learning today?";
      } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('explain')) {
        response = "I'd be happy to help explain any concept you're struggling with. Could you provide more specific details about what you'd like me to explain?";
      } else if (lowercaseMessage.includes('machine learning') || lowercaseMessage.includes('ai')) {
        response = "Machine learning is a subset of AI focused on algorithms that improve through experience. The key types are supervised learning (using labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Would you like me to elaborate on any of these?";
      } else if (lowercaseMessage.includes('thank')) {
        response = "You're welcome! Feel free to ask if you need any further assistance with your studies.";
      } else {
        response = "That's an interesting question. I'm here to help with your learning journey. Could you tell me more about what you're trying to understand?";
      }
      
      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        }
      ]);
      
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMic = () => {
    if (!micActive) {
      toast({
        title: "Microphone Access",
        description: "Microphone access would be requested here in a real application."
      });
    }
    setMicActive(!micActive);
  };

  // Content selection screen
  if (!isSessionStarted) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-8">What would you like to learn today?</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-4">Step 1: Select Content Type</h2>
            <div className="grid grid-cols-4 gap-4">
              <button 
                className={`p-6 rounded-lg flex flex-col items-center justify-center border transition-colors ${selectedContentType === 'PDF' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleContentTypeSelect('PDF')}
              >
                <Upload className="h-8 w-8 text-purple-400 mb-2" />
                <span className="font-medium">PDF</span>
              </button>
              
              <button 
                className={`p-6 rounded-lg flex flex-col items-center justify-center border transition-colors ${selectedContentType === 'YouTube' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleContentTypeSelect('YouTube')}
              >
                <Youtube className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-medium">YouTube</span>
              </button>
              
              <button 
                className={`p-6 rounded-lg flex flex-col items-center justify-center border transition-colors ${selectedContentType === 'Website' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleContentTypeSelect('Website')}
              >
                <Link2 className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-medium">Website</span>
              </button>
              
              <button 
                className={`p-6 rounded-lg flex flex-col items-center justify-center border transition-colors ${selectedContentType === 'Text' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}
                onClick={() => handleContentTypeSelect('Text')}
              >
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-medium">Text</span>
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Step 2: Add Your Content</h2>
            
            {selectedContentType === 'PDF' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop your PDF here</h3>
                  <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                  <button 
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select PDF File
                  </button>
                </div>
              </div>
            )}
            
            {selectedContentType === 'YouTube' && (
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium mb-2">
                  YouTube URL
                  <Input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1"
                    onChange={(e) => setContentInput({
                      type: 'YouTube',
                      content: e.target.value
                    })}
                  />
                </label>
              </div>
            )}
            
            {selectedContentType === 'Website' && (
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium mb-2">
                  Website URL
                  <Input 
                    type="url" 
                    placeholder="https://example.com"
                    className="mt-1"
                    onChange={(e) => setContentInput({
                      type: 'Website',
                      content: e.target.value
                    })}
                  />
                </label>
              </div>
            )}
            
            {selectedContentType === 'Text' && (
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium mb-2">
                  Enter Text
                  <Textarea 
                    placeholder="Paste or type your text here..."
                    className="mt-1"
                    rows={8}
                    onChange={(e) => setContentInput({
                      type: 'Text',
                      content: e.target.value
                    })}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div>
            <Button 
              className="px-6"
              onClick={handleStartSession}
            >
              Start Learning Session <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full screen chat interface
  return (
    <div className="fixed inset-0 bg-white flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white p-4 border-b flex justify-between items-center">
        <div className="w-64 h-8 bg-gray-600 text-white flex items-center justify-center font-bold">
          LOGO
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-gray-800 font-medium">Total time : </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-800 mr-1" />
            <span className="font-mono font-medium">
              {formatTime(sessionTimer)}
            </span>
          </div>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-7 gap-4 p-4 overflow-hidden">
        {/* Main content area - 4/7 width */}
        <div className="col-span-4 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="https://via.placeholder.com/800x600" 
            alt="Content preview" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Chat area - 3/7 width */}
        <div className="col-span-3 bg-white rounded-lg border flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium text-lg">Chat with ai</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="mr-2 flex-shrink-0 mt-1">
                    <Avatar size="sm" emotion={isSpeaking ? 'explaining' : 'happy'} />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center">
                  <Avatar size="sm" emotion="thinking" />
                  <div className="ml-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={toggleMic}
              variant="ghost"
              className={micActive ? 'bg-blue-100' : ''}
            >
              {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feedback section */}
      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-medium mb-4">Feeback session</h3>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">1. {feedbackQuestion}</p>
          </div>
        </div>
      </div>
      
      {/* Exit button */}
      <div className="p-4 flex justify-end">
        <Button 
          variant="outline" 
          className="text-gray-800"
          onClick={handleExitSession}
        >
          <X className="mr-2 h-4 w-4" /> Exit session
        </Button>
      </div>
    </div>
  );
};

export default ConversationalAI;
