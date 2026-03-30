import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 p-4 md:p-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex gap-4 max-w-[85%] md:max-w-[75%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-gemini-blue" : "bg-gradient-to-br from-[#4285f4] via-[#9b72cb] to-[#d96570]"
        )}>
          {isUser ? <User size={18} className="text-white" /> : <Sparkles size={18} className="text-white" />}
        </div>
        
        <div className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "px-4 py-2 rounded-2xl markdown-body",
            isUser ? "bg-[#2d2f31] text-white rounded-tr-none" : "text-[#e3e3e3]"
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
