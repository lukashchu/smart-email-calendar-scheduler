import React, { useState, useEffect } from "react";
import "./App.css";
import Hello from "./components/Hello";
import OpenAI from "openai";

function App() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([]);
  const [isSettingsPage, setIsSettingsPage] = useState(false); // State to toggle between pages
  const [generatedAvailability, setGeneratedAvailability] = useState("");
  // Add a dropdown to select OpenAI models
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [logEntries, setLogEntries] = useState<string[]>([]); // State to store log entries
  const [currentLogIndex, setCurrentLogIndex] = useState(0); // State to track the current log index

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
    const timeBlockString = timeBlock.toISOString();
    setSelectedTimeBlocks((prev) => {
      const isSelected = prev.includes(timeBlockString);
      return isSelected
        ? prev.filter((block) => block !== timeBlockString)
        : [...prev, timeBlockString];
    });
  };

  const handleGenerateAvailability = async () => {
    const openai = new OpenAI({
      apiKey: atob(localStorage.getItem("encryptedOpenAiKey") || ""),
      dangerouslyAllowBrowser: true, // Enable browser usage with caution
    });

    const prompt = `Generate a professional, simple sentence that provides availability for the following 5 days based on the provided time slots. Group contiguous time slots together:\n\n${selectedTimeBlocks.join(", ")}`;

    try {
      // Default to 'gpt-3.5-turbo' if no model is selected
      const modelToUse = selectedModel || "gpt-3.5-turbo";

      const response = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
      });

      const availabilityText = response.choices?.[0]?.message?.content?.trim() || "No response from AI.";
      setGeneratedAvailability(availabilityText);
      setLogEntries((prevLogs) => {
        const updatedLogs = [...prevLogs, availabilityText];
        setCurrentLogIndex(updatedLogs.length - 1); // Update index to the latest log
        return updatedLogs;
      }); // Add the generated output to the logs
    } catch (error) {
      console.error("Error generating availability:", error);
      setGeneratedAvailability("Failed to generate availability. Please try again.");
    }
  };

  const handleNextLog = () => {
    if (currentLogIndex < logEntries.length - 1) {
      setCurrentLogIndex(currentLogIndex + 1);
    }
  };

  const handlePreviousLog = () => {
    if (currentLogIndex > 0) {
      setCurrentLogIndex(currentLogIndex - 1);
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
        <br /> {/* Add a line break to position the button below the input field */}
        <button onClick={handleSaveKey}>Save Key</button>
        {/* Add a link under the Save Key button */}
        <p>
          Access your API key <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </div>
    );
  }

  if (isSettingsPage) {
    return (
      <div className="App">
        <button className="back-button" onClick={() => setIsSettingsPage(false)}>
          <span role="img" aria-label="Back">🔙</span>
        </button>
        <h1>Settings</h1>
        <button
          className="remove-key-button"
          onClick={() => {
            localStorage.removeItem("encryptedOpenAiKey");
            setIsKeySaved(false);
          }}
        >
          Remove OpenAI Key
        </button>
        <div className="model-selection">
          <label htmlFor="model-select">Select OpenAI Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
        <div className="spacer" style={{ marginBottom: "2rem" }}></div>
        {/* Log viewer at the bottom of the settings page */}
        <div className="log-viewer" style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>Output History</h2>
          <div className="log-box" style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            {logEntries[currentLogIndex] || "No logs available"}
          </div>
          <button onClick={handlePreviousLog} disabled={currentLogIndex === 0} style={{ marginRight: "1rem" }}>
            ◀
          </button>
          <button onClick={handleNextLog} disabled={currentLogIndex === logEntries.length - 1} style={{ marginLeft: "1rem" }}>
            ▶
          </button>
        </div>
      </div>
    );
  }

  const timeBlocks = generateTimeBlocks();

  return (
    <div className="App">
      <button className="settings-button" onClick={() => setIsSettingsPage(true)}>
        <span role="img" aria-label="Settings">⚙️</span>
      </button>
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
          {Array.from({ length: 12 }).map((_, hourIndex) => {
            const hour = 9 + hourIndex; // Start from 9 AM
            const period = hour >= 12 ? "PM" : "AM";
            const standardHour = hour > 12 ? hour - 12 : hour;
            return (
              <React.Fragment key={hourIndex}>
                <tr>
                  <td rowSpan={2}>{`${standardHour}:00 ${period}`}</td>
                  {timeBlocks.map((dayBlocks, dayIndex) => (
                    <td
                      key={`day-${dayIndex}-hour-${hourIndex}-first`}
                      className={`time-block ${selectedTimeBlocks.includes(dayBlocks[hourIndex * 2].toISOString()) ? "selected" : ""}`}
                      onClick={() => handleTimeBlockClick(dayBlocks[hourIndex * 2])}
                    ></td>
                  ))}
                </tr>
                <tr>
                  {timeBlocks.map((dayBlocks, dayIndex) => (
                    <td
                      key={`day-${dayIndex}-hour-${hourIndex}-second`}
                      className={`time-block ${selectedTimeBlocks.includes(dayBlocks[hourIndex * 2 + 1].toISOString()) ? "selected" : ""}`}
                      onClick={() => handleTimeBlockClick(dayBlocks[hourIndex * 2 + 1])}
                    ></td>
                  ))}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {/* Add a button under the calendar */}
      <button className="generate-availability-button" onClick={handleGenerateAvailability}>
        Generate Availability
      </button>
      {generatedAvailability && (
        // Add a copy button to the availability output
        <div className="availability-output">
          <button
            className="copy-button"
            onClick={() => navigator.clipboard.writeText(generatedAvailability || "")}
            aria-label="Copy"
          >
            📋
          </button>
          {generatedAvailability}
        </div>
      )}
    </div>
  );
}

export default App;
