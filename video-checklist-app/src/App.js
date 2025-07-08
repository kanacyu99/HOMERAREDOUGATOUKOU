import React, { useState, useEffect } from "react";
import "./App.css";

/* ステップ定義 + ヒント文字列 */
const steps = [
  { title: "テーマを決める",  hint: "💡 例：採用説明・仕事紹介 など" },
  { title: "構成を考える",    hint: "💡 例：オープニング→仕事内容→エンディング" },
  { title: "台本を書く",      hint: "💡 例：挨拶→本題→締めの一言 をセリフ形式で" },
  { title: "撮影場所を決める", hint: "💡 静かで明るい場所？背景に社名もGood!" },
  { title: "衣装・小物を準備", hint: "💡 社員証・制服など \"らしさ\" を用意" },
  { title: "撮影を行う",       hint: "💡 深呼吸してリラックス、笑顔で♪" },
  { title: "素材を整理する",   hint: "💡 OK/NGテイクをフォルダ分け" },
  { title: "動画を編集する",   hint: "💡 テロップは見やすい色で！" },
  { title: "BGM・効果音を入れる", hint: "💡 雰囲気に合ったフリーBGMを選ぼう" },
  { title: "説明文を書く",     hint: "💡 最初の一文で興味をひこう！" },
  { title: "サムネイルを作る", hint: "💡 顔＋大きな文字が目を引くよ" },
  { title: "投稿する",         hint: "💡 勇気を出してアップ！応援してるよ✨" },
  { title: "反応を見て振り返る", hint: "💡 いいね・コメントをメモして次に活かそう" }
];

/* 成長スタンプ画像を返す関数 */
const getStampImg = (count) => {
  if (count >= 13) return "chick_13.png";
  if (count >= 10) return "chick_10.png";
  if (count >= 7)  return "chick_7.png";
  if (count >= 3)  return "chick_3.png";
  return "chick_0.png";
};

/* ほめメッセージ */
const praises = ["すごい！完璧！✨", "Great job! 🎉", "バッチリ！👏"];

export default function App() {
  /* 達成状況とメモを保存 */
  const [done, setDone] = useState(
    () => JSON.parse(localStorage.getItem("done") || "[]")
  );
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("notes") || "[]")
  );
  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("done", JSON.stringify(done));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [done, notes]);

  const toggleStep = (i) => {
    const next = [...done];
    next[i] = !next[i];
    setDone(next);
    if (next[i]) {
      setPraise(praises[Math.floor(Math.random() * praises.length)]);
      setTimeout(() => setPraise(""), 2500);
    }
  };

  const handleNote = (i, val) => {
    const next = [...notes];
    next[i] = val;
    setNotes(next);
  };

  const achieved = done.filter(Boolean).length;
  const stamp = getStampImg(achieved);

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス</h1>

      {/* 成長スタンプ */}
      <div className="stamp-display">
        <img
          src={process.env.PUBLIC_URL + "/" + stamp}
          alt="成長スタンプ"
          className="stamp-img"
        />
        <div className="stamp-label">
          {achieved} / {steps.length}
        </div>
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((s, i) => (
        <div key={i} className={`step ${done[i] ? "done" : ""}`}>
          <div className="step-header">
            <input
              type="checkbox"
              checked={done[i] || false}
              onChange={() => toggleStep(i)}
            />
            <h2 className="step-title">
              STEP {i + 1}: {s.title}
            </h2>
          </div>

          {/* 構成メモ欄 */}
          <textarea
            className="note"
            placeholder="ここに構成メモを書こう！"
            value={notes[i] || ""}
            onChange={(e) => handleNote(i, e.target.value)}
          />

          {/* やさしいヒント吹き出し */}
          {!done[i] && <div className="hint-bubble">{s.hint}</div>}
        </div>
      ))}
    </div>
  );
}
