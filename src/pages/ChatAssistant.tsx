
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

// Initial welcome messages from the assistant
const initialMessages: Message[] = [
  {
    id: '1',
    isUser: false,
    text: "Hello! I'm your HealthGuard Assistant. I can help you understand fraud detection results and recommend next steps for your claim investigation.",
    timestamp: formatTime(new Date()),
    status: 'sent'
  },
  {
    id: '2',
    isUser: false,
    text: "I noticed this claim has been flagged for potential fraud. Would you like me to explain why, or help you with the next steps?",
    timestamp: formatTime(new Date(Date.now() + 1000)),
    status: 'sent'
  }
];

// Mock responses from the assistant based on user queries
const mockResponses: {[key: string]: string} = {
  default: "I'm sorry, but I don't have specific information about that. Could you ask something related to the current claim or fraud detection results?",
  
  fraud: "This claim was flagged as potentially fraudulent for several reasons:\n\n1. There's a date inconsistency between when services were provided and when the claim was submitted\n2. The procedure codes for IV therapy appear to be improperly bundled\n3. The CT scan doesn't appear to be medically necessary for the diagnosis\n\nOur system detected similar patterns in previous fraudulent claims.",
  
  next: "Here are the recommended next steps:\n\n1. Request additional medical documentation from the provider to verify necessity of the CT scan\n2. Compare with patient's previous claims to check for patterns\n3. Contact the provider to clarify the service dates discrepancy\n4. Consider a clinical peer review of the services provided\n\nWould you like me to help draft a documentation request?",
  
  documentation: "Sure! Here's a draft documentation request:\n\n---\nRe: Claim #CLM-2023-9875\nPatient: Jessica Smith\n\nDear Provider,\n\nWe are reviewing the above claim and require additional documentation to process it:\n\n1. Complete medical records for visit on 04/28/2025\n2. Clinical justification for CT scan of head for migraine diagnosis\n3. Clarification on procedure coding for IV push and hydration therapy\n\nPlease submit these documents within 30 days.\n\nSincerely,\nHealthGuard Claims Department\n---\n\nWould you like me to make any adjustments to this draft?",
  
  history: "I've reviewed the patient's claim history and found:\n\n- 3 previous claims for migraine treatment in the past 12 months\n- No previous CT scans for migraines\n- Previous claims were processed without any fraud flags\n- Average claim amount was $450, significantly lower than the current $1,850\n\nThis unusual increase in claim amount and addition of advanced imaging without clear medical necessity contributed to the fraud flag.",
  
  report: "I'll create a detailed investigation report for this claim. The report will include:\n\n- Claim summary and fraud indicators\n- Patient claim history analysis\n- Provider billing pattern analysis\n- Recommended actions with timeline\n- Documentation request templates\n\nThis will be ready within 1 business day. Would you like me to notify you when it's complete?",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getResponseForQuery(query: string): string {
  // Convert query to lowercase for easier matching
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('why') && (lowerQuery.includes('fraud') || lowerQuery.includes('flag'))) {
    return mockResponses.fraud;
  }
  
  if (lowerQuery.includes('next') && (lowerQuery.includes('step') || lowerQuery.includes('action'))) {
    return mockResponses.next;
  }
  
  if (lowerQuery.includes('documentation') || lowerQuery.includes('request') || lowerQuery.includes('letter')) {
    return mockResponses.documentation;
  }
  
  if (lowerQuery.includes('history') || lowerQuery.includes('previous') || lowerQuery.includes('past')) {
    return mockResponses.history;
  }
  
  if (lowerQuery.includes('report') || lowerQuery.includes('investigation')) {
    return mockResponses.report;
  }
  
  return mockResponses.default;
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to handle sending a new message
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
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
      
      // Show typing indicator
      setIsTyping(true);
      
      // Generate and add assistant response after a delay
      setTimeout(() => {
        setIsTyping(false);
        
        const assistantMessage: Message = {
          id: generateId(),
          isUser: false,
          text: getResponseForQuery(userMessage.text),
          timestamp: formatTime(new Date()),
          status: 'sent'
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }, 1500 + Math.random() * 1000);
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
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
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
  );
};

export default ChatAssistant;
