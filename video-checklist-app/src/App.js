// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import steps from "./steps";          // 13項目入った steps.js を読み込み

const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];
const stampTable = [
  { count: 0,  icon: "🥚" },
  { count: 1,  icon: "🐣" },
  { count: 3,  icon: "🐥" },
  { count: 6,  icon: "🕊️" },
  { count: 9,  icon: "🕊️💫" },
  { count: 13, icon: "🌈🕊️✨" }
];

export default function App() {
  /* --- ① 状態 --- */
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "{}")
  );
  const [completed, setCompleted] = useState(() => {
    // ⇒ steps 長さと合わない古い配列を持っていたらリセット
    const saved = JSON.parse(localStorage.getItem("completed") || "[]");
    return Array(steps.length).fill(false).map((_, i) => !!saved[i]);
  });
  const [praise, setPraise] = useState("");

  /* --- ② 保存 --- */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  /* --- ③ 入力変更ハンドラ --- */
  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };

      // そのステップが全入力済みなら completed に true
      const allFilled = steps[sIdx].fields.every(
        (_, i) => (next[sIdx]?.[i] || "").trim()
      );

      setCompleted((prevC) => {
        const up = [...prevC];
        up[sIdx] = allFilled;
        return up;
      });

      if (allFilled) {
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
      return next;
    });
  };

  /* --- ④ スタンプ表示 --- */
  const achieved = completed.filter(Boolean).length;
  const currentStamp =
    [...stampTable].reverse().find((s) => achieved >= s.count)?.icon || "🥚";

  /* --- ⑤ 画面 --- */
  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <div className="stamp-display">
        {currentStamp} ({achieved} / {steps.length})
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={completed[sIdx]}
              onChange={(e) => {
                const up = [...completed];
                up[sIdx] = e.target.checked;
                setCompleted(up);
              }}
            />
            <h2 className="step-title">{`${sIdx + 1}. ${step.title}`}</h2>
          </label>

          {/* ヒント表示 */}
          <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 4 }}>
            {step.hint}
          </div>

          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            return (
              <div className="field" key={fIdx}>
                <label className="field-label">{field.label}</label>
                {field.opts?.length ? (
                  <>
                    <input
                      list={id}
                      className="field-input"
                      value={value}
                      onChange={(e) =>
                        handleChange(sIdx, fIdx, e.target.value)
                      }
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
                    onChange={(e) =>
                      handleChange(sIdx, fIdx, e.target.value)
                    }
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
