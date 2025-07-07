import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   0〜12：動画制作フロー全ステップ（前回までのstepsをここに挿入）
--------------------------------*/
import { steps } from "./steps"; // 別ファイル化もおすすめ

/* 🎉 褒めコメント */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 🐣 進化するひな（達成数によって装飾変化） */
const stampStages = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 2, icon: "🐣🎀" },
  { count: 3, icon: "🐥" },
  { count: 5, icon: "🐥✨" },
  { count: 7, icon: "🕊️" },
  { count: 10, icon: "🕊️🌟" },
  { count: 13, icon: "🕊️🌈👑" }
];

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("completed") || "[]"));
  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim());
      if (allFilled && !completed[sIdx]) {
        setCompleted((prevC) => {
          const up = [...prevC];
          up[sIdx] = true;
          return up;
        });
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
      return next;
    });
  };

  const achievedCount = completed.filter(Boolean).length;
  const currentStamp = [...stampStages].reverse().find((s) => achievedCount >= s.count)?.icon || "🥚";

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <div className="stamp-display" title={`達成: ${achievedCount} / 13`}>
        {currentStamp} ({achievedCount}/13)
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={completed[sIdx] || false}
              onChange={(e) => {
                const up = [...completed];
                up[sIdx] = e.target.checked;
                setCompleted(up);
              }}
            />
            <h2 className="step-title">{`${sIdx}. ${step.title}`}</h2>
          </label>

          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            return (
              <div className="field" key={fIdx}>
                <label className="field-label">{field.label}</label>
                {field.opts.length ? (
                  <>
                    <input
                      list={id}
                      className="field-input"
                      value={value}
                      onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                      placeholder="選択または入力してください"
                    />
                    <datalist id={id}>
                      {field.opts.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <input
                    type="text"
                    className="field-input"
                    value={value}
                    onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                    placeholder="入力してください"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
