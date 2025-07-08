import React, { useState, useEffect } from "react";
import "./App.css";

/* -------------- ステップ定義 -------------- */
const steps = [
  {
    title: "テーマを決める",
    fields: [
      { label: "目的・テーマ", hint: "💡 例：採用説明・仕事紹介 など" }
    ]
  },
  /* ★ トーンと構成メモを同じステップ内に配置 ★ */
  {
    title: "動画のトーン & 構成メモ",
    fields: [
      {
        label: "動画のトーン",
        type: "select",
        opts: ["真面目", "ゆるい", "おもしろ系", "感動系"],
        hint: "💡 雰囲気を選ぶと構成メモが自動提案されます"
      },
      {
        label: "構成メモ",
        type: "text",
        hint: "💡 トーンに合わせた流れを考えてみよう"
      }
    ]
  },
  /* 以下は以前と同じ構成（例示） */
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
  /* …（残りはお好みで追加・編集可能） … */
];

/* トーン別の構成メモ自動提案 */
const toneTemplates = {
  真面目:   "導入で課題を提示 → 論理的に説明 → まとめで結論",
  ゆるい:   "雑談トークでゆったり導入 → 会話調で進行 → 締めもフランクに",
  おもしろ系:"冒頭にネタを入れる → テンポよく展開 → オチで笑いを取る",
  感動系:   "体験談で感情を引き込む → クライマックスで感動 → 励ましの言葉で締め"
};

/* ほめメッセージ */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 達成数 → ひよこ画像 */
const getStampImg = (c) => {
  if (c >= 13) return "chick_13.png";
  if (c >= 10) return "chick_10.png";
  if (c >= 7)  return "chick_7.png";
  if (c >= 3)  return "chick_3.png";
  return "chick_0.png";
};

export default function App() {
  /* ローカル保存 */
  const [done,  setDone]  = useState(() => JSON.parse(localStorage.getItem("done")  || "[]"));
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "[]"));
  const [praise,setPraise]= useState("");

  useEffect(() => {
    localStorage.setItem("done",  JSON.stringify(done));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [done, notes]);

  /* チェック切り替え */
  const toggleStep = (sIdx) => {
    const next = [...done];
    next[sIdx] = !next[sIdx];
    setDone(next);
    if (next[sIdx]) {
      setPraise(praises[Math.floor(Math.random()*praises.length)]);
      setTimeout(()=>setPraise(""), 2500);
    }
  };

  /* 入力変更（トーン→構成メモ自動補完もここで） */
  const handleFieldChange = (sIdx, fIdx, val) => {
    const next = [...notes];
    if (!next[sIdx]) next[sIdx] = [];
    next[sIdx][fIdx] = val;

    /* トーン選択で構成メモ自動入力 */
    const field = steps[sIdx].fields[fIdx];
    if (field.label === "動画のトーン") {
      const memoIdx = steps[sIdx].fields.findIndex(f => f.label === "構成メモ");
      if (memoIdx !== -1) {
        next[sIdx][memoIdx] = toneTemplates[val] || "";
      }
    }
    setNotes(next);
  };

  const achieved = done.filter(Boolean).length;

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス</h1>

      {/* スタンプ */}
      <div className="stamp-display">
        <img
          src={process.env.PUBLIC_URL + "/" + getStampImg(achieved)}
          alt="成長スタンプ"
          className="stamp-img"
        />
        <div className="stamp-label">{achieved}/{steps.length}</div>
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${done[sIdx] ? "done" : ""}`}>
          <div className="step-header">
            <input
              type="checkbox"
              checked={done[sIdx] || false}
              onChange={() => toggleStep(sIdx)}
            />
            <h2 className="step-title">STEP {sIdx+1}：{step.title}</h2>
          </div>

          {step.fields.map((field, fIdx) => (
            <div className="field" key={fIdx}>
              <label className="field-label">{field.label}</label>

              {/* 選択かテキストか判別 */}
              {field.type === "select" ? (
                <select
                  className="field-input"
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e)=>handleFieldChange(sIdx,fIdx,e.target.value)}
                >
                  <option value="">選択してください</option>
                  {field.opts.map(opt=>(
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="field-input"
                  type="text"
                  value={notes[sIdx]?.[fIdx] || ""}
                  onChange={(e)=>handleFieldChange(sIdx,fIdx,e.target.value)}
                  placeholder={field.hint.replace("💡 ","")}
                />
              )}

              {/* ヒント吹き出し（未達成時のみ） */}
              {!done[sIdx] && <div className="hint-bubble">{field.hint}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
