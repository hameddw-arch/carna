import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchUserChats, fetchChatMessages, sendMessage, markChatAsRead } from '../lib/queries/index';

export default function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Chats
  useEffect(() => {
    if (!user) return;
    const loadChats = async () => {
      try {
        const data = await fetchUserChats(user.id);
        setChats(data);
      } catch (err) {
        console.error('Error fetching chats:', err);
      } finally {
        setLoadingChats(false);
      }
    };
    loadChats();

    // Subscribe to new chats/messages to refresh list
    const subscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        loadChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Load Messages for Active Chat
  useEffect(() => {
    if (!activeChat || !user) return;

    let isMounted = true;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await fetchChatMessages(activeChat.id);
        if (!isMounted) return;
        setMessages(data);
        if (data.some(m => !m.is_read && m.sender_id !== user.id)) {
          try {
            await markChatAsRead(activeChat.id, user.id);
            if (isMounted) {
              setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, unread_count: 0 } : c));
            }
          } catch (markErr) {
            console.error('Error marking chat as read:', markErr);
          }
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };

    loadMessages();

    // Subscribe to new messages for this chat
    const subscription = supabase
      .channel(`chat_${activeChat.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeChat.id}` }, (payload) => {
        if (isMounted) {
          setMessages(prev => [...prev, payload.new]);
        }
        if (payload.new.sender_id !== user.id) {
          markChatAsRead(activeChat.id, user.id).catch(err => {
            console.error('Error marking as read on new message:', err);
          });
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, [activeChat, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !user) return;
    
    const content = newMessage.trim();
    setNewMessage('');
    
    // Optimistic UI
    const tempMsg = {
      id: 'temp-' + Date.now(),
      chat_id: activeChat.id,
      sender_id: user.id,
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await sendMessage(activeChat.id, user.id, content);
    } catch (err) {
      console.error('Error sending message:', err);
      // Revert on error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      {/* Main Content: Messages Interface */}
      <main className="flex-grow flex flex-row overflow-hidden h-[calc(100vh-70px)] md:h-screen w-full bg-surface-container-lowest">
        
        {/* Conversation List (Sidebar) */}
        <section className={`w-full md:w-1/3 md:min-w-[340px] md:max-w-[400px] border-l border-border-light bg-surface-white flex flex-col h-full shadow-sm z-10 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-lg border-b border-border-light shrink-0">
            <h2 className="font-headline-md text-headline-md font-black mb-md text-on-surface">الرسائل</h2>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 px-12 text-body-md transition-all duration-300 focus:bg-surface-white focus:border-accent-yellow focus:ring-4 focus:ring-accent-yellow/10 outline-none" 
                placeholder="البحث في المحادثات..." 
                type="text" 
              />
              <span className="material-symbols-outlined absolute right-4 top-3.5 text-tertiary group-focus-within:text-accent-yellow transition-colors">search</span>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto message-scrollbar">
            {loadingChats ? (
              <div className="flex justify-center p-xl"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-xl text-center h-full opacity-80">
                <div className="w-24 h-24 bg-primary-container/30 rounded-full flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                </div>
                <h3 className="font-bold text-headline-sm text-on-surface mb-xs">لا توجد رسائل بعد</h3>
                <p className="text-body-md text-tertiary max-w-[250px]">تواصل مع البائعين أو استقبل استفسارات حول إعلاناتك هنا.</p>
              </div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id}
                  className={`p-md border-b border-border-light cursor-pointer transition-all duration-200 ${
                    activeChat?.id === chat.id 
                      ? 'bg-primary-container/10 border-r-4 border-r-accent-yellow shadow-inner' 
                      : 'hover:bg-surface-container-low border-r-4 border-r-transparent'
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-sm">
                      <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold shadow-sm border border-border-light">
                        {chat.other_user?.avatar ? (
                           <img alt="Avatar" className="w-full h-full object-cover" src={chat.other_user.avatar} />
                        ) : (
                           <span className="text-xl">{chat.other_user?.name?.charAt(0) || 'م'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-label-lg text-on-surface">{chat.other_user?.name || 'مستخدم'}</h4>
                        <div className="flex items-center gap-xs mt-1 bg-surface-container-low px-2 py-1 rounded text-xs w-fit">
                          <span className="material-symbols-outlined text-[14px] text-tertiary">directions_car</span>
                          <span className="text-tertiary truncate max-w-[120px] font-medium">{chat.listing_title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left shrink-0 flex flex-col items-end">
                      <span className="text-[11px] text-tertiary font-medium">{chat.latest_message ? formatTime(chat.latest_message.created_at) : ''}</span>
                      {chat.unread_count > 0 && (
                        <div className="w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-[11px] font-bold mt-2 shadow-sm animate-pulse-soft">
                          {chat.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-body-sm truncate mt-2 pl-4 ${chat.unread_count > 0 ? 'text-on-surface font-bold' : 'text-tertiary'}`}>
                    {chat.latest_message ? chat.latest_message.content : 'بدأت المحادثة'}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Chat Window */}
        <section className={`flex-grow flex-col h-full bg-surface-container-lowest relative ${!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {!activeChat ? (
            <div className="text-center relative z-10 flex flex-col items-center opacity-70">
               <div className="w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center mb-lg shadow-sm">
                 <span className="material-symbols-outlined text-7xl text-tertiary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>chat_bubble</span>
               </div>
               <h3 className="font-bold text-display-sm text-tertiary">اختر محادثة للبدء</h3>
               <p className="text-body-lg text-tertiary/70 mt-2">اختر إحدى المحادثات من القائمة الجانبية لعرض الرسائل</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <header className="p-md bg-surface-white border-b border-border-light flex justify-between items-center z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-md">
                  <button className="md:hidden p-2 text-tertiary hover:bg-surface-container-low rounded-full transition-colors" onClick={() => setActiveChat(null)}>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold shadow-sm border border-border-light">
                     {activeChat.other_user?.avatar ? (
                        <img alt="Avatar" className="w-full h-full object-cover" src={activeChat.other_user.avatar} />
                     ) : (
                        <span className="text-lg">{activeChat.other_user?.name?.charAt(0) || 'م'}</span>
                     )}
                  </div>
                  <div>
                    <h3 className="font-bold text-label-xl text-on-surface">{activeChat.other_user?.name || 'مستخدم'}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-verification-blue animate-pulse"></span>
                      <span className="text-[12px] text-tertiary font-medium">متصل الآن</span>
                      <span className="mx-1 text-border-light">•</span>
                      <span className="text-[12px] text-tertiary">بخصوص:</span>
                      <span className="text-[12px] font-bold text-primary truncate max-w-[150px] hover:underline cursor-pointer">
                        {activeChat.listing_title}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center text-tertiary hover:text-primary hover:bg-primary-container/10 rounded-full transition-all">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center text-tertiary hover:text-primary hover:bg-primary-container/10 rounded-full transition-all">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </header>

              {/* Disclaimer Banner */}
              <div className="bg-primary-container/20 border-b border-primary/10 px-md py-sm flex items-center justify-center gap-xs shrink-0 z-10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">security</span>
                <p className="text-[13px] font-medium text-on-surface text-center">تنبيه: كارنا منصة عرض فقط، تأكد من فحص السيارة بنفسك قبل الدفع.</p>
              </div>

              {/* Messages Area */}
              <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 message-scrollbar flex flex-col z-10">
                {loadingMessages ? (
                  <div className="flex justify-center my-8"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>
                ) : (
                  messages.map((msg, idx) => {
                    const isSent = msg.sender_id === user?.id;
                    const showAvatar = !isSent && (idx === messages.length - 1 || messages[idx + 1]?.sender_id === user?.id);
                    
                    return (
                      <div key={msg.id} className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isSent ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        {!isSent && (
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto opacity-80">
                            {showAvatar && (
                              activeChat.other_user?.avatar ? (
                                <img src={activeChat.other_user.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-primary">
                                  {activeChat.other_user?.name?.charAt(0)}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                          <div className={`p-3.5 rounded-2xl shadow-sm relative ${
                            isSent 
                              ? 'bg-primary text-white rounded-br-sm' 
                              : 'bg-surface-white border border-border-light text-on-surface rounded-bl-sm'
                          }`}>
                            <p className="text-body-md whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 px-1 opacity-70">
                            <span className="text-[11px] font-medium">{formatTime(msg.created_at)}</span>
                            {isSent && (
                              <span className={`material-symbols-outlined text-[14px] ${msg.is_read ? 'text-verification-blue' : ''}`}>
                                {msg.is_read ? 'done_all' : 'check'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <footer className="p-4 bg-surface-white border-t border-border-light shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <button className="w-12 h-12 flex items-center justify-center text-tertiary bg-surface-container-low hover:bg-surface-container rounded-full transition-all shrink-0">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <div className="flex-grow relative bg-surface-container-low rounded-2xl border border-border-light focus-within:border-accent-yellow focus-within:ring-2 focus-within:ring-accent-yellow/20 transition-all">
                    <textarea 
                      className="w-full bg-transparent border-none py-3.5 px-4 text-body-md resize-none outline-none overflow-y-auto max-h-[120px] message-scrollbar" 
                      placeholder="اكتب رسالتك هنا..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      rows={1}
                      style={{ minHeight: '52px' }}
                    ></textarea>
                  </div>
                  <button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 flex items-center justify-center bg-accent-yellow text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <span className="material-symbols-outlined transform rtl:-scale-x-100" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}
