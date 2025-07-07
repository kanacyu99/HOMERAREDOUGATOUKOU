import React, { useEffect, useState } from "react";
import "./App.css";

const steps = [
  {
    title: "目標設定・コンセプト決め",
    fields: [
      { label: "目的", type: "select", opts: ["認知度向上", "販売促進", "ブランディング", "採用活動", "社内教育"] },
      { label: "視聴者ターゲット", type: "text" },
      { label: "動画ジャンル", type: "select", opts: ["解説", "Vlog", "広告", "レビュー", "ショート動画"] },
      { label: "成功の定義", type: "select", opts: ["再生数", "登録者数", "販売", "認知"] }
    ]
  },
  // ここに他のステップも追加できます
];

export default function App() {
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes")) || {}
  );

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleChange = (stepIdx, fieldIdx, val) => {
    setNotes((prev) => ({
      ...prev,
      [stepIdx]: { ...(prev[stepIdx] || {}), [fieldIdx]: val }
    }));
  };

  return (
    <div className="App">
      <h1>動画チェックリスト</h1>
      {steps.map((step, sIdx) => (
        <div className="step" key={sIdx}>
          <h2>{step.title}</h2>
          {step.fields.map((field, fIdx) => (
            <div key={fIdx}>
              <label>{field.label}</label>
              {field.type === "text" ? (
                <input
                  type="text"
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                />
              ) : (
                <select
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                >
                  <option value="">選択してください</option>
                  {field.opts.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
