import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Sparkles, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FileUploadModal = ({ isOpen, onClose, onFileReady }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file only.");
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError("File size must be less than 50MB.");
      return;
    }
    
    setFile(selectedFile);
    await uploadToServer(selectedFile);
  };

  const onDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    setError(null);
    
    const droppedFile = event.dataTransfer.files[0];
    
    if (!droppedFile) return;
    
    if (droppedFile.type !== "application/pdf") {
      setError("Please drop a PDF file only.");
      return;
    }
    
    if (droppedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError("File size must be less than 50MB.");
      return;
    }
    
    setFile(droppedFile);
    await uploadToServer(droppedFile);
  };
  
  const onDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };
  
  const onDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const uploadToServer = async (pdfFile) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Upload PDF to Supabase storage
      const { data, error } = await supabase.storage
        .from("pdfs")
        .upload(`uploads/${Date.now()}-${pdfFile.name}`, pdfFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("pdfs")
        .getPublicUrl(data.path);

      const fileUrl = publicUrlData.publicUrl;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onFileReady(pdfFile, fileUrl);
      }, 500); // Small delay to show 100%
      
    } catch (err) {
      console.error("Error uploading PDF:", err);
      setError("Failed to upload PDF. Please try again.");
      setUploadProgress(0);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDFChat
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            className={`relative w-full h-64 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105' 
                : error 
                  ? 'border-red-300 bg-red-50 hover:border-red-400' 
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center w-full p-6">
              {!isLoading ? (
                <>
                  {dragActive ? (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Drop your PDF here!
                      </h3>
                      <p className="text-gray-600 text-sm">Release to upload your document</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Choose PDF File
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Drag & drop or click to browse
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200 mb-3">
                        <Sparkles className="w-3 h-3 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-700 font-medium">AI-Powered Analysis</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Max 50MB • PDF format only
                      </p>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="w-full max-w-xs mx-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Processing PDF
                      </span>
                      <span className="text-sm font-medium text-blue-600">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out" 
                        style={{width: `${uploadProgress}%`}}
                      ></div>
                    </div>
                    {uploadProgress === 100 && (
                      <div className="flex items-center justify-center mt-3 text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Upload complete!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={onFileChange}
              accept=".pdf"
              className="hidden"
            />
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>⚡ Fast</span>
              <span>•</span>
              <span>🧠 AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;