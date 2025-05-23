
import React, { useState, useRef } from "react";
import { Upload, FileText, X, Check, AlertCircle, RefreshCw } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  isProcessing?: boolean;
  onRetry?: () => void;
  error?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  accept = ".pdf", 
  maxSize = 10,
  isProcessing = false,
  onRetry,
  error: externalError = null
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use external error if provided, otherwise use internal error
  const error = externalError || internalError;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File) => {
    // Check file type - support both MIME type and extension check
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      setInternalError('Please upload a PDF file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setInternalError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }
    
    // Check if file is empty
    if (file.size === 0) {
      setInternalError('File appears to be empty');
      return false;
    }
    
    setInternalError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelected(droppedFile);
      console.log("File dropped:", droppedFile.name, droppedFile.type, droppedFile.size);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelected(selectedFile);
      console.log("File selected:", selectedFile.name, selectedFile.type, selectedFile.size);
    }
  };

  const removeFile = () => {
    setFile(null);
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRetry = () => {
    if (onRetry && file) {
      onRetry();
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
            isDragging
              ? "border-health-primary bg-health-primary/5"
              : "border-gray-300 hover:border-health-primary/50 hover:bg-gray-50"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-health-light rounded-full">
              <Upload className="h-6 w-6 text-health-primary" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-700">
                Drop your file here, or{" "}
                <button
                  type="button"
                  className="text-health-primary font-medium hover:underline focus:outline-none"
                  onClick={triggerFileInput}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF files only, up to {maxSize}MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf,.pdf"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-health-light rounded-full">
                <FileText className="h-5 w-5 text-health-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500 focus:outline-none"
              aria-label="Remove file"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  error ? 'bg-red-500' : 
                  isProcessing ? 'bg-yellow-500 animate-pulse' : 
                  'bg-health-primary'
                }`} 
                style={{ width: '100%' }}
              ></div>
            </div>
            {!isProcessing && !error && <Check className="h-4 w-4 text-green-500 ml-2" />}
            {error && onRetry && (
              <button 
                onClick={handleRetry}
                className="ml-2 p-1 rounded-full hover:bg-gray-200 text-yellow-600 focus:outline-none"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600 animate-fade-in flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
