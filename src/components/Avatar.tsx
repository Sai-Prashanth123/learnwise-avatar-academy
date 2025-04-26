
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarProps {
  speaking?: boolean;
  emotion?: 'happy' | 'thinking' | 'explaining' | 'confused';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  speaking = false,
  emotion = 'happy',
  size = 'md',
  className
}) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (speaking) {
      const interval = setInterval(() => {
        setBounce(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [speaking]);

  // Map size to dimensions
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }[size];
  
  // Different avatar expressions based on emotion
  const expressions = {
    happy: '😊',
    thinking: '🤔',
    explaining: '👨‍🏫',
    confused: '😕',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-full bg-gradient-to-br from-avatar-primary to-avatar-secondary flex items-center justify-center text-white avatar-shadow',
        dimensions,
        className
      )}
      animate={{
        y: bounce && speaking ? [-5, 0] : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.span 
        className="text-4xl"
        animate={speaking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        {expressions[emotion]}
      </motion.span>
      
      {speaking && (
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-avatar-accent"></div>
            <div className="h-2 w-2 rounded-full bg-avatar-accent animation-delay-200"></div>
            <div className="h-2 w-2 rounded-full bg-avatar-accent animation-delay-500"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
