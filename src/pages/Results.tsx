
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, MessageCircle } from 'lucide-react';
import FraudBadge from '@/components/FraudBadge';

const Results = () => {
  const navigate = useNavigate();
  const [claimData, setClaimData] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  useEffect(() => {
    // Retrieve claim data from session storage
    const storedData = sessionStorage.getItem('claimData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setClaimData(parsedData);
      
      // Set extracted text if available
      if (parsedData.extractedText) {
        setExtractedText(parsedData.extractedText);
      } else {
        // Fallback to mock text if no extracted text is available
        setExtractedText(`MEDICAL REPORT
Patient: ${parsedData.patientName}
DOB: 05/12/1978
Date of Service: 04/28/2025

CLINICAL INFORMATION:
Patient presents with complaints of severe headache, dizziness, and nausea for the past 3 days. History of migraines. No recent trauma reported.

DIAGNOSTIC TESTS:
- CT Scan of Head: Performed on 04/28/2025
- CBC, Comprehensive Metabolic Panel
- Urinalysis

FINDINGS:
CT Scan shows no acute intracranial abnormality. No evidence of hemorrhage, mass effect, or midline shift. Ventricles are normal in size and configuration.

Laboratory results:
- WBC: 7.2 k/uL (Normal range: 4.5-11.0)
- Hgb: 14.1 g/dL (Normal range: 12.0-16.0)
- Glucose: 102 mg/dL (Normal range: 70-99)
- BUN: 15 mg/dL (Normal range: 7-20)
- Creatinine: 0.9 mg/dL (Normal range: 0.6-1.2)

DIAGNOSIS:
1. Acute migraine without aura (G43.009)
2. Dehydration, mild (E86.0)

TREATMENT:
1. Sumatriptan 50mg oral, 1 tablet at onset, may repeat after 2 hours if needed
2. IV fluids administered: 1L NS
3. Prochlorperazine 10mg IV for nausea
4. Recommended rest in dark, quiet environment

FOLLOW-UP:
Patient advised to follow up with primary care physician in 1 week.
If symptoms worsen, return to ED immediately.

INSURANCE CLAIM FORM
Claim #: CLM-2023-9875
Insurance ID: JMS-45678-Z
Provider: Memorial Medical Center
Date Submitted: 05/02/2025

Procedures:
70450 - CT scan of head without contrast - $1,250.00
96374 - IV push, single or initial substance - $175.00
J2550 - Injection, promethazine HCL up to 50mg - $85.00
96360 - IV infusion, hydration, initial - $340.00

Total Amount: $1,850.00

Provider Signature: [Signed]
Date: 04/28/2025`);
      }
    }
  }, []);

  // Mock fraud detection result
  const mockFraudResult = claimData?.isFraud ? {
    isFraud: true,
    confidenceScore: 87,
    reasons: [
      "Inconsistency in dates: Claim form dated 05/02/2025 but service date is 04/28/2025",
      "Procedure code 96374 (IV push) billed separately from hydration therapy",
      "Diagnosis code G43.009 does not typically warrant CT scan",
    ],
    suggestedActions: [
      "Request additional documentation to verify medical necessity of CT scan",
      "Verify procedure code combination for IV therapies",
      "Review previous claims for similar patterns",
    ],
  } : {
    isFraud: false,
    confidenceScore: 95,
    reasons: [
      "All dates consistent between service and claim submission",
      "Procedure codes appropriate for diagnosis",
      "Documentation complete and supports medical necessity",
    ],
    suggestedActions: [
      "Approve claim for processing",
      "Standard review of provider claims history",
      "No additional documentation needed",
    ],
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
                <button className="text-health-primary text-xs hover:underline">Download PDF</button>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {extractedText}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Analysis Results */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <FraudBadge isFraud={claimData?.isFraud || false} size="lg" className="mb-4" />
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm">Confidence Score</span>
                <span className="font-medium">{mockFraudResult.confidenceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    claimData?.isFraud ? 'bg-health-warning' : 'bg-health-success'
                  }`} 
                  style={{ width: `${mockFraudResult.confidenceScore}%` }}
                ></div>
              </div>
            </div>
            
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
            
            {claimData?.isFraud && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <h3 className="font-medium">Fraud Indicators</h3>
                </div>
                <ul className="space-y-2 pl-6 text-sm">
                  {mockFraudResult.reasons.map((reason, index) => (
                    <li key={index} className="list-disc text-gray-700">{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-3">Suggested Actions</h3>
              <ul className="space-y-2 pl-6 text-sm">
                {mockFraudResult.suggestedActions.map((action, index) => (
                  <li key={index} className="list-disc text-gray-700">{action}</li>
                ))}
              </ul>
            </div>
            
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
