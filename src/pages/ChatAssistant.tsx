import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { chatWithLlama } from '@/services/llamaApi';
import { toast } from '@/components/ui/sonner';

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

// Helper functions
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // API key is now hardcoded, so we always have it
  const [hasApiKey, setHasApiKey] = useState(true);
  const [claimContext, setClaimContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initial setup - load claim data (no need to check API key)
  useEffect(() => {
    // API key is hardcoded now
    setHasApiKey(true);
    
    const storedData = sessionStorage.getItem('claimData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Create context from claim data
        const context = `
          Claim ID: ${parsedData.id || 'Unknown'}
          Patient: ${parsedData.patientName || 'Unknown'}
          Patient Age: ${parsedData.patientAge || 'Unknown'} years
          Claim Amount: ${parsedData.claimAmount || 'Unknown'}
          Fraud Detection: ${parsedData.isFraud ? 'Potential Fraud' : 'No Fraud Detected'} 
          (${parsedData.confidenceScore || 0}% confidence)
          Fraud Indicators: ${parsedData.reasons ? parsedData.reasons.join(', ') : 'None'}
          Suggested Actions: ${parsedData.suggestedActions ? parsedData.suggestedActions.join(', ') : 'None'}
        `;
        
        setClaimContext(context);
        
        // Add initial welcome message - now we'll always use the version that assumes we have an API key
        const initialMessages: Message[] = [
          {
            id: generateId(),
            isUser: false,
            text: "Hello! I'm your HealthGuard Assistant. I can help you understand fraud detection results and recommend next steps for your claim investigation.",
            timestamp: formatTime(new Date()),
            status: 'sent'
          }
        ];
        
        // Add second message if we have claim context
        if (context) {
          initialMessages.push({
            id: generateId(),
            isUser: false,
            text: `I noticed this claim ${parsedData.isFraud ? 'has been flagged for potential fraud' : 'shows no signs of fraud'}. Would you like me to explain why, or help you with the next steps?`,
            timestamp: formatTime(new Date(Date.now() + 1000)),
            status: 'sent'
          });
        }
        
        setMessages(initialMessages);
        
      } catch (error) {
        console.error("Error parsing claim data:", error);
        // Add fallback initial message
        setMessages([{
          id: generateId(),
          isUser: false,
          text: "Hello! I'm your HealthGuard Assistant. How can I help you today?",
          timestamp: formatTime(new Date()),
          status: 'sent'
        }]);
      }
    } else {
      // No claim data, add a generic welcome message
      setMessages([{
        id: generateId(),
        isUser: false,
        text: "Hello! I'm your HealthGuard Assistant. How can I help you today?",
        timestamp: formatTime(new Date()),
        status: 'sent'
      }]);
    }
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to handle sending a new message
  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      isUser: true,
      text: inputValue.trim(),
      timestamp: formatTime(new Date()),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Update the status to 'sent' after a brief delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => msg.id === userMessage.id ? {...msg, status: 'sent'} : msg)
      );
      
      // Show typing indicator - we know we always have an API key now
      setIsTyping(true);
      
      // Send to LLaMA API
      chatWithLlama(userMessage.text, claimContext || undefined)
        .then(response => {
          setIsTyping(false);
          
          const assistantMessage: Message = {
            id: generateId(),
            isUser: false,
            text: response,
            timestamp: formatTime(new Date()),
            status: 'sent'
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        })
        .catch(error => {
          console.error("Error with LLaMA API:", error);
          setIsTyping(false);
          
          // Add error message
          const errorMessage: Message = {
            id: generateId(),
            isUser: false,
            text: "I'm sorry, I encountered an error processing your request. Please try again.",
            timestamp: formatTime(new Date()),
            status: 'error'
          };
          
          setMessages(prev => [...prev, errorMessage]);
          toast.error("Error connecting to LLaMA API");
        });
    }, 500);
  };
  
  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Auto-grow textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Chat Assistant</h1>
      
      <div className="max-w-4xl mx-auto">
        {/* Remove the API key input section entirely */}
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Chat history */}
          <div className="h-[600px] overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  isUser={message.isUser}
                  message={message.text}
                  timestamp={message.timestamp}
                  status={message.status}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
                    <span className="text-xs text-white font-bold">AI</span>
                  </div>
                  <div className="bg-gray-100 rounded-full px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full bg-transparent outline-none resize-none text-sm max-h-32"
                  rows={1}
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-2.5 rounded-full ${
                  !inputValue.trim() || isTyping
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-health-primary text-white hover:bg-health-primary/90'
                } transition-colors`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              You can ask about fraud indicators, next steps, patient history, or request report generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
