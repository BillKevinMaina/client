import React, { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useApp } from '../context/AppContext';

export default function ChatWindow({ incidentId, onClose }) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Listen for new messages in real-time
  useEffect(() => {
    if (!incidentId) return;

    // We look inside the specific incident document, and open its "messages" folder
    const q = query(
      collection(db, 'incidents', incidentId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(loadedMessages);
      
      // Auto-scroll to the newest message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [incidentId]);

  // 2. Send a new message to the database
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input instantly for snappy UX

    try {
      await addDoc(collection(db, 'incidents', incidentId, 'messages'), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Check connection.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 pointer-events-none">
      
      {/* Mobile Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm sm:hidden pointer-events-auto" onClick={onClose}></div>
      
      {/* Chat Window Panel */}
      <div className="w-full h-[85vh] sm:w-[400px] sm:h-[600px] bg-slate-50 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto relative overflow-hidden animate-[slideUp_0.3s_ease-out] border border-slate-200">
        
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
          <div>
            <h3 className="font-black tracking-tight text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dispatch Chat
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">End-to-End Encrypted</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex justify-center items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors font-bold">
            ✕
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-70">
              <span className="text-4xl mb-3">💬</span>
              <p className="text-xs font-bold uppercase tracking-wider">Start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser?.uid;
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                    {isMine ? 'You' : msg.senderName}
                  </span>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-sm ${isMine ? 'bg-red-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="bg-white p-4 border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-slate-100 border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-red-500 transition-colors"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              ➤
            </button>
          </form>
        </div>

      </div>
      
      <style jsx>{`
        @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
      `}</style>
    </div>
  );
}