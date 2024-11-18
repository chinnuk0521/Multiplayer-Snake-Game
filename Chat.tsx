import React, { useState } from 'react';
import { MessageCircle, Send, Smile } from 'lucide-react';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: 'Player', text: newMessage },
    ]);
    setNewMessage('');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-blue-500/20 p-4 rounded-lg shadow-lg w-64 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="text-blue-500 neon-text" />
        <h2 className="text-xl font-bold text-blue-400">Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 rounded bg-gray-900/50 border border-blue-500/10">
            <span className="font-bold text-blue-400">{msg.user}: </span>
            <span className="text-gray-100">{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
          <Smile className="w-5 h-5 text-blue-400" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-3 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};