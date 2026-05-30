import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState('أحمد منصور');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock initial fetch
  useEffect(() => {
    setMessages([
      { sender: 'أحمد منصور', text: 'السلام عليكم، لقد رأيت إعلان المرسيدس GLE 450. هل ما زالت متوفرة؟', time: '10:30 ص', type: 'received' },
      { sender: 'me', text: 'وعليكم السلام، نعم السيارة لا تزال متوفرة. يمكنك معاينتها في أي وقت بمدينة الرياض.', time: '10:35 ص', type: 'sent' },
      { sender: 'أحمد منصور', text: 'ممتاز. هل السعر قابل للتفاوض البسيط؟ السيارة تبدو بحالة ممتازة في الصور.', time: '10:45 ص', type: 'received' }
    ]);
  }, [activeChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: 'me', text: newMessage, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }), type: 'sent' }]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rtl">
      
      {/* SideNavBar */}
      <aside className="hidden md:flex h-full w-64 border-l border-border-light bg-surface-container-low flex-col p-4 gap-4 shrink-0">
        <div className="mb-4">
          <h2 className="text-headline-sm font-bold text-primary">مرحباً بك</h2>
          <p className="text-label-lg text-tertiary">إدارة إعلاناتك</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-lg">لوحة التحكم</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">directions_car</span>
            <span className="font-label-lg">إعلاناتي</span>
          </Link>
          <Link to="/messages" className="flex items-center gap-3 p-3 text-on-primary-container bg-primary-container rounded-lg font-bold transition-all active:scale-95">
            <span className="material-symbols-outlined">mail</span>
            <span className="font-label-lg">الرسائل</span>
          </Link>
          <Link to="/favorites" className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">favorite</span>
            <span className="font-label-lg">المفضلة</span>
          </Link>
          <Link to="/account-settings" className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-lg">الإعدادات</span>
          </Link>
        </nav>
        
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-border-light">
          <button className="w-full py-3 mb-4 bg-on-surface text-surface-white rounded-lg font-bold text-label-lg transition-all hover:opacity-90 active:scale-95">ترقية الحساب</button>
          <Link to="/help" className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-lg">مركز المساعدة</span>
          </Link>
          <button className="flex items-center gap-3 p-3 text-tertiary hover:bg-surface-container-high rounded-lg transition-all w-full text-right">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-lg">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content: Messages Interface */}
      <main className="flex-grow flex flex-row overflow-hidden">
        
        {/* Conversation List (Sidebar) */}
        <section className="w-full md:w-1/3 md:min-w-[320px] md:max-w-[400px] border-l border-border-light bg-surface-white flex flex-col h-full">
          <div className="p-4 border-b border-border-light">
            <div className="relative">
              <input className="w-full bg-surface-container-low border-none rounded-lg py-2 px-10 text-body-sm focus:ring-2 focus:ring-accent-yellow outline-none" placeholder="البحث في الرسائل..." type="text" />
              <span className="material-symbols-outlined absolute right-3 top-2 text-tertiary">search</span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto message-scrollbar">
            
            {/* Conversation Item 1 (Active) */}
            <div 
              className={`p-4 border-b border-border-light cursor-pointer transition-colors ${activeChat === 'أحمد منصور' ? 'bg-surface-container-lowest shadow-[inset_-4px_0_0_0_#FFC107]' : 'hover:bg-surface-container-low'}`}
              onClick={() => setActiveChat('أحمد منصور')}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden shrink-0">
                    <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgoKH4UYy1_LKDn9M4l4lqGd2vFaNkhBApGXBChkmSjNifRflSjB1i4KGNlHpCHK_hh7MU-YCFnRwpleMahzteJ3AM8-gVvYXI8sq5R2wj028qyfASHs_OPh0FlgEPcXgOrt2YdrCn8VpjOoH8nbSA1VTpwG64aiF187Qm0uRXVcnmVoASXeUzKkbcrzWCMwE4pGnPQE1YREWAOrpl41q2fgcx_k5dyZ2LjfHCqjhAQIQ5rBkFO-qB_Bdbr4kbMapfb6WKZ2U9MN6_" />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-md text-on-surface">أحمد منصور</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-8 h-8 rounded border border-border-light overflow-hidden shrink-0">
                        <img alt="Car" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1pa3wZtag7Ai86uuj44OY7iUxTgnKiX7nGWQnm2j76FTqhcZ3LgrN23xvqRpJv0H4YL8stxVathCWOM7tdgWrwnLyfYQu0RJaeh351bscDArAXybC504i9I1VbhfBALpJrZuxtwyawpkdiy_lD8OfCkLsTYXHHLaT5MrWxvlw17HMK_zMCtTGdK4SlCZS91yeeUuKXajhExB9PE4PZvW71RzB8DZL23w_3wDDUWlsTRx_Q5wzUMskk9jh90fSNaAw7q86HyWI36DS" />
                      </div>
                      <span className="text-[12px] text-tertiary">Mercedes-Benz GLE 450</span>
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-[12px] text-tertiary">10:45 ص</span>
                  <div className="w-2 h-2 bg-verification-blue rounded-full mt-2 mr-auto"></div>
                </div>
              </div>
              <p className="text-body-sm text-tertiary truncate">هل السعر قابل للتفاوض البسيط؟ السيارة تبدو بحالة ممتازة...</p>
            </div>

            {/* Conversation Item 2 */}
            <div 
              className={`p-4 border-b border-border-light cursor-pointer transition-colors ${activeChat === 'سارة محمد' ? 'bg-surface-container-lowest shadow-[inset_-4px_0_0_0_#FFC107]' : 'hover:bg-surface-container-low'}`}
              onClick={() => setActiveChat('سارة محمد')}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-primary font-bold shrink-0">
                    س.م
                  </div>
                  <div>
                    <h4 className="font-bold text-body-md text-on-surface">سارة محمد</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-8 h-8 rounded border border-border-light overflow-hidden shrink-0">
                        <img alt="Car" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIPzQBLPPTsPO6PGBmMlwpZqMwW92maKZnRbjHzz_ZU-K24M5R3jDdt3jsWLt5kF1hkK99qms8MMXWmKWLIuF2rqoyWACz9FG3J_j8JGOlN0nlKAWkddd2Wb9Fn15iuUOw4uP8cGaRlEeXExgeO2fM4VUoBNKyQSX7oWxZ931A_pYuHawhDTdje7HSBmKeisUXKF1kJZrBkkA-S4U6_qA91KBfPVQfBWv6-hAS0aXNKosj7ngWd9OpdHheCHiQ9eZxJIzetb9pMAGm" />
                      </div>
                      <span className="text-[12px] text-tertiary">BMW X5 2023</span>
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-[12px] text-tertiary">أمس</span>
                </div>
              </div>
              <p className="text-body-sm text-tertiary truncate">شكراً لك، سأتواصل معك غداً لترتيب موعد المعاينة في الورشة.</p>
            </div>

            {/* Conversation Item 3 */}
            <div 
              className={`p-4 border-b border-border-light cursor-pointer transition-colors ${activeChat === 'خالد العتيبي' ? 'bg-surface-container-lowest shadow-[inset_-4px_0_0_0_#FFC107]' : 'hover:bg-surface-container-low'}`}
              onClick={() => setActiveChat('خالد العتيبي')}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden shrink-0">
                    <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP5iBoHH1xj-39sXWczURgO66nAWuOFxNpcIfDKu_uq_RI47bh25pV0MCKLjEhSjs1jHgwDoCW6wwRVDjTfsrhtI0rwFMmS4wRkCtoq26aGILL1d5OTHzzZx479vq85CKGKIs_yoHXqcH0rVR72QYTFHIuFVAEotNqjHntimS_Kw7jNEwcnP8KiDvYrF-hw3f-VA8rcIr17Dba52yGLo8oKlOOuSlPnCxCnNS-IeV6i1RZZu-xf4P8nR62EUKmGtECU4rVA0iQ8Rly" />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-md text-on-surface">خالد العتيبي</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-8 h-8 rounded border border-border-light overflow-hidden shrink-0">
                        <img alt="Car" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9vZUSTEvc4MuqSgX0UsFV4srsik21BrNEoqhzJJWWgqmjXGYVwOXCxxzemP8KAyH_PMybtOYdpd5GH4AvIK6sUIOzO8uYMu37vPJ6FlKgLZGJc5E7tfPqSb7ECE7QLq1h4zlF9LTTQE5pRSBNE3OnLFFOhEN_08OcQh3enp50gc-bmdX-6gUcekU5BwvppfRSgni3e3Y_EohximahPEMjilUPlgh5haioyAyulhrhGLHJj0ChuVT7ZlMG5lwOQ7PzOOgWsQsd_WaV" />
                      </div>
                      <span className="text-[12px] text-tertiary">Toyota Land Cruiser</span>
                    </div>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-[12px] text-tertiary">23 مايو</span>
                </div>
              </div>
              <p className="text-body-sm text-tertiary truncate">كم كيلو متر قطعت السيارة حتى الآن؟</p>
            </div>
            
          </div>
        </section>

        {/* Chat Window */}
        <section className={`flex-grow flex-col h-full bg-background relative hidden md:flex`}>
          {/* Chat Header */}
          <header className="p-4 bg-surface-white border-b border-border-light flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden shrink-0">
                <img alt="Avatar" className="w-full h-full object-cover" src={
                  activeChat === 'أحمد منصور' ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAptde4Z2WMWxo17q3sNaUyAM4O-aIqsG7b_Lf2X_sFjioUmYovEg7NJrDJl27GA6-xGidETqKvdMCVOudheM_--uB_CLUbZQUr5hka5H7z380F5EyG4rpsdn-jhpp7rO7VCJHeXpbPPLHJyC-bR5HTfeyIKJAqIDUnpUmP4NztfWG1I6oriOF0Trv9U4OGq4hSqxFyalz08MfKlrjeLt3k5plfOwNqEidilwXg8ipRecjYiz3Ryjwi_wjm2Y7m8ImG-Ibw-NELPW1M" :
                  activeChat === 'سارة محمد' ? "https://ui-avatars.com/api/?name=Sara+Mohamed&background=random" :
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBP5iBoHH1xj-39sXWczURgO66nAWuOFxNpcIfDKu_uq_RI47bh25pV0MCKLjEhSjs1jHgwDoCW6wwRVDjTfsrhtI0rwFMmS4wRkCtoq26aGILL1d5OTHzzZx479vq85CKGKIs_yoHXqcH0rVR72QYTFHIuFVAEotNqjHntimS_Kw7jNEwcnP8KiDvYrF-hw3f-VA8rcIr17Dba52yGLo8oKlOOuSlPnCxCnNS-IeV6i1RZZu-xf4P8nR62EUKmGtECU4rVA0iQ8Rly"
                } />
              </div>
              <div>
                <h3 className="font-bold text-body-md text-on-surface">{activeChat}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-tertiary">مستفسر عن:</span>
                  <span className="text-[12px] font-bold text-primary">
                    {activeChat === 'أحمد منصور' ? 'Mercedes-Benz GLE 450' : 
                     activeChat === 'سارة محمد' ? 'BMW X5 2023' : 
                     'Toyota Land Cruiser'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-tertiary hover:bg-surface-container-high rounded-full transition-all">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className="p-2 text-tertiary hover:bg-surface-container-high rounded-full transition-all">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </header>

          {/* Disclaimer Banner */}
          <div className="bg-primary-container/10 border-b border-primary-container/30 px-4 py-2 flex items-center justify-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-primary text-[14px]">info</span>
            <p className="text-[12px] font-medium text-on-primary-container">تنبيه: كارنا هي منصة عرض فقط، وليست مسؤولة عن أي عمليات بيع أو دفع تتم بين المستخدمين.</p>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 message-scrollbar flex flex-col">
            <div className="flex justify-center my-4">
              <span className="px-3 py-1 bg-surface-container-high text-tertiary text-[12px] rounded-full">اليوم</span>
            </div>
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col max-w-[80%] ${msg.type === 'sent' ? 'items-end self-end' : 'items-start'}`}>
                <div className={msg.type === 'sent' ? 'bg-primary-container p-3 rounded-xl rounded-tl-none' : 'bg-surface-white p-3 rounded-xl rounded-tr-none border border-border-light'}>
                  <p className={`text-body-sm ${msg.type === 'sent' ? 'text-on-primary-container' : 'text-on-surface'}`}>{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1`}>
                  <span className="text-[10px] text-tertiary">{msg.time}</span>
                  {msg.type === 'sent' && <span className="material-symbols-outlined text-[10px] text-verification-blue">done_all</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <footer className="p-4 bg-surface-white border-t border-border-light shrink-0">
            <div className="flex items-center gap-3">
              <button className="p-2 text-tertiary hover:bg-surface-container-high rounded-full transition-all">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <div className="flex-grow relative">
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-body-sm focus:ring-1 focus:ring-accent-yellow resize-none outline-none overflow-hidden min-h-[48px] max-h-[150px]" 
                  placeholder="اكتب رسالتك هنا..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  rows={1}
                ></textarea>
              </div>
              <button onClick={handleSendMessage} className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm shrink-0">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
