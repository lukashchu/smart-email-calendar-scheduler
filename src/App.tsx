import React, { useState, useEffect } from "react";
import "./App.css";
import Hello from "./components/Hello";

function App() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    // Check if the key is already saved in localStorage
    const savedKey = localStorage.getItem("encryptedOpenAiKey");
    if (savedKey) {
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (openAiKey) {
      // Encrypt the key (simple base64 for demonstration; replace with stronger encryption in production)
      const encryptedKey = btoa(openAiKey);
      localStorage.setItem("encryptedOpenAiKey", encryptedKey);
      setIsKeySaved(true);
    }
  };

  if (!isKeySaved) {
    return (
      <div className="App">
        <h1>Enter Your OpenAI Key</h1>
        <input
          type="password"
          placeholder="OpenAI Key"
          value={openAiKey}
          onChange={(e) => setOpenAiKey(e.target.value)}
        />
        <button onClick={handleSaveKey}>Save Key</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Welcome to the Home Page</h1>
      <Hello person="World" />
    </div>
  );
}

export default App;
