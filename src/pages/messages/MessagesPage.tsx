import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { DirectMessage, DirectThread, Profile, User } from '../../types';
import { Search, Send, User as UserIcon, MoreHorizontal, Phone, Video, Image as ImageIcon, Smile, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const MessagesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [threads, setThreads] = useState<DirectThread[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const getUserId = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload));
      return decoded.user_id as number;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [threadsRes, profilesRes, messagesRes] = await Promise.all([
          apiService.messaging.listThreads(),
          apiService.profiles.list(),
          apiService.messaging.listMessages(),
        ]);
        const threadResults = threadsRes.data.results ? threadsRes.data.results : threadsRes.data;
        const profileResults = profilesRes.data.results ? profilesRes.data.results : profilesRes.data;
        const messageResults = messagesRes.data.results ? messagesRes.data.results : messagesRes.data;
        setThreads(threadResults);
        setProfiles(profileResults);
        setMessages(messageResults);

        const currentUserId = getUserId();
        if (currentUserId && threadResults.length > 0) {
          const firstThread = threadResults[0];
          const otherId = firstThread.participants.find((id: number) => id !== currentUserId);
          const otherProfile = profileResults.find((p: Profile) => p.user === otherId);
          if (otherProfile) {
            setSelectedChat({
              id: otherProfile.user,
              email: '',
              fullName: otherProfile.full_name,
              major: otherProfile.major,
              studyYear: otherProfile.study_year,
              bio: otherProfile.bio,
              skills: otherProfile.skills,
              interests: otherProfile.interests,
              preferredRole: otherProfile.preferred_role,
              avatarUrl: otherProfile.profile_picture || undefined,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    const currentUserId = getUserId();
    const thread = threads.find((t) => t.participants.includes(selectedChat.id) && t.participants.includes(currentUserId || 0));
    if (!thread) return;

    try {
      await apiService.messaging.sendMessage(thread.id, newMessage.trim());
      const messagesRes = await apiService.messaging.listMessages();
      const messageResults = messagesRes.data.results ? messagesRes.data.results : messagesRes.data;
      setMessages(messageResults);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
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
            {threads.map((thread) => {
              const currentUserId = getUserId();
              const otherId = thread.participants.find((id) => id !== currentUserId);
              const otherProfile = profiles.find((p) => p.user === otherId);
              if (!otherProfile) return null;
              const chatUser: User = {
                id: otherProfile.user,
                email: '',
                fullName: otherProfile.full_name,
                major: otherProfile.major,
                studyYear: otherProfile.study_year,
                bio: otherProfile.bio,
                skills: otherProfile.skills,
                interests: otherProfile.interests,
                preferredRole: otherProfile.preferred_role,
                avatarUrl: otherProfile.profile_picture || undefined,
              };
              const lastMessage = messages.find((m) => m.thread === thread.id);
              return (
              <button
                key={thread.id}
                onClick={() => setSelectedChat(chatUser)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left",
                  selectedChat?.id === chatUser.id 
                    ? "bg-white shadow-soft border border-indigo-100" 
                    : "hover:bg-white/50"
                )}
              >
                <div className="relative">
                  <img 
                    src={chatUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatUser.fullName)}`} 
                    alt={chatUser.fullName} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{chatUser.fullName}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">10:42 AM</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {lastMessage?.body || "No messages yet"}
                  </p>
                </div>
              </button>
            );
            })}
          </div>
        </div>

        {/* Chat window */}
        <div className="hidden md:flex flex-grow flex-col bg-white overflow-hidden">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedChat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.fullName)}`} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{selectedChat.fullName}</h3>
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
                  {messages
                    .filter((msg) => {
                      const currentUserId = getUserId();
                      const thread = threads.find((t) => t.id === msg.thread);
                      return thread?.participants.includes(selectedChat.id) && thread?.participants.includes(currentUserId || 0);
                    })
                    .map((msg) => {
                    const isMe = msg.sender === currentUser?.email;
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
                          {msg.body}
                          <div className={cn("text-[9px] mt-2 font-bold uppercase tracking-widest opacity-60", isMe ? "text-right" : "text-left")}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
