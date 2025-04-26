
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Youtube, Link, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentInput } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AITutor: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputType, setInputType] = useState<ContentInput['type'] | ''>('');
  const [content, setContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!inputType) {
      toast({
        title: "Input Type Required",
        description: "Please select the type of content you want to learn.",
        variant: "destructive"
      });
      return;
    }

    if (inputType === 'PDF' && !file) {
      toast({
        title: "File Required",
        description: "Please upload a PDF file to continue.",
        variant: "destructive"
      });
      return;
    }

    if ((inputType === 'YouTube' || inputType === 'Website' || inputType === 'Text') && !content) {
      toast({
        title: "Content Required",
        description: `Please provide ${inputType === 'Text' ? 'some text' : 'a valid link'} to continue.`,
        variant: "destructive"
      });
      return;
    }

    // In a real app, we'd process the input here
    // For now, just navigate to the learning session
    navigate('/ai-tutor/session', { state: { inputType, content: file || content } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Tutor</h1>
        <p className="text-gray-600">Upload content to learn with your personalized AI tutor</p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>What would you like to learn today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Step 1: Select Content Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${inputType === 'PDF' ? 'border-avatar-primary bg-avatar-primary/10' : 'border-gray-200 hover:border-avatar-primary/50'}`}
                  onClick={() => setInputType('PDF')}
                >
                  <Upload className={`h-8 w-8 ${inputType === 'PDF' ? 'text-avatar-primary' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">PDF</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${inputType === 'YouTube' ? 'border-avatar-primary bg-avatar-primary/10' : 'border-gray-200 hover:border-avatar-primary/50'}`}
                  onClick={() => setInputType('YouTube')}
                >
                  <Youtube className={`h-8 w-8 ${inputType === 'YouTube' ? 'text-avatar-primary' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">YouTube</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${inputType === 'Website' ? 'border-avatar-primary bg-avatar-primary/10' : 'border-gray-200 hover:border-avatar-primary/50'}`}
                  onClick={() => setInputType('Website')}
                >
                  <Link className={`h-8 w-8 ${inputType === 'Website' ? 'text-avatar-primary' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">Website</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${inputType === 'Text' ? 'border-avatar-primary bg-avatar-primary/10' : 'border-gray-200 hover:border-avatar-primary/50'}`}
                  onClick={() => setInputType('Text')}
                >
                  <FileText className={`h-8 w-8 ${inputType === 'Text' ? 'text-avatar-primary' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">Text</span>
                </motion.div>
              </div>
            </div>

            {inputType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-sm font-medium">Step 2: Add Your Content</p>
                
                {inputType === 'PDF' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-avatar-primary mb-2" />
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <Button
                          variant="outline"
                          onClick={() => setFile(null)}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-lg font-medium mb-1">Drop your PDF here</p>
                        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                        <Input 
                          type="file" 
                          accept=".pdf" 
                          className="hidden" 
                          onChange={handleFileChange} 
                          id="pdf-upload" 
                        />
                        <label htmlFor="pdf-upload">
                          <Button variant="outline" asChild>
                            <span>Select PDF File</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {inputType === 'YouTube' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Paste a YouTube video link</p>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                )}

                {inputType === 'Website' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Paste a website URL</p>
                    <Input
                      placeholder="https://example.com/article"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                )}

                {inputType === 'Text' && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Enter the text you want to learn</p>
                    <Textarea
                      placeholder="Type or paste your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={handleSubmit} className="w-full sm:w-auto">
                    Start Learning Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
