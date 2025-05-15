
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.pathname !== "/";

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2" onClick={() => isLoggedIn && navigate("/dashboard")} style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}>
            <Shield className="h-8 w-8 text-health-primary" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">HealthGuard</h1>
              <p className="text-xs text-gray-500">Fraud Detection System</p>
            </div>
          </div>
          
          {isLoggedIn && (
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>Dashboard</NavLink>
              <NavLink to="/upload" current={location.pathname === "/upload"}>Upload</NavLink>
              <NavLink to="/results" current={location.pathname === "/results"}>Results</NavLink>
              <NavLink to="/chat" current={location.pathname === "/chat"}>Assistant</NavLink>
            </nav>
          )}
          
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Healthcare Agent</p>
              </div>
              <button 
                onClick={() => navigate("/")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(to)}
      className={`text-sm font-medium px-1 py-2 ${
        current 
          ? "text-health-primary border-b-2 border-health-primary" 
          : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
      } transition-colors duration-200`}
    >
      {children}
    </button>
  );
};

export default Header;
