import { MessageSquare, Send, X, Bot, GripVertical, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import axios from "axios";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ChatView = ({ file, pdfContent, onClose }) => {
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Hide welcome message when user starts chatting
    if (showWelcomeMessage) {
      setShowWelcomeMessage(false);
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("Sending question to server:", userMessage.text);
      console.log("File URL:", pdfContent);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${API_BASE}/chat`, {
        question: userMessage.text,
        fileUrl: pdfContent
      }, {
        headers: { 
          "Content-Type": "application/json"
        },
        timeout: 30000
      });

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: response.data.answer || "No answer received.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while processing your question. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const navigateToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
      // Scroll to the specific page
      const pageElement = document.getElementById(`page_${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCitationClick = (pageNumber) => {
    navigateToPage(pageNumber);
  };

  const renderMessageWithCitations = (text) => {
    // Simple citation pattern matching - in real implementation, this would come from the AI response
    const citationPattern = /\[Page (\d+)\]/g;
    const parts = text.split(citationPattern);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text
        if (parts[i]) result.push(<span key={i}>{parts[i]}</span>);
      } else {
        // Citation
        const pageNum = parseInt(parts[i]);
        result.push(
          <button
            key={i}
            onClick={() => handleCitationClick(pageNum)}
            className="inline-flex items-center mx-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-md transition-colors cursor-pointer border border-blue-200"
            title={`Go to page ${pageNum}`}
          >
            <FileText className="w-3 h-3 mr-1" />
            Page {pageNum}
          </button>
        );
      }
    }
    return result;
  };

  const handleCloseClick = () => {
    setShowCloseModal(true);
  };

  const handleConfirmClose = () => {
    setShowCloseModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCancelClose = () => {
    setShowCloseModal(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const containerWidth = window.innerWidth;
    const newChatWidth = (e.clientX / containerWidth) * 100;
    
    // Constrain between 30% and 80%
    if (newChatWidth >= 30 && newChatWidth <= 80) {
      setChatWidth(newChatWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
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

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="flex flex-col bg-white shadow-xl" style={{ width: `${chatWidth}%` }}>

        <div className="flex-1 overflow-auto p-6 space-y-6 scrollbar-hide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {/* Welcome Message */}
          {showWelcomeMessage && (
            <div className="flex justify-center">
              <div className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold mb-3">🎉 Your document is ready!</p>
                    <p className="text-gray-700 text-sm mb-4">Ask me anything about your PDF. Try these examples:</p>
                    <div className="space-y-2">
                      <div 
                        className="bg-white rounded-xl p-3 border border-blue-100 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer shadow-sm" 
                        onClick={() => setInputMessage("What is the main topic of this document?")}
                      >
                        💡 What is the main topic of this document?
                      </div>
                      <div 
                        className="bg-white rounded-xl p-3 border border-blue-100 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer shadow-sm" 
                        onClick={() => setInputMessage("Can you summarize the key points?")}
                      >
                        📝 Can you summarize the key points?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-900 shadow-sm"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  {message.isUser ? (
                    <p>{message.text}</p>
                  ) : (
                    <div>{renderMessageWithCitations(message.text)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-3 mt-1">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-600 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2">Analyzing document...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the document..."
              disabled={isLoading}
              rows={2}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Draggable Divider */}
      <div 
        className={`relative bg-gradient-to-b from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300 transition-all duration-200 cursor-col-resize flex items-center justify-center group ${
          isDragging ? 'from-blue-400 to-purple-400 w-3' : 'w-2 hover:w-3'
        }`}
        onMouseDown={handleMouseDown}
        title="Drag to resize panels"
      >
        <div className="absolute inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* PDF Viewer */}
      {file && (
        <div className="overflow-auto bg-gray-100 relative" style={{ width: `${100 - chatWidth}%` }}>
          {/* PDF Controls */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-gray-100 rounded-lg">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage >= numPages}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                -
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center px-2 py-1 bg-gray-100 rounded-lg">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                +
              </button>
              {/* Close Button */}
              <button
                onClick={handleCloseClick}
                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-200"
                title="Close PDF and upload another"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center items-start p-6">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_container_${index + 1}`} id={`page_${index + 1}`} className="mb-6">
                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    className="shadow-lg border border-gray-200 rounded-lg overflow-hidden"
                    loading={
                      <div className="flex items-center justify-center p-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p>Loading page {index + 1}...</p>
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Close PDF Chat?
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to close this PDF? You'll lose your current conversation and return to the upload page.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg"
              >
                Yes, Close PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;
