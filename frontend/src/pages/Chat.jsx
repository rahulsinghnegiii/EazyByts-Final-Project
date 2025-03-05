import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';

const ChatMessage = ({ message, isOwn }) => (
  <div
    className={`flex ${
      isOwn ? 'justify-end' : 'justify-start'
    } mb-4`}
  >
    <div
      className={`max-w-[70%] rounded-lg px-4 py-2 ${
        isOwn
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-900 rounded-bl-none'
      }`}
    >
      <p className="text-sm font-medium">{message.content}</p>
      <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} mt-1 block`}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  </div>
);

const ChatSidebar = ({ chats, activeChat, onChatSelect }) => (
  <div className="w-80 border-r border-gray-200 h-[calc(100vh-12rem)] overflow-y-auto bg-white">
    <div className="p-4">
      <Input
        type="search"
        placeholder="Search conversations..."
        className="w-full text-gray-900"
      />
    </div>
    <div className="space-y-1">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
            activeChat?.id === chat.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {chat.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {chat.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export const Chat = () => {
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  
  // Sample data - In a real app, this would come from an API
  const [chats] = useState([
    {
      id: 1,
      name: 'Tech Conference 2024',
      lastMessage: 'Looking forward to the event!',
      messages: [
        {
          id: 1,
          content: 'Hi everyone! Welcome to the Tech Conference chat.',
          timestamp: new Date('2024-01-15T10:00:00'),
          isOwn: false,
        },
        {
          id: 2,
          content: 'Thanks! Looking forward to the event!',
          timestamp: new Date('2024-01-15T10:05:00'),
          isOwn: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Music Festival Planning',
      lastMessage: 'Stage setup is confirmed',
      messages: [
        {
          id: 1,
          content: 'Stage setup is confirmed for all three days',
          timestamp: new Date('2024-01-14T15:30:00'),
          isOwn: false,
        },
      ],
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      content: message,
      timestamp: new Date(),
      isOwn: true,
    };

    // In a real app, this would be handled by a backend service
    activeChat.messages.push(newMessage);
    activeChat.lastMessage = message;

    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
      />
      
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b border-gray-200 p-4 bg-white">
            <h2 className="text-lg font-medium text-gray-900">
              {activeChat.name}
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {activeChat.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.isOwn}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Attach file"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Add emoji"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </Button>
                <Button type="submit" variant="primary" className="bg-blue-600 hover:bg-blue-700">
                  <PaperAirplaneIcon className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}; 