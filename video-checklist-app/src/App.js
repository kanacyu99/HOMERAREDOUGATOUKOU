import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   13 ステップ + やさしいヒント
--------------------------------*/
const steps = [
  { title: "動画の目的を決める",     hint: "誰に何を届けたい？まずゴールをイメージ！" },
  { title: "ターゲットを考える",     hint: "具体的な人物像を思い浮かべてみよう" },
  { title: "トーンを選ぶ",           hint: "動画の雰囲気をひとことで！" },
  { title: "伝えたいことを3つに絞る", hint: "要点を3つにすると伝わりやすいよ！" },
  { title: "1文でまとめる",          hint: "キャッチコピーのようにギュッと！" },
  { title: "どう始める？（導入）",    hint: "最初の3秒でグッと引きつけよう" },
  { title: "どう見せる？（中盤）",    hint: "3つのポイントをどう見せる？" },
  { title: "どう終わる？（まとめ）",   hint: "見終わった後どんな気持ちを残す？" },
  { title: "スクリプトを書く",        hint: "しゃべる言葉をセリフ形式で書こう" },
  { title: "撮影する",               hint: "深呼吸してリラックス、まず1本！" },
  { title: "編集する",               hint: "不要な所をカット＆テロップ追加" },
  { title: "投稿する",               hint: "勇気を出して公開！応援してるよ✨" },
  { title: "投稿後にふりかえる",      hint: "良かった点・次の改善点をメモしよう" }
];

/* ランダム褒めコメント */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 達成数→画像番号変換 */
function getStampImageNumber(count) {
  if (count >= 13) return 13;
  if (count >= 10) return 10;
  if (count >= 7)  return 7;
  if (count >= 3)  return 3;
  return 0;
}

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("completed") || "[]"));
  const [praise, setPraise] = useState("");

  /* ローカル保存 */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  /* 入力変更 */
  const handleChange = (sIdx, fIdx, val) => {
    setNotes(prev => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields
        ? steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim())
        : true;
      if (allFilled && !completed[sIdx]) {
        setCompleted(prevC => {
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

  const achieved = completed.filter(Boolean).length;
  const stampSrc = `/chick_${getStampImageNumber(achieved)}.png`;

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      {/* 🐣 画像スタンプ */}
      <div className="stamp-display" title={`達成: ${achieved} / 13`}>
        <img src={stampSrc} alt="進捗スタンプ" className="stamp-img" />
        <div className="stamp-label">{achieved}/13</div>
      </div>

      {/* 褒めコメント */}
      {praise && <div className="praise">{praise}</div>}

      {/* ステップカード */}
      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={completed[sIdx] || false}
              onChange={e => {
                const up = [...completed];
                up[sIdx] = e.target.checked;
                setCompleted(up);
              }}
            />
            <h2 className="step-title">{`${sIdx}. ${step.title}`}</h2>
          </label>

          {!completed[sIdx] && <div className="hint-bubble">💡 {step.hint}</div>}

          {/* 簡易メモ欄（任意） */}
          <textarea
            className="note"
            placeholder="構成メモを書く..."
            value={notes[sIdx]?.note || ""}
            onChange={e =>
              setNotes(prev => ({ ...prev, [sIdx]: { ...prev[sIdx], note: e.target.value } }))
            }
          />
        </div>
      ))}
    </div>
  );
}
