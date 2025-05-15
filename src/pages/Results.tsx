
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, MessageCircle, Download } from 'lucide-react';
import FraudBadge from '@/components/FraudBadge';
import { toast } from '@/components/ui/sonner';

const Results = () => {
  const navigate = useNavigate();
  const [claimData, setClaimData] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  useEffect(() => {
    // Retrieve claim data from session storage
    const storedData = sessionStorage.getItem('claimData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setClaimData(parsedData);
        
        // Set extracted text if available
        if (parsedData.extractedText) {
          setExtractedText(parsedData.extractedText);
        }
      } catch (error) {
        console.error("Error parsing stored claim data:", error);
        toast.error("Error loading analysis results");
      }
    } else {
      // Handle no data case
      toast.error("No analysis results found");
      navigate('/upload');
    }
  }, [navigate]);

  const handleDownloadPdf = () => {
    if (!claimData) return;
    
    // Create a link and click it to download the text as a file
    const element = document.createElement('a');
    const file = new Blob([extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${claimData.fileName || 'document'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Analysis Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Extracted Text */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-health-primary mr-2" />
                <h2 className="text-lg font-semibold">Extracted Document Text</h2>
              </div>
              <div className="text-sm text-gray-500">
                {claimData?.fileName || 'document.pdf'}
              </div>
            </div>
            
            <div className="border rounded-lg bg-gray-50">
              <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium">Document Content</span>
                <button 
                  className="text-health-primary text-xs hover:underline flex items-center" 
                  onClick={handleDownloadPdf}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Text
                </button>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {extractedText || "No text extracted from document."}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Analysis Results */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {claimData && (
              <FraudBadge isFraud={claimData.isFraud || false} size="lg" className="mb-4" />
            )}
            
            {claimData && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm">Confidence Score</span>
                  <span className="font-medium">{claimData.confidenceScore || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      claimData?.isFraud ? 'bg-health-warning' : 'bg-health-success'
                    }`} 
                    style={{ width: `${claimData?.confidenceScore || 0}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {claimData && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm mb-3">Claim Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Patient</p>
                    <p className="font-medium">{claimData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="font-medium">{claimData.patientAge} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Claim Amount</p>
                    <p className="font-medium">{claimData.claimAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">File Size</p>
                    <p className="font-medium">{claimData.fileSize ? ((claimData.fileSize / 1024 / 1024).toFixed(2) + ' MB') : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {claimData?.isFraud && claimData?.reasons && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <h3 className="font-medium">Fraud Indicators</h3>
                </div>
                <ul className="space-y-2 pl-6 text-sm">
                  {claimData.reasons.map((reason: string, index: number) => (
                    <li key={index} className="list-disc text-gray-700">{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {claimData?.suggestedActions && (
              <div>
                <h3 className="font-medium mb-3">Suggested Actions</h3>
                <ul className="space-y-2 pl-6 text-sm">
                  {claimData.suggestedActions.map((action: string, index: number) => (
                    <li key={index} className="list-disc text-gray-700">{action}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => navigate('/chat')}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Chat with Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
