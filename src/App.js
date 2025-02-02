// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import defaultTasks from "./defaultTasks";

function App() {
  

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) return JSON.parse(saved);
    return [...defaultTasks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9)
      .map((text, index) => ({
        id: index,
        text,
        checked: false
      }));
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [title, setTitle] = useState(`やりたいことビンゴ${new Date().getFullYear()}`);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(`やりたいことビンゴ${new Date().getFullYear()}`);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const getBingoCells = () => {
    const bingoIndices = new Set();
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    lines.forEach(line => {
      if (line.every(index => tasks[index].checked)) {
        line.forEach(index => bingoIndices.add(index));
      }
    });
    return bingoIndices;
  };

  const bingoCells = getBingoCells();

  const handleEditClick = index => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const handleCheckToggle = index => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, checked: !task.checked } : task
    );
    setTasks(updated);
  };

  const handleInputBlur = index => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, text: editingText } : task
    );
    setTasks(updated);
    setEditingIndex(null);
    setEditingText("");
  };

  const handleInputKeyDown = (e, index) => {
    if (e.key === "Enter") {
      handleInputBlur(index);
    }
  };

  const shuffleTasks = () => {
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    setTasks(shuffled);
  };

  return (
    <div className="app">
      <div style={{ height: "2.5em", display:"flex", alignItems:"center", justifyContent:"center", boxSizing:"border-box", marginBottom: 12 }}>
        {editingTitle ? (
          <input 
            type="text" 
            value={titleText} 
            onChange={e => setTitleText(e.target.value)} 
            onBlur={() => { setTitle(titleText); setEditingTitle(false); }} 
            onKeyDown={e => { if (e.key === "Enter") { setTitle(titleText); setEditingTitle(false); } }} 
            autoFocus
            style={{ fontSize: "2em", fontWeight:"bold", textAlign:"center", width:"100%", height:"100%", lineHeight:"2.5em", padding:"0", margin:"0", border: "none", outline: "none", background: "transparent" }}
          />
        ) : (
          <h1 onClick={() => { setEditingTitle(true); setTitleText(title); }} style={{ fontSize:"2em", fontWeight:"bold", textAlign:"center", margin:0, lineHeight:"2.5em" }}>
            {title}
          </h1>
        )}
      </div>
      <button className="shuffle-button" onClick={shuffleTasks}>シャッフル</button>

      <div className="bingo-card">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`cell ${bingoCells.has(index) ? "bingo" : ""} ${task.checked ? "checked" : ""}`}
            onClick={() => handleCheckToggle(index)}
          >
            <div className="cell-check">
              {task.checked ? "✓" : ""}
            </div>
            <div
              className="cell-content"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(index);
              }}
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  onBlur={() => handleInputBlur(index)}
                  onKeyDown={e => handleInputKeyDown(e, index)}
                  autoFocus
                />
              ) : (
                task.text
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
