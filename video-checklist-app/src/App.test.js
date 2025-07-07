import { useEffect, useState } from "react";
import "./App.css";

/* ---------- 1. 日本語ステップ（STEP0のみ詳細化） ---------- */
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
  { title: "アイデア出し・企画", fields: [] },
  { title: "台本・構成設計", fields: [] },
  { title: "撮影計画・準備", fields: [] },
  { title: "撮影", fields: [] },
  { title: "素材整理・管理", fields: [] },
  { title: "編集（ポストプロダクション）", fields: [] },
  { title: "レビュー・修正", fields: [] },
  { title: "書き出し（レンダリング）", fields: [] },
  { title: "サムネイル・説明文作成", fields: [] },
  { title: "公開準備", fields: [] },
  { title: "公開", fields: [] },
  { title: "分析・改善／継続計画", fields: [] }
];

const praises = ["Great! 🎉", "素晴らしい！✨", "Good job 💯", "やったね！🥳"];

/* ---------- 2. React Component ---------- */
export default function App() {
  // notes = { stepIdx: {fieldIdx: value} }
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [praise, setPraise] = useState("");

  // --- 進捗計算 ---
  const totalFields = steps.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 1; // 0除算回避
  const doneFields = Object.values(notes).reduce(
    (acc, fld) => acc + Object.values(fld).filter((v) => v).length,
    0
  );
  const percent = Math.round((doneFields / totalFields) * 100);

  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      // STEP完了したら褒める
      if (
        steps[sIdx].fields.length &&
        steps[sIdx].fields.every((_, i) => next[sIdx]?.[i])
      ) {
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
      return next;
    });
  };

  return (
    <div className="container">
      {/* 進捗バー */}
      <div className="progress">
        <div className="bar" style={{ width: `${percent}%` }} />
        <span className="percent">{percent}%</span>
      </div>

      {steps.map((step, sIdx) => (
        <details key={sIdx} className="card" open={sIdx === 0}>
          <summary>
            {doneFields && step.fields.length
              ? step.fields.every((_, i) => notes[sIdx]?.[i])
                ? "✅ "
                : "▶︎ "
              : "◻︎ "}
            {sIdx + 1}. {step.title}
          </summary>

          {step.fields.map((field, fIdx) => (
            <div key={fIdx} className="field">
              <label>{field.label}</label>
              {field.type === "select" ? (
                <select
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                >
                  <option value="">選択してください</option>
                  {field.opts.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                  placeholder="入力してください"
                />
              )}
            </div>
          ))}
        </details>
      ))}

      {praise && <div className="praise">{praise}</div>}
    </div>
  );
}
