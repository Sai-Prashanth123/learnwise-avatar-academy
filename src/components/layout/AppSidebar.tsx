
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, BookOpen, MessageSquare, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Avatar } from '@/components/Avatar';

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppContext();
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: <Layout className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      name: 'AI Tutor',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/ai-tutor'
    },
    {
      name: 'Conversational AI',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/conversational-ai'
    },
    {
      name: 'Quiz',
      icon: <BookText className="h-5 w-5" />,
      path: '/quiz'
    },
  ];

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-avatar-primary flex items-center justify-center text-white font-bold text-lg">
            LW
          </div>
          <h1 className="text-lg font-bold">LearnWise</h1>
        </div>
      </div>
      
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar size="sm" />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.degreeType} Student</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                    isActive && "bg-avatar-primary/10 text-avatar-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium mb-1">Learning Progress</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="bg-avatar-primary h-full rounded-full" style={{ width: '35%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">35% Complete</p>
        </div>
      </div>
    </aside>
  );
};
