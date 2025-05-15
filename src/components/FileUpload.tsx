
import React, { useState, useRef } from "react";
import { Upload, FileText, X, Check } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  accept = ".pdf", 
  maxSize = 10 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Check file type
    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }
    
    setError(null);
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
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelected(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
            accept={accept}
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
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className="bg-health-primary h-1.5 rounded-full w-full"></div>
            </div>
            <Check className="h-4 w-4 text-green-500 ml-2" />
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600 animate-fade-in">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
