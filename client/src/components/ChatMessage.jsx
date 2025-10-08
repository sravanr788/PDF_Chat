import React from 'react';
import { User, Bot, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, onCitationClick }) => {
  if (!message || !message.text) return null; 

  const isUser = message.isUser || message.type === 'user'; 

  const MarkdownComponents = {
    p: ({ children }) => (
      <p className="text-sm leading-relaxed mb-1 last:mb-0">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>
    ),
    code: ({ children, inline }) => {
      const bgColor = isUser ? 'bg-blue-700' : 'bg-gray-200';
      const textColor = isUser ? 'text-white' : 'text-red-600';
      if (inline) {
        return <code className={`${bgColor} ${textColor} px-1 rounded text-xs`}>{children}</code>;
      }
      return <pre className="mt-2 p-3 bg-gray-700 rounded-md overflow-x-auto text-white text-xs"><code>{children}</code></pre>;
    },
    a: ({ children, href }) => (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={isUser ? "text-blue-200 underline hover:text-white" : "text-blue-600 underline hover:text-blue-800"}
        >
            {children}
        </a>
    )
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-3xl`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-blue-600 text-white ml-3' 
            : 'bg-gray-200 text-gray-600 mr-3'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content Container */}
        <div 
          className={`rounded-2xl px-4 py-3 prose prose-sm max-w-none shadow-md ${
            isUser 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white prose-invert'
              : 'bg-gray-100 text-gray-900 shadow-sm'
          }`}
        >
          {/* Render message content using ReactMarkdown */}
          <ReactMarkdown components={MarkdownComponents}>
            {message.text}
          </ReactMarkdown>
          
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
              <p className={`text-xs font-medium mb-2 ${isUser ? 'text-blue-200' : 'text-gray-600'}`}>Citations:</p>
              {message.citations.map((citation, index) => (
                <button
                  key={index}
                  onClick={() => onCitationClick(citation.page)}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 w-full text-left bg-white shadow-sm"
                >
                  <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Page {citation.page}:</strong> {citation.text}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
             isUser ? 'text-blue-200 border-blue-400 border-opacity-30' : 'text-gray-500 border-gray-300'
          }`}>
            {message.timestamp ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
