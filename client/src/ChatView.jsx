import { MessageSquare, Send, X, Bot, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ChatView = ({ file, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [chatWidth, setChatWidth] = useState(60); // percentage
  const [isDragging, setIsDragging] = useState(false);

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
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await res.json();
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "No answer received.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

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
    <div className="h-screen flex">
      {/* Chat Section */}
      <div className="flex flex-col bg-white" style={{ width: `${chatWidth}%` }}>
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Chat with PDF</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-2 overflow-auto p-4 space-y-4">
          {/* Welcome Message */}
          {showWelcomeMessage && (
            <div className="flex justify-center">
              <div className="w-2/3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">🎉 Your document is ready to chat!</p>
                    <p className="text-gray-700 text-sm mb-3">You can now ask any kind of questions. For example:</p>
                    <div className="space-y-2">
                      <div className="bg-white rounded-md p-2 border border-blue-100 text-sm text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setInputMessage("What is the main topic of this document?")}>• What is the main topic of this document?</div>
                      <div className="bg-white rounded-md p-2 border border-blue-100 text-sm text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setInputMessage("Can you summarize the key points?")}>• Can you summarize the key points?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="bg-gray-100 rounded-full p-2 mr-2 mt-1 h-fit">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-full p-2 mr-2 mt-1 h-fit">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-500">
                Analyzing document...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-end space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the document..."
              disabled={isLoading}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Draggable Divider */}
      <div 
        className={`relative bg-blue-100 hover:bg-blue-300 transition-all duration-200 cursor-col-resize flex items-center justify-center group ${
          isDragging ? 'bg-blue-400 w-3' : 'w-2 hover:w-3'
        }`}
        onMouseDown={handleMouseDown}
        title="Drag to resize panels"
      >
        <div className="absolute inset-y-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* PDF Viewer */}
      {
        file &&
       <div className="overflow-auto bg-gray-100 relative" style={{ width: `${100 - chatWidth}%` }}>
         {/* Close Button */}
        <button
          onClick={handleCloseClick}
          className="fixed top-4 right-4 z-20 bg-white hover:bg-red-500 hover:text-white 
           rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 font-bold border-2 border-red-500 cursor-pointer"
          title="Close PDF and upload another"
        >
          <X className="w-6 h-6 text-black hover:text-white font-bold stroke-2 transition-colors duration-200" />
         </button>
         
         <div className="flex justify-center items-start p-4">
           <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
             {Array.from(new Array(numPages), (el, index) => (
               <Page
                 key={`page_${index + 1}`}
                 pageNumber={index + 1}
                 className="shadow-md mb-4"
               />
             ))}
           </Document>
         </div>
       </div>
    }
      {/* Confirmation Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 rounded-lg p-6 max-w-md w-mx mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              CLOSE PDF?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to close this PDF? You'll lose your current chat and return to the upload page.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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