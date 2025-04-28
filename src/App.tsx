import React, { useState, useEffect } from "react";
import "./App.css";
import Hello from "./components/Hello";

function App() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<Date[]>([]);

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

  const generateTimeBlocks = () => {
    const timeBlocks = [];
    const now = new Date();
    for (let day = 0; day < 5; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);
      const dayBlocks = [];
      for (let hour = 9; hour < 21; hour++) { // Restrict hours from 9 AM to 9 PM
        for (let minute = 0; minute < 60; minute += 30) {
          const time = new Date(date);
          time.setHours(hour, minute, 0, 0);
          dayBlocks.push(time);
        }
      }
      timeBlocks.push(dayBlocks);
    }
    return timeBlocks;
  };

  const handleTimeBlockClick = (timeBlock: Date) => {
    setSelectedTimeBlocks((prev) => {
      if (prev.includes(timeBlock)) {
        return prev.filter((block) => block !== timeBlock);
      } else {
        return [...prev, timeBlock];
      }
    });
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

  const timeBlocks = generateTimeBlocks();

  return (
    <div className="App">
      <h1>Select Time Blocks</h1>
      <table className="calendar-table">
        <thead>
          <tr>
            <th>Time</th>
            {timeBlocks.map((_, dayIndex) => {
              const date = new Date();
              date.setDate(date.getDate() + dayIndex);
              return (
                <th key={dayIndex}>
                  {date.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }).map((_, timeIndex) => {
            const hour = 9 + Math.floor(timeIndex / 2); // Start from 9 AM
            const minute = timeIndex % 2 === 0 ? "00" : "30";
            const period = hour >= 12 ? "PM" : "AM";
            const standardHour = hour > 12 ? hour - 12 : hour;
            return (
              <tr key={timeIndex}>
                <td>{`${standardHour}:${minute} ${period}`}</td>
                {timeBlocks.map((dayBlocks, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`time-block ${selectedTimeBlocks.includes(dayBlocks[timeIndex]) ? "selected" : ""}`}
                    onClick={() => handleTimeBlockClick(dayBlocks[timeIndex])}
                  ></td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
