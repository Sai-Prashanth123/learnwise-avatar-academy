
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Conversational AI</h1>
        <p className="text-gray-600">Ask questions and get immediate answers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-4">Your AI Assistant</h2>
                <div className="flex justify-center mb-4">
                  <Avatar 
                    size="md" 
                    speaking={isSpeaking}
                    emotion={isTyping ? 'thinking' : isSpeaking ? 'explaining' : 'happy'}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {isTyping ? "Thinking..." : isSpeaking ? "Speaking..." : "Waiting for your question..."}
                </p>
              </div>
              
              <div className="mt-auto">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium">Suggested Questions</h3>
                  
                  <div className="space-y-2">
                    {[
                      "Explain the concept of neural networks",
                      "What is the difference between SQL and NoSQL?",
                      "Can you help me understand quantum computing?",
                      "How does blockchain technology work?"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-sm h-auto py-2 px-3"
                        onClick={() => {
                          setNewMessage(question);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                        <div className="mr-2 flex-shrink-0 mt-1">
                          <Avatar size="sm" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.isUser
                            ? 'bg-avatar-primary text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        <div className={`text-xs mt-1 ${message.isUser ? 'text-avatar-primary-foreground/70' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      {message.isUser && (
                        <div className="ml-2 flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium">You</span>
                          </div>
                        </div>
                      )}
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
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      className="min-h-[60px] resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleMic}
                      className={micActive ? 'bg-avatar-primary text-white hover:bg-avatar-secondary' : ''}
                    >
                      {micActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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

export default ConversationalAI;
