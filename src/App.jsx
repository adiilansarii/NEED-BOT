import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from './page/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

