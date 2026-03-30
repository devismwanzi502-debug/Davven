/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { ChatSession, Message } from './types';
import { streamGeminiResponse } from './services/gemini';
import { Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleSendMessage = async (text: string) => {
    let sessionId = currentSessionId;
    let updatedSessions = [...sessions];

    if (!sessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        messages: [],
        updatedAt: Date.now(),
      };
      updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setCurrentSessionId(newSession.id);
      sessionId = newSession.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Update session with user message
    updatedSessions = updatedSessions.map(s => 
      s.id === sessionId 
        ? { ...s, messages: [...s.messages, userMessage], updatedAt: Date.now() }
        : s
    );
    setSessions(updatedSessions);
    setIsTyping(true);

    // Prepare AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
    };

    updatedSessions = updatedSessions.map(s => 
      s.id === sessionId 
        ? { ...s, messages: [...s.messages, aiMessage] }
        : s
    );
    setSessions(updatedSessions);

    // Stream AI response
    let fullContent = '';
    const history = updatedSessions.find(s => s.id === sessionId)?.messages.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })) || [];

    try {
      const stream = streamGeminiResponse(text, history);
      for await (const chunk of stream) {
        fullContent += chunk;
        setSessions(prev => prev.map(s => 
          s.id === sessionId 
            ? { 
                ...s, 
                messages: s.messages.map(m => 
                  m.id === aiMessageId ? { ...m, content: fullContent } : m
                ) 
              }
            : s
        ));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={setCurrentSessionId}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[68px]'}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-gemini-hover text-gray-400 md:flex hidden"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gemini-hover cursor-pointer">
              <span className="text-lg font-medium">Gemini</span>
              <span className="text-xs bg-[#2d2f31] px-1.5 py-0.5 rounded text-gray-400">Flash 2.0</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gemini-blue flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-semibold mb-2 gemini-gradient-text">
                  Hello, Devism
                </h1>
                <p className="text-2xl md:text-3xl text-gray-500 font-medium">
                  How can I help you today?
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <SuggestionCard 
                  icon="💡" 
                  text="Explain how to build a React app with Gemini" 
                  onClick={() => handleSendMessage("Explain how to build a React app with Gemini")}
                />
                <SuggestionCard 
                  icon="✈️" 
                  text="Plan a 3-day trip to Tokyo" 
                  onClick={() => handleSendMessage("Plan a 3-day trip to Tokyo")}
                />
                <SuggestionCard 
                  icon="📝" 
                  text="Write a professional email to my boss" 
                  onClick={() => handleSendMessage("Write a professional email to my boss")}
                />
                <SuggestionCard 
                  icon="🎨" 
                  text="Create a color palette for a modern website" 
                  onClick={() => handleSendMessage("Create a color palette for a modern website")}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto pb-32">
              <AnimatePresence>
                {currentSession.messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-gemini-bg">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      </main>
    </div>
  );
}

function SuggestionCard({ icon, text, onClick }: { icon: string; text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-[#1e1f20] hover:bg-gemini-hover rounded-xl text-left transition-colors group"
    >
      <span className="text-xl mb-2">{icon}</span>
      <span className="text-sm text-gray-300 group-hover:text-white">{text}</span>
    </button>
  );
}
