
import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ApiKeyInputProps {
  onSubmit?: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem('llama_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
    }
  }, []);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('llama_api_key', apiKey);
    setIsStored(true);
    toast.success('API key saved successfully');
    
    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(apiKey);
    }
  };
  
  const handleClearKey = () => {
    localStorage.removeItem('llama_api_key');
    setApiKey('');
    setIsStored(false);
    toast.info('API key removed');
  };
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-4 w-4 text-health-primary" />
        <h3 className="font-medium text-gray-800">Llama API Key</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
            {isStored ? 'Your API key is saved' : 'Enter your Llama API Key (sk-...)'}
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={isVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-4f8g..."
              className="input-field pr-10 w-full"
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {isVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored in your browser's local storage and is never sent to our servers.
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Model: meta-llama/Llama-4-Scout-17B-16E-Instruct
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveKey}
            className="btn-primary py-1 px-4 text-sm flex-1"
          >
            {isStored ? 'Update Key' : 'Save Key'}
          </button>
          
          {isStored && (
            <button
              type="button"
              onClick={handleClearKey}
              className="btn-secondary py-1 px-4 text-sm"
            >
              Remove Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
