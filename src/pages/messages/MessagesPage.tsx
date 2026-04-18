import React, { useState } from 'react';
import { mockMessages, mockUsers } from '../../services/api';
import { Message, User } from '../../types';
import { Search, Send, User as UserIcon, MoreHorizontal, Phone, Video, Image as ImageIcon, Smile, MessageSquare } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const MessagesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState<User | null>(mockUsers[1]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      recipientId: selectedChat.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="section-container py-8 h-[calc(100vh-140px)] min-h-[600px]">
      <div className="glass-card rounded-[40px] border-slate-200 h-full overflow-hidden flex shadow-2xl">
        {/* Sidebar: Chat List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-6">
            <h1 className="heading-display text-2xl text-slate-900 mb-6">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto px-2 space-y-1">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedChat(user)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left",
                  selectedChat?.id === user.id 
                    ? "bg-white shadow-soft border border-indigo-100" 
                    : "hover:bg-white/50"
                )}
              >
                <div className="relative">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.firstName} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">10:42 AM</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {mockMessages.find(m => m.senderId === user.id || m.recipientId === user.id)?.content || "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="hidden md:flex flex-grow flex-col bg-white overflow-hidden">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedChat.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{selectedChat.firstName} {selectedChat.lastName}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online Now</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-slate-400"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="text-slate-400"><Video className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon" className="text-slate-400"><MoreHorizontal className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-8 space-y-6 scroll-smooth bg-slate-50/40">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-100">
                    Project Discussion: AI Study Assistant
                  </span>
                </div>

                <AnimatePresence>
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn("flex", isMe ? "justify-end" : "justify-start")}
                      >
                        <div className={cn(
                          "max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                          isMe 
                            ? "bg-indigo-600 text-white rounded-tr-none" 
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                        )}>
                          {msg.content}
                          <div className={cn("text-[9px] mt-2 font-bold uppercase tracking-widest opacity-60", isMe ? "text-right" : "text-left")}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-primary transition-all">
                  <div className="flex items-center gap-1 px-2">
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400"><ImageIcon className="w-5 h-5" /></Button>
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400"><Smile className="w-5 h-5" /></Button>
                  </div>
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-grow bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400"
                  />
                  <Button type="submit" size="sm" className="rounded-xl px-4" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Conversations</h2>
              <p className="text-slate-500 max-w-sm">Select a person from the sidebar to view your messages or start a new conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
