import React from 'react';
import { Plus, MessageSquare, History, Settings, HelpCircle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ sessions, currentSessionId, onNewChat, onSelectSession, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-gemini-sidebar transition-all duration-300 ease-in-out",
      isOpen ? "w-[280px]" : "w-0 -translate-x-full md:w-[68px] md:translate-x-0"
    )}>
      <div className="flex items-center h-16 px-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gemini-hover text-gray-400"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-3 gap-4 overflow-hidden">
        <button
          onClick={onNewChat}
          className={cn(
            "flex items-center gap-3 p-3 rounded-full bg-[#1a1c1e] hover:bg-[#282a2c] transition-colors",
            isOpen ? "justify-start" : "justify-center"
          )}
        >
          <Plus size={20} className="text-gray-400" />
          {isOpen && <span className="text-sm font-medium text-gray-300">New chat</span>}
        </button>

        {isOpen && (
          <div className="flex-1 overflow-y-auto space-y-1 py-2">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</h3>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors text-left truncate",
                  currentSessionId === session.id ? "bg-[#2d2f31] text-white" : "text-gray-400 hover:bg-gemini-hover"
                )}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 space-y-1">
        <SidebarItem icon={<HelpCircle size={20} />} label="Help" isOpen={isOpen} />
        <SidebarItem icon={<History size={20} />} label="Activity" isOpen={isOpen} />
        <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, isOpen }: { icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-3 rounded-full text-sm text-gray-400 hover:bg-gemini-hover transition-colors",
      isOpen ? "justify-start" : "justify-center"
    )}>
      {icon}
      {isOpen && <span>{label}</span>}
    </button>
  );
}
