// ✅ App.js のヒント表示追加版（ステップ1〜2にヒント追加）
// 🐣 かわいい吹き出し風ヒント付き！

import React, { useState, useEffect } from "react";
import "./App.css";
import steps from "./steps";

const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];
const stampTable = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 3, icon: "🐥" },
  { count: 6, icon: "🕊️" },
  { count: 9, icon: "🕊️💫" },
  { count: 13, icon: "🌈🕊️✨" }
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
  const currentStamp = [...stampTable].reverse().find((s) => achievedCount >= s.count)?.icon || "🥚";

  const getHint = (sIdx, key) => {
    const hintMap = {
      "planTitle": "例：新商品紹介Vlog",
      "tone": "例：ゆるくて親しみやすい雰囲気",
      "structureMemo": "例：はじめに自己紹介→商品特徴→実演→まとめ",
      "outline": "例：導入→本編→まとめの3構成で",
      "script": "例：『今日は〇〇をご紹介します！』",
      "lines": "例：ナレーションや出演者セリフを記入してね"
    };
    return hintMap[key] || "";
  };

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
            const hint = getHint(sIdx, field.key);

            return (
              <div className="field" key={fIdx}>
                <label className="field-label">
                  {field.label}
                  {hint && <span className="hint-bubble">💡 {hint}</span>}
                </label>
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
