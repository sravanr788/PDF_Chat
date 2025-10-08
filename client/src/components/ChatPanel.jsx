import React from 'react';
import { Send, Bot } from "lucide-react";
import ChatMessage from "./ChatMessage"; 

const ChatPanel = ({
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    isLoading,
    showWelcomeMessage,
    chatWidth,
    messagesEndRef,
    onCitationClick
}) => {

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col bg-white shadow-xl h-full" style={{ width: `${chatWidth}%` }}>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{
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
                                    <p className="text-gray-900 font-semibold mb-3 text-center">🎉 Your document is ready!</p>
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
                    <ChatMessage
                        key={message.id}
                        message={message}
                        onCitationClick={onCitationClick}
                    />
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

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
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
                        className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;