import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   0〜12：動画制作フロー全ステップ
--------------------------------*/
const steps = [
  // …（前回お渡しした 13 ステップ定義をそのまま貼り付けてください）
];

/* 🎉 褒めコメント */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 🐣 スタンプ進化テーブル */
const stampTable = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 3, icon: "🐥" },
  { count: 6, icon: "🕊️" },
  { count: 9, icon: "🕊️💫" }, // 空へ旅立つイメージ
  { count: 13, icon: "🌈🕊️✨" } // 全達成
];

export default function App() {
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "{}")
  );
  const [completed, setCompleted] = useState(() =>
    JSON.parse(localStorage.getItem("completed") || "[]")
  );
  const [praise, setPraise] = useState("");

  /* 保存 */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  /* 自動達成判定 */
  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };

      // 全入力チェック
      const allFilled = steps[sIdx].fields.every(
        (_, i) => (next[sIdx]?.[i] || "").trim()
      );
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

  /* スタンプ決定 */
  const achievedCount = completed.filter(Boolean).length;
  const currentStamp =
    [...stampTable]
      .reverse()
      .find((s) => achievedCount >= s.count)?.icon || "🥚";

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      {/* スタンプ表示 */}
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
              onChange={(e) =>
                setCompleted((prev) => {
                  const up = [...prev];
                  up[sIdx] = e.target.checked;
                  return up;
                })
              }
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
