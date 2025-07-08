import React, { useState, useEffect } from "react";
import "./App.css";

/* ---------- ステップ定義（label・hint付き） ---------- */
const steps = [
  {
    title: "テーマを決める",
    fields: [
      { label: "目的・テーマ",      hint: "💡 例：採用説明・仕事紹介 など" }
    ]
  },
  {
    title: "構成を考える",
    fields: [
      { label: "動画の流れ",       hint: "💡 例：オープニング→仕事内容→エンディング" },
      { label: "尺（長さ）の目安", hint: "💡 例：全体で 60 秒以内" }
    ]
  },
  {
    title: "台本を書く",
    fields: [
      { label: "セリフ・ナレーション", hint: "💡 例：「こんにちは！◯◯です」" }
    ]
  },
  {
    title: "撮影場所を決める",
    fields: [
      { label: "ロケーション候補", hint: "💡 例：会議室・オフィス・屋上 など" }
    ]
  },
  {
    title: "衣装・小物を準備",
    fields: [
      { label: "必要な小物",        hint: "💡 例：社名ロゴ・制服・名札" }
    ]
  },
  {
    title: "撮影を行う",
    fields: [
      { label: "撮影メモ",         hint: "💡 深呼吸してリラックス♪" }
    ]
  },
  {
    title: "素材を整理する",
    fields: [
      { label: "フォルダ構成メモ",  hint: "💡 OK/NG テイクを分けて保存" }
    ]
  },
  {
    title: "動画を編集する",
    fields: [
      { label: "編集ソフト",       hint: "💡 例：CapCut・VN・Canva など" }
    ]
  },
  {
    title: "BGM・効果音を入れる",
    fields: [
      { label: "曲・SEの候補",     hint: "💡 雰囲気に合うフリーBGMを探そう" }
    ]
  },
  {
    title: "説明文を書く",
    fields: [
      { label: "投稿文ドラフト",    hint: "💡 最初の一文で引きつけると◎" }
    ]
  },
  {
    title: "サムネイルを作る",
    fields: [
      { label: "サムネ案",         hint: "💡 顔＋大きな文字が目を引くよ" }
    ]
  },
  {
    title: "投稿する",
    fields: [
      { label: "プラットフォーム", hint: "💡 例：TikTok / YouTube Shorts" }
    ]
  },
  {
    title: "反応を見て振り返る",
    fields: [
      { label: "良かった点／次回改善", hint: "💡 コメント・いいね数をチェック" }
    ]
  }
];

/* ほめメッセージ */
const praises = [
  "すごい！その調子！✨",
  "Great job! 🎉",
  "バッチリ！👏"
];

/* 達成数 → 画像切り替え */
const getStamp = (c) => {
  if (c >= 13) return "chick_13.png";
  if (c >= 10) return "chick_10.png";
  if (c >= 7)  return "chick_7.png";
  if (c >= 3)  return "chick_3.png";
  return "chick_0.png";
};

export default function App() {
  /* ローカル保存：done はステップ単位、notes は [ステップ][フィールド] の二層 */
  const [done,  setDone]  = useState(() => JSON.parse(localStorage.getItem("done")  || "[]"));
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "[]"));
  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("done",  JSON.stringify(done));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [done, notes]);

  const toggle = (sIdx) => {
    const next = [...done];
    next[sIdx] = !next[sIdx];
    setDone(next);
    if (next[sIdx]) {
      setPraise(praises[Math.floor(Math.random() * praises.length)]);
      setTimeout(() => setPraise(""), 2500);
    }
  };

  const handleNote = (sIdx, fIdx, val) => {
    const next = [...notes];
    if (!next[sIdx]) next[sIdx] = [];
    next[sIdx][fIdx] = val;
    setNotes(next);
  };

  const achieved = done.filter(Boolean).length;

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス</h1>

      {/* 成長スタンプ */}
      <div className="stamp-display">
        <img
          src={process.env.PUBLIC_URL + "/" + getStamp(achieved)}
          alt="成長スタンプ"
          className="stamp-img"
        />
        <div className="stamp-label">{achieved} / {steps.length}</div>
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${done[sIdx] ? "done" : ""}`}>
          <div className="step-header">
            <input
              type="checkbox"
              checked={done[sIdx] || false}
              onChange={() => toggle(sIdx)}
            />
            <h2 className="step-title">STEP {sIdx + 1}：{step.title}</h2>
          </div>

          {step.fields.map((field, fIdx) => (
            <div className="field" key={fIdx}>
              <label className="field-label">{field.label}</label>
              <input
                className="field-input"
                type="text"
                value={notes[sIdx]?.[fIdx] || ""}
                onChange={(e) => handleNote(sIdx, fIdx, e.target.value)}
                placeholder={field.hint.replace("💡 ", "")}
              />
              {/* ヒント吹き出し（未達成のみ表示） */}
              {!done[sIdx] && (
                <div className="hint-bubble">{field.hint}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
