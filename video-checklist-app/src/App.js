import React, { useState, useEffect } from "react";
import "./App.css";

const steps = [
  "テーマを決める",
  "構成を考える",
  "台本を書く",
  "撮影場所を決める",
  "衣装・小物を準備",
  "撮影を行う",
  "素材を整理する",
  "動画を編集する",
  "BGMや効果音を入れる",
  "テロップをつける",
  "最終チェックをする",
  "投稿文を書く",
  "アップロードして投稿！",
];

const getPraise = () => {
  const messages = [
    "一歩前進、えらい！",
    "すごい、着実に進んでる！",
    "その調子！",
    "素晴らしい取り組み！",
    "がんばってるね！",
    "君のペースでOK！",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const getStampImage = (count) => {
  if (count >= 13) return "chick_13.png";
  if (count >= 10) return "chick_10.png";
  if (count >= 7) return "chick_7.png";
  if (count >= 3) return "chick_3.png";
  return "chick_0.png";
};

function App() {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("completed");
    return saved ? JSON.parse(saved) : Array(steps.length).fill(false);
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : Array(steps.length).fill("");
  });

  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [completed, notes]);

  const toggleStep = (index) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
    if (updated[index]) {
      setPraise(getPraise());
    }
  };

  const handleNoteChange = (index, value) => {
    const updated = [...notes];
    updated[index] = value;
    setNotes(updated);
  };

  const doneCount = completed.filter(Boolean).length;
  const stampImage = getStampImage(doneCount);

  return (
    <div className="app-container">
      <h1 className="title">ほめキャス</h1>
      <div className="stamp-display">
        <img src={process.env.PUBLIC_URL + "/" + stampImage} alt="成長スタンプ" className="stamp-img" />
        <div className="stamp-label">達成数：{doneCount} / {steps.length}</div>
      </div>
      {praise && <div className="praise">{praise}</div>}
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${completed[index] ? "done" : ""}`}
        >
          <div className="step-header">
            <input
              type="checkbox"
              checked={completed[index]}
              onChange={() => toggleStep(index)}
            />
            <h2 className="step-title">{step}</h2>
          </div>
          <div className="field">
            <label className="field-label">動画の目的やテーマは？</label>
            <input
              type="text"
              className="field-input"
              value={notes[index]}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              placeholder={`例：${step.includes("テーマ") ? "採用説明・仕事紹介 など" : step.includes("構成") ? "オープニング→仕事内容→エンディング" : "自由にメモを書こう"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
