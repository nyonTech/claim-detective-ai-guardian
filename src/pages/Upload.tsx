
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source correctly - point to CDN with correct version
useEffect(() => {
  // Set the worker source properly with correct CDN path
  const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
}, []);

// Function to extract text from PDF using pdfjs-dist
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    // Iterate through each page to extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    claimAmount: '',
    claimDescription: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileSelected = (selectedFile: File) => {
    console.log("File selected:", selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    
    if (!formData.patientAge.trim() || isNaN(Number(formData.patientAge))) {
      toast.error('Please enter a valid age');
      return;
    }
    
    if (!formData.claimAmount.trim() || isNaN(Number(formData.claimAmount.replace(/[$,]/g, '')))) {
      toast.error('Please enter a valid claim amount');
      return;
    }
    
    if (!file) {
      toast.error('Please upload a claim document');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting PDF text extraction...");
      // Extract text from the PDF using pdfjs-dist
      const extractedText = await extractTextFromPDF(file);
      console.log("PDF text extracted successfully");
      
      setIsAnalyzing(true);
      
      // Generate a unique ID for the claim
      const claimId = `CLM-${Date.now().toString().substring(6)}`;
      
      // Prepare data to store
      const claimData = {
        id: claimId,
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        claimAmount: formData.claimAmount,
        claimDescription: formData.claimDescription,
        fileName: file.name,
        fileSize: file.size,
        extractedText: extractedText,
        date: new Date().toISOString(),
        isFraud: Math.random() > 0.5, // Randomly determine fraud for demo purposes
        reason: Math.random() > 0.5 ? 'Mismatched procedure codes' : 'All documents verified',
        submittedAt: new Date().toISOString()
      };
      
      // Store in session storage for the results page
      sessionStorage.setItem('claimData', JSON.stringify(claimData));
      
      // Get existing claims from localStorage or initialize empty array
      const existingClaims = JSON.parse(localStorage.getItem('claims') || '[]');
      
      // Add new claim to the beginning of the array
      existingClaims.unshift(claimData);
      
      // Store updated claims array in localStorage
      localStorage.setItem('claims', JSON.stringify(existingClaims));
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
        setIsAnalyzing(false);
        navigate('/results');
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error processing document:', error);
      toast.error('Error processing document. Please try again.');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-health-light flex items-center justify-center">
                <LoadingSpinner size="lg" color="primary" />
              </div>
              <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-health-primary animate-pulse-blue"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Document</h2>
            <p className="text-gray-600">
              Our AI is currently analyzing the uploaded claim document and looking for potential fraud indicators.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between text-sm mb-1.5">
              <span>Analysis progress</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-health-primary h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <div className="mb-1">✓ Document loaded</div>
              <div className="mb-1">✓ Text extracted</div>
              <div className="mb-1">⟳ Analyzing patterns...</div>
              <div className="text-gray-300">• Generating report</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Upload Claim Document</h1>
      
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="patientName" className="form-label">Patient Name</label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="patientAge" className="form-label">Patient Age</label>
              <input
                id="patientAge"
                name="patientAge"
                type="text" 
                value={formData.patientAge}
                onChange={handleInputChange}
                placeholder="45"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="claimAmount" className="form-label">Claim Amount</label>
              <input
                id="claimAmount"
                name="claimAmount"
                type="text"
                value={formData.claimAmount}
                onChange={handleInputChange}
                placeholder="$1,250.00"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="claimDescription" className="form-label">Claim Description (Optional)</label>
              <textarea
                id="claimDescription"
                name="claimDescription"
                value={formData.claimDescription}
                onChange={handleInputChange}
                placeholder="Brief description of the claim..."
                className="input-field min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="form-label mb-2">Upload Claim Document</label>
            <FileUpload onFileSelected={handleFileSelected} accept=".pdf" maxSize={10} />
            <p className="mt-2 text-xs text-gray-500">
              Upload the insurance claim PDF document. This should include the patient's medical test report and claim request.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                <>
                  <span>Extract & Analyze</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
