import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatView from './components/ChatView';
import FileUploadModal from './components/FileUploadModal';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'chat'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pdfContent, setPdfContent] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleGetStarted = () => {
    setCurrentView('chat');
    setShowUploadModal(true);
  };

  const handleFileReady = (file, fileUrl) => {
    setUploadedFile(file);
    setPdfContent(fileUrl);
    setShowUploadModal(false);
  };

  const handleCloseChat = () => {
    setUploadedFile(null);
    setPdfContent(null);
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    if (!uploadedFile) {
      setCurrentView('landing');
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentView === 'chat' && (
        <div className={uploadedFile ? '' : 'blur-sm pointer-events-none'}>
          <ChatView file={uploadedFile} pdfContent={pdfContent} onClose={handleCloseChat} />
        </div>
      )}
      <FileUploadModal 
        isOpen={showUploadModal}
        onClose={handleCloseModal}
        onFileReady={handleFileReady}
      />
    </div>
  );
}

export default App;