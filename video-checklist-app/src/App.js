import { useEffect, useState } from "react";
import "./App.css";

const steps = [
  "目標設定・コンセプト決め",
  "アイデア出し・企画",
  "台本・構成設計",
  "撮影計画・準備",
  "撮影",
  "素材整理・管理",
  "編集（ポストプロダクション）",
  "レビュー・修正",
  "書き出し（レンダリング）",
  "サムネイル・説明文作成",
  "公開準備",
  "公開",
  "分析・改善／継続計画"
];

const praises = [
  "素晴らしい！🎉",
  "Good job!✨",
  "よくできました！💯",
  "最高！👍",
  "ナイス！🥳"
];

export default function App() {
  // 進捗とメモを localStorage から読み込み
  const [progress, setProgress] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("progress") || "[]");
    return saved.length ? saved : Array(steps.length).fill(false);
  });

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes") || "[]");
  });

  const [praise, setPraise] = useState("");

  // state が変わるたびに保存
  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const toggle = (idx) => {
    const next = [...progress];
    next[idx] = !next[idx];
    setProgress(next);
    // 完了にした時だけ褒める
    if (next[idx]) {
      setPraise(praises[Math.floor(Math.random() * praises.length)]);
      setTimeout(() => setPraise(""), 2500); // 2.5 秒でフェードアウト
    }
  };

  const handleNote = (idx, value) => {
    const next = [...notes];
    next[idx] = value;
    setNotes(next);
  };

  return (
    <div className="container">
      <h1 className="title">ほめられ動画投稿チェックリスト</h1>

      {steps.map((label, idx) => (
        <div key={idx} className="card">
          <label>
            <input
              type="checkbox"
              checked={progress[idx] || false}
              onChange={() => toggle(idx)}
            />
            <span className="step-label">{idx + 1}. {label}</span>
          </label>
          <textarea
            placeholder="メモを書いてください"
            value={notes[idx] || ""}
            onChange={(e) => handleNote(idx, e.target.value)}
          />
        </div>
      ))}

      {praise && <div className="praise">{praise}</div>}
    </div>
  );
}
