
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, AlertTriangle, CheckCircle, TrendingUp, Upload } from 'lucide-react';
import FraudBadge from '@/components/FraudBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock recent cases
  const recentCases = [
    {
      id: 'CLM-2023-9871',
      patientName: 'Robert Chen',
      date: 'May 14, 2025',
      amount: '$2,450.00',
      isFraud: false,
      reason: 'All documents verified'
    },
    {
      id: 'CLM-2023-9870',
      patientName: 'Jessica Smith',
      date: 'May 13, 2025',
      amount: '$8,720.50',
      isFraud: true,
      reason: 'Mismatched procedure codes'
    },
    {
      id: 'CLM-2023-9869',
      patientName: 'Michael Johnson',
      date: 'May 12, 2025',
      amount: '$1,340.75',
      isFraud: false,
      reason: 'All documents verified'
    },
    {
      id: 'CLM-2023-9868',
      patientName: 'Emma Williams',
      date: 'May 11, 2025',
      amount: '$12,650.00',
      isFraud: true,
      reason: 'Duplicate claim submission'
    }
  ];
  
  // Stats data
  const stats = [
    { label: 'Claims Analyzed', value: '324', icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { label: 'Fraud Detected', value: '42', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
    { label: 'Verified Claims', value: '282', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Detection Rate', value: '13%', icon: TrendingUp, color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="page-title mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Sarah. Here's an overview of your fraud detection system.</p>
        </div>
        <button 
          onClick={() => navigate('/upload')}
          className="btn-primary flex items-center mt-4 md:mt-0"
        >
          <Upload className="mr-2 h-4 w-4" />
          <span>New Upload</span>
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="health-card">
            <div className="flex items-start">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Cases */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Cases</h2>
          <button className="text-health-primary text-sm font-medium hover:underline">
            View all cases
          </button>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claim ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCases.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{claim.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{claim.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{claim.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FraudBadge isFraud={claim.isFraud} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {claim.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate('/results')}
                        className="text-health-primary hover:text-health-primary/80"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Tips Section */}
      <div className="bg-health-light rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Fraud Detection Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-3">
            <div className="shrink-0">
              <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Check for duplicate claims</h4>
              <p className="text-xs text-gray-600 mt-1">
                Compare new claims against patient history to identify potential duplicates.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="shrink-0">
              <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Verify CPT codes</h4>
              <p className="text-xs text-gray-600 mt-1">
                Ensure CPT codes match documented procedures and patient conditions.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="shrink-0">
              <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Watch for upcoding</h4>
              <p className="text-xs text-gray-600 mt-1">
                Be alert to services coded at higher levels than documentation supports.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="shrink-0">
              <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">Examine dates carefully</h4>
              <p className="text-xs text-gray-600 mt-1">
                Check for inconsistencies in service dates, report dates, and claim submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
