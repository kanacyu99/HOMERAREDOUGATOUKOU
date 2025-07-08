import React, { useState, useEffect } from "react";
import "./App.css";

// 🎯 13ステップの定義
const steps = [
  {
    title: "トーンを選ぶ",
    fields: [
      {
        label: "トーン",
        opts: ["元気", "真面目", "誠実", "親しみやすい", "情熱的"],
      },
    ],
  },
  {
    title: "構成メモを書く",
    fields: [
      {
        label: "構成メモ",
        opts: [],
      },
    ],
  },
  {
    title: "台本を書く",
    fields: [
      {
        label: "台本",
        opts: [],
      },
    ],
  },
  {
    title: "動画タイトルを考える",
    fields: [
      {
        label: "タイトル案",
        opts: [],
      },
    ],
  },
  {
    title: "投稿予定日を決める",
    fields: [
      {
        label: "予定日（例：2025-07-20）",
        opts: [],
      },
    ],
  },
  {
    title: "サムネイル構想",
    fields: [
      {
        label: "サムネ案",
        opts: [],
      },
    ],
  },
  {
    title: "撮影時の注意点を書く",
    fields: [
      {
        label: "注意点メモ",
        opts: [],
      },
    ],
  },
  {
    title: "撮影日を決める",
    fields: [
      {
        label: "撮影日（例：2025-07-22）",
        opts: [],
      },
    ],
  },
  {
    title: "撮影完了チェック",
    fields: [
      {
        label: "撮影完了メモ",
        opts: [],
      },
    ],
  },
  {
    title: "編集の方向性を書く",
    fields: [
      {
        label: "編集イメージ",
        opts: [],
      },
    ],
  },
  {
    title: "BGMや効果音を考える",
    fields: [
      {
        label: "音楽イメージ",
        opts: [],
      },
    ],
  },
  {
    title: "投稿文を考える",
    fields: [
      {
        label: "投稿文案",
        opts: [],
      },
    ],
  },
  {
    title: "チェック＆最終確認",
    fields: [
      {
        label: "最終チェックメモ",
        opts: [],
      },
    ],
  },
];

const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

const stampTable = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 3, icon: "🐥" },
  { count: 6, icon: "🕊️" },
  { count: 9, icon: "🕊️💫" },
  { count: 13, icon: "🌈🕊️✨" },
];

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem("done") || "[]"));
  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("done", JSON.stringify(done));
  }, [notes, done]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim());
      if (allFilled && !done.includes(sIdx)) {
        setDone((prev) => [...prev, sIdx]);
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      } else if (!allFilled && done.includes(sIdx)) {
        setDone((prev) => prev.filter((i) => i !== sIdx));
      }
      return next;
    });
  };

  const achieved = done.length;
  const stamp = [...stampTable].reverse().find((s) => achieved >= s.count)?.icon || "🥚";

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <div className="stamp-display" title={`達成: ${achieved} / ${steps.length}`}>
        {stamp} ({achieved} / {steps.length})
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${done.includes(sIdx) ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={done.includes(sIdx)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setDone((prev) =>
                  isChecked ? [...prev, sIdx] : prev.filter((i) => i !== sIdx)
                );
              }}
            />
            <h2 className="step-title">{`${sIdx + 1}. ${step.title}`}</h2>
          </label>

          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const val = notes[sIdx]?.[fIdx] || "";
            return (
              <div key={fIdx} className="field">
                <label className="field-label">{field.label}</label>
                {field.opts.length > 0 ? (
                  <>
                    <input
                      list={id}
                      className="field-input"
                      value={val}
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
                    value={val}
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
