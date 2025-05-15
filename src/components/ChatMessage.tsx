
import React from 'react';

interface ChatMessageProps {
  isUser: boolean;
  message: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  isUser, 
  message, 
  timestamp,
  status = 'sent' 
}) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] md:max-w-[70%] ${isUser ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="h-6 w-6 rounded-full bg-health-primary flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">HealthGuard Assistant</span>
          </div>
        )}
        
        <div 
          className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-health-primary text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        
        <div className={`flex items-center mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{timestamp}</span>
          {isUser && status === 'sending' && (
            <span className="ml-2">Sending...</span>
          )}
          {isUser && status === 'sent' && (
            <svg className="ml-2 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isUser && status === 'error' && (
            <span className="ml-2 text-red-500">Failed to send</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
