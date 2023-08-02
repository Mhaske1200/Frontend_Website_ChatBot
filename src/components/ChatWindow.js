import React, { useState, useEffect, useRef } from "react";

import "./ChatWindow.css";

import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);

  const [userInput, setUserInput] = useState("");

  const messagesContainerRef = useRef(null);

  const [aiResponse, setAIResponse] = useState("");

  const getAIResponse = async (userInput) => {
    try {
      const resp = await axios.post("http://localhost:5000/check", {
        userInput: userInput,
      });

      const aiResponse = resp.data;

      setAIResponse(aiResponse);
    } catch (error) {
      console.log(error);

      setAIResponse(""); // or handle error appropriately
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      setMessages([...messages, { text: userInput, fromUser: true }]);

      setUserInput("");

      getAIResponse(userInput);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (aiResponse !== "") {
      setMessages([...messages, { text: aiResponse, fromUser: false }]);
    }
  }, [aiResponse]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.fromUser ? "user" : "ai"}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />

        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
