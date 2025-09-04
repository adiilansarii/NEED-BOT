import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";

const API_KEY = import.meta.env.VITE_API_LINK_KEY;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null); // 👈 reference to bottom of chat

  // 👇 Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        }
      );

      const botText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error.response?.data || error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Failed to fetch response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"><img src="./src/assets/logo.png" alt="" /></div>
        <h1>NEED BOT</h1>
      </nav>

      {/* Chat Area */}
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <p className="message-text">{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <p className="message-text">Typing...</p>
            </div>
          )}
          {/* 👇 Invisible marker for auto-scroll */}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
  <div className="chat-input-wrapper">
    <input
      type="text"
      placeholder="Ask me anything..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyPress}
    />
    <button onClick={handleSend}>Send</button>
  </div>
</div>

      </div>
    </div>
  );
};

export default ChatPage;
