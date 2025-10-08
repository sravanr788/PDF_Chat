import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

const FileUploadView = ({ onFileReady }) => {
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
    const formData = new FormData();
    formData.append("file", pdfFile);

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

      const res = await fetch("https://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          onFileReady(pdfFile);
        }, 500); // Small delay to show 100%
      }
    } catch (err) {
      console.error("Error uploading PDF:", err);
      setError("Failed to upload PDF. Please try again.");
      setUploadProgress(0);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PDFChat
            </h1>
          </div>
        </div>

        <div
          className={`relative w-full h-80 flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${dragActive
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105 shadow-xl'
              : error
                ? 'border-red-300 bg-red-50 hover:border-red-400 shadow-lg'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 shadow-lg hover:shadow-xl'
            }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center w-full p-8">
            {!isLoading ? (
              <>
                {dragActive ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Drop your PDF here!
                    </h3>
                    <p className="text-gray-600">Release to upload your document</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Upload PDF to Start Chatting
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drag & drop your file here, or click to browse
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200 mb-4">
                      <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-blue-700 font-medium">Powered by AI</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 50MB • Supports PDF format only
                    </p>
                  </>
                )}
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="w-full max-w-sm mx-auto">
                  <div className="flex justify-between mb-3">
                    <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Processing PDF
                    </span>
                    <span className="text-sm font-medium text-blue-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out shadow-sm"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center mt-4 text-green-600">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      <span className="font-medium">Upload complete! Loading chat...</span>
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
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Your documents are processed securely with end-to-end encryption
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>🔒 Secure & Private</span>
            <span>•</span>
            <span>⚡ Lightning Fast</span>
            <span>•</span>
            <span>🧠 AI-Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadView;
