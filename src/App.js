// App.js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const defaultTasks = [
    "スカイダイビングに挑戦",
    "世界一周旅行を計画",
    "新しい言語をマスター",
    "料理の達人に挑戦",
    "ボランティア活動に参加",
    "自作ゲームをリリース",
    "山登りで絶景を堪能",
    "アート作品を制作",
    "自転車で日本一周"
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) return JSON.parse(saved);
    return defaultTasks.map((text, index) => ({
      id: index,
      text,
      checked: false
    }));
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

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
      <h1>やりたいことビンゴ</h1>
      <button onClick={shuffleTasks}>シャッフル</button>
      <div className="bingo-card">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`cell ${bingoCells.has(index) ? "bingo" : ""}`}
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
