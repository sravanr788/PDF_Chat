import React from 'react';
import { User, Bot, ExternalLink } from 'lucide-react';

const ChatMessage = ({ message, onCitationClick }) => {
  const isUser = message.type === 'user';

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

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
              <p className="text-xs font-medium text-gray-600 mb-2">Citations:</p>
              {message.citations.map((citation, index) => (
                <button
                  key={index}
                  onClick={() => onCitationClick(citation.page)}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg p-2 transition-all duration-200 w-full text-left"
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
            isUser ? 'text-blue-200' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
