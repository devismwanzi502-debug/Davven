import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Mic, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end gap-2 bg-[#1e1f20] rounded-3xl p-2 pl-4 border border-transparent focus-within:border-[#333537] transition-all",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
          <Plus size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
          className="flex-1 bg-transparent border-none focus:ring-0 text-[#e3e3e3] placeholder-gray-500 py-2 resize-none max-h-[200px] outline-none"
        />

        <div className="flex items-center gap-1 pr-2">
          <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
            <ImageIcon size={20} />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Mic size={20} />
          </button>
          <button 
            type="submit" 
            disabled={!text.trim() || disabled}
            className={cn(
              "p-2 rounded-full transition-colors",
              text.trim() ? "text-gemini-blue hover:bg-gemini-hover" : "text-gray-600"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      <p className="text-[11px] text-center text-gray-500 mt-3">
        Gemini may display inaccurate info, including about people, so double-check its responses. <a href="#" className="underline">Your privacy and Gemini Apps</a>
      </p>
    </div>
  );
}
