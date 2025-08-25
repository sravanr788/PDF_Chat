import { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import ChatView from "./ChatView";

function App() {
  const [file, setFile] = useState(null);
  const [serverFileReady, setServerFileReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const onFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      await uploadToServer(selectedFile);
    }
  };

  const onDrop = async (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      await uploadToServer(droppedFile);
    }
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

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const data = await res.json();
      if (data.success) {
        setTimeout(() => setServerFileReady(true), 500); // Small delay to show 100%
      }
    } catch (err) {
      console.error("Error uploading PDF:", err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

   if (!serverFileReady) {
    // Show upload box until server confirms file is ready
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="w-96 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center w-full">
            <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Upload PDF to start chatting
            </h3>
            {!isLoading ? (
              <p className="text-gray-500">
                Drag & drop or click to browse
              </p>
            ) : (
              <div className="mt-4 w-full max-w-xs mx-auto">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-blue-700">Processing PDF</span>
                  <span className="text-sm font-medium text-blue-700">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{width: `${uploadProgress}%`}}
                  ></div>
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
      </div>
    );
  }

  // Function to handle closing ChatView and returning to upload
  const handleCloseChat = () => {
    setFile(null);
    setServerFileReady(false);
    setIsLoading(false);
    setUploadProgress(0);
  };

  // Once file uploaded → show chat view
  return <ChatView file={file} isLoading={isLoading} onClose={handleCloseChat} />;

}

export default App;
