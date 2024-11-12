import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Loader2, Shield } from 'lucide-react';
import { chatbotService, ChatResponse } from '../services/chatbotService';

interface Message {
  content: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  links?: { title: string; url: string; }[];
}

const INITIAL_MESSAGE = {
  content: "Hello! I'm SentinelAI's security assistant. How can I help you today?",
  suggestions: [
    "Tell me about threat detection",
    "How does the AI work?",
    "Security best practices",
    "Pricing information"
  ],
  isBot: true,
  timestamp: new Date()
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const simulateTyping = () => new Promise(resolve => setTimeout(resolve, 1000));

  const handleSuggestionClick = (suggestion: string) => {
    handleUserMessage(suggestion);
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      content: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      await simulateTyping(); // Add a natural delay
      const response = await chatbotService.sendMessage(message);
      const botMessage: Message = {
        content: response.message,
        suggestions: response.suggestions,
        links: response.links,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleUserMessage(input);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">SentinelAI Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] space-y-2 ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div className={`p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.links && (
                    <div className="space-y-1">
                      {message.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          className="block text-sm text-indigo-600 hover:underline"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}