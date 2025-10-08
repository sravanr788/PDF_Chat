// ChatView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from "react-pdf"; // Kept here for document loading
import ChatPanel from './ChatPanel';
import PDFViewer from './PDFViewer';
import axios from "axios";
import { ArrowLeft, Upload, X, GripVertical, FileText } from "lucide-react";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ChatView = ({ file, pdfContent, onClose, onBack, setShowUpload }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [chatWidth, setChatWidth] = useState(55);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const messagesEndRef = useRef(null);
  const pdfViewerRef = useRef(null);

  const fileName = file?.name || 'Document';

  // Function to extract citations and clean text (FIX: Added citation parsing logic)
  const processAiResponse = (rawAnswer) => {
    const citationRegex = /\[Page\s*(\d+)\]/g;
    const citations = [];
    const citationSet = new Set();
    let match;

    while ((match = citationRegex.exec(rawAnswer)) !== null) {
      const pageNumber = parseInt(match[1], 10);
      // Ensure unique pages are cited
      if (!citationSet.has(pageNumber)) {
        citations.push({
          page: pageNumber,
          // A more sophisticated server is needed for the citation 'text' but this works
          text: `See context on page ${pageNumber}`
        });
        citationSet.add(pageNumber);
      }
    }

    // Remove inline citations from the main text
    const cleanedText = rawAnswer.replace(citationRegex, '').trim();

    return { cleanedText, citations };
  };


  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (showWelcomeMessage) {
      setShowWelcomeMessage(false);
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const API_BASE = "http://localhost:3000";
      const response = await axios.post(`${API_BASE}/chat`, {
        question: userMessage.text,
        fileUrl: pdfContent
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000
      });

      // Process AI response for citations
      const { cleanedText, citations } = processAiResponse(response.data.answer || "No answer received.");

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: cleanedText, // Cleaned text
        citations: citations, // Separate citations array (FIXED CITATIONS)
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your question. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };


  // PDF Handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const navigateToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
      const pageElement = document.getElementById(`page_container_${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Apply a small offset for the sticky header
        if (pdfViewerRef.current) {
          pdfViewerRef.current.scrollTop -= 100;
        }
      }
    }
  };

  const handleCitationClick = (pageNumber) => {
    navigateToPage(pageNumber);
  };

  // Draggable Divider Logic (unchanged but kept here)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // Use window width for simpler percentage calculation
    const containerWidth = window.innerWidth;
    const newChatWidth = (e.clientX / containerWidth) * 100;

    if (newChatWidth >= 30 && newChatWidth <= 70) {
      setChatWidth(newChatWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);


  // Modal Logic (unchanged)
  const handleCloseClick = () => setShowCloseModal(true);
  const handleConfirmClose = () => { setShowCloseModal(false); if (onClose) onClose(); };
  const handleCancelClose = () => setShowCloseModal(false);


  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center space-x-2 justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            </div>
              <span className='text-sm font-bold font-italic'>{fileName}</span>
          </div>

          <div className="flex items-center space-x-3">
            {!file && (
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </button>
            )}
            <button
              onClick={handleCloseClick}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Row (Chat | Divider | PDF) */}
      <div id="main-content-panel" className="flex flex-1 overflow-hidden">

        <ChatPanel
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          showWelcomeMessage={showWelcomeMessage}
          chatWidth={chatWidth}
          messagesEndRef={messagesEndRef}
          onCitationClick={handleCitationClick}
        />

        {/* Draggable Divider */}
        <div
          className={`relative bg-gradient-to-b from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 transition-all duration-200 cursor-col-resize flex items-center justify-center group flex-shrink-0 ${isDragging ? 'from-blue-400 to-purple-400 w-3' : 'w-2 hover:w-3'}`}
          onMouseDown={handleMouseDown}
          title="Drag to resize panels"
        >
          <div className="absolute inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <GripVertical className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <PDFViewer
          file={file}
          chatWidth={chatWidth}
          numPages={numPages}
          currentPage={currentPage}
          scale={scale}
          pdfViewerRef={pdfViewerRef}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          navigateToPage={navigateToPage}
          setScale={setScale}
        />
      </div>

      {/* Confirmation Modal (Unchanged) */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Close PDF Chat?</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to close this PDF? You'll lose your current conversation and return to the upload page.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelClose} className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium">Cancel</button>
              <button onClick={handleConfirmClose} className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg">Yes, Close PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;