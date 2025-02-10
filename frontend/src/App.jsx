
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

const App = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('history', (history) => {
      setChat(history);
    });

    socket.on('response', (aiMessage) => {
      setChat((prevChat) => [...prevChat, { sender: 'groq', message: aiMessage }]);
      console.log(aiMessage)
    });

    socket.on('error', (errorMessage) => {
      alert(errorMessage);
    });

    return () => {
      socket.off('history');
      socket.off('response');
      socket.off('error');
    };
  }, []);

  const handleSend = () => {
    if (message.trim() !== '') {
      console.log(message)
      socket.emit('message', message);
      setChat((prevChat) => [...prevChat, { sender: 'user', message }]);
      setMessage('');
    }
  };
  return (
    <div style={{display:'flex',width:"100vw",height:"100vh" ,justifyContent:"center",alignItems:'center'}}>
      <div style={{backgroundColor:"gray",padding:"20px 20px" , color:"white"}}>
        <h1 >💬 Chat with <span style={{color:"red"}}>Groq AI</span></h1>
        <div className="h-80 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50" style={{textAlign:"center"}}>
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-md max-w-xs ${
                msg.sender === 'user' ? 'bg-blue-200 self-end ml-auto' : 'bg-green-200'
              }`}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'Groq'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2" style={{display:'flex', placeItems:'center', justifyContent:"center"}}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-md p-2 outline-none"
            placeholder="Type your message..."
            // onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{height:"100%" ,padding:"6px 2px"}}

          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;