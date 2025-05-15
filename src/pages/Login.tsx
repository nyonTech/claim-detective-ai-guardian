
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, any login works
      toast.success('Login successful');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - branding */}
      <div className="bg-health-primary text-white p-8 flex-1 flex flex-col justify-center items-center md:items-start">
        <div className="max-w-md mx-auto md:mx-0 md:ml-auto">
          <div className="flex items-center mb-8">
            <Shield className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-bold">HealthGuard</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Fraud Detection System</h2>
          <p className="text-health-primary-foreground mb-6">
            AI-powered platform for healthcare insurance fraud detection. 
            Identify suspicious claims and verify patient information in seconds.
          </p>
          
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-4">
              <p className="text-sm font-medium">
                "HealthGuard has transformed our claims processing workflow, reducing fraud by 73% in just three months."
              </p>
              <div className="mt-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-white"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Dr. Sarah Chen</p>
                  <p className="text-xs text-health-primary-foreground">Medical Director, ABC Health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="#" className="text-xs text-health-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-health-primary focus:ring-health-primary/50 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="font-medium text-health-primary hover:underline">
              Contact administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
