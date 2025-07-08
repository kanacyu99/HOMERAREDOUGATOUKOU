import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   13 ステップ + やさしいヒント
--------------------------------*/
const steps = [
  {
    title: "動画の目的を決める",
    hint: "誰に何を届けたい？まずはゴールをイメージ！",
    fields: [
      { label: "目的（例：告知・共感・紹介など）", opts: ["告知", "共感", "紹介", "募集"] }
    ]
  },
  {
    title: "ターゲットを考える",
    hint: "具体的な人物像を思い浮かべてみよう",
    fields: [{ label: "人物像（例：就活中の学生など）", opts: [] }]
  },
  {
    title: "トーンを選ぶ",
    hint: "動画の雰囲気をひとことで！",
    fields: [
      { label: "雰囲気（例：真面目・にぎやか・やさしい）", opts: ["真面目", "にぎやか", "やさしい"] }
    ]
  },
  {
    title: "伝えたいことを3つに絞る",
    hint: "要点を3つにすると伝わりやすいよ！",
    fields: [
      { label: "ポイント①", opts: [] },
      { label: "ポイント②", opts: [] },
      { label: "ポイント③", opts: [] }
    ]
  },
  {
    title: "1文でまとめる",
    hint: "キャッチコピーのようにギュッと！",
    fields: [{ label: "まとめの1文", opts: [] }]
  },
  {
    title: "どう始める？（導入）",
    hint: "最初の3秒でグッと引きつけよう",
    fields: [{ label: "導入案", opts: [] }]
  },
  {
    title: "どう見せる？（中盤）",
    hint: "3つのポイントをどう見せる？",
    fields: [{ label: "構成イメージ", opts: [] }]
  },
  {
    title: "どう終わる？（まとめ）",
    hint: "見終わった後、どんな気持ちを残す？",
    fields: [{ label: "締めの言葉や印象づけ", opts: [] }]
  },
  {
    title: "スクリプトを書く",
    hint: "しゃべる言葉をセリフ形式で書いてみよう",
    fields: [{ label: "台本メモ", opts: [] }]
  },
  {
    title: "撮影する",
    hint: "深呼吸してリラックス、まず1本！",
    fields: [
      { label: "撮影完了？", opts: ["はい", "未"] }
    ]
  },
  {
    title: "編集する",
    hint: "不要な部分をカット、テロップを入れよう",
    fields: [{ label: "編集メモ", opts: [] }]
  },
  {
    title: "投稿する",
    hint: "勇気を出して公開！応援してるよ✨",
    fields: [
      { label: "投稿完了？", opts: ["はい", "未"] }
    ]
  },
  {
    title: "投稿後にふりかえる",
    hint: "良かった点・次の改善点をメモしよう",
    fields: [{ label: "振り返りメモ", opts: [] }]
  }
];

/* 🎉 ランダムほめコメント */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 🐣 スタンプ進化テーブル */
const stampTable = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 2, icon: "🐣🎀" },
  { count: 3, icon: "🐥" },
  { count: 5, icon: "🐥✨" },
  { count: 7, icon: "🕊️" },
  { count: 10, icon: "🕊️🌟" },
  { count: 13, icon: "🌈🕊️✨" }
];

export default function App() {
  /* 入力メモと達成状況を保存 */
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("completed") || "[]"));
  const [praise, setPraise] = useState("");

  /* ローカル保存 */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  /* 入力変更ハンドラ */
  const handleChange = (sIdx, fIdx, val) => {
    setNotes(prev => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim());

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

  /* スタンプ計算 */
  const achievedCount = completed.filter(Boolean).length;
  const currentStamp = [...stampTable].reverse().find(s => achievedCount >= s.count)?.icon || "🥚";

  /* ---- UI ---- */
  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      {/* スタンプ */}
      <div className="stamp-display" title={`達成: ${achievedCount}/13`}>
        {currentStamp} ({achievedCount}/13)
      </div>

      {/* ほめコメント */}
      {praise && <div className="praise">{praise}</div>}

      {/* ステップ表示 */}
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

          {/* ヒント */}
          {!completed[sIdx] && (
            <div className="hint-bubble">💡 {step.hint}</div>
          )}

          {/* フィールド */}
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
                      {field.opts.map(opt => <option key={opt} value={opt} />)}
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
