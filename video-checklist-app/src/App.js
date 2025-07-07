import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   ステップ定義
   STEP0 だけ詳細入力フィールド付き
--------------------------------*/
const steps = [
  {
    title: "目標設定・コンセプト決め",
    fields: [
      {
        label: "目的",
        key: "purpose",
        opts: [
          "認知度向上",
          "販売促進",
          "ブランディング",
          "採用活動",
          "社内教育"
        ]
      },
      { label: "視聴者ターゲット", key: "audience", opts: [] },
      {
        label: "動画ジャンル",
        key: "genre",
        opts: ["解説", "Vlog", "広告", "レビュー", "ショート動画"]
      },
      {
        label: "成功の定義",
        key: "success",
        opts: ["再生数", "登録者数", "販売", "認知"]
      }
    ]
  }
  // ②以降のステップは後で拡張
];

const praises = [
  "すごい！完璧だね！✨",
  "Great job! 🎉",
  "バッチリ！👏"
];

export default function App() {
  /* ------------------------------
     notes = { stepIdx: { fieldIdx: value } }
  --------------------------------*/
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "{}")
  );
  const [praise, setPraise] = useState("");

  // 保存
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // STEP0 が全入力されたら褒める
  useEffect(() => {
    const firstStep = steps[0];
    const filled = firstStep.fields.every((_, idx) =>
      (notes[0]?.[idx] || "").trim()
    );
    if (filled && praise === "") {
      setPraise(praises[Math.floor(Math.random() * praises.length)]);
      const timer = setTimeout(() => setPraise(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notes, praise]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => ({
      ...prev,
      [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val }
    }));
  };

  return (
    <div className="app-container">
      <h1 className="title">🎥 ほめられ動画チェックリスト ✨</h1>
      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className="step">
          <h2 className="step-title">{step.title}</h2>
          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            return (
              <div className="field" key={fIdx}>
                <label className="field-label">{field.label}</label>
                {field.opts && field.opts.length ? (
                  <>
                    {/* テキスト入力 + datalistで候補表示 */}
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
