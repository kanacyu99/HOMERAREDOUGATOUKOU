import React, { useState, useEffect } from "react";
import "./App.css";

const steps = [
  { title: "テーマを決める", field: "動画の目的やテーマは？", hint: "例：採用説明・仕事紹介 など" },
  { title: "構成を考える", field: "おおまかな流れや構成は？", hint: "例：オープニング→仕事内容→エンディング" },
  { title: "出演者を決める", field: "誰が登場する？", hint: "例：新人・先輩社員・上司など" },
  { title: "台本を書く", field: "セリフやナレーション案は？", hint: "例：「こんにちは、〇〇です！」など" },
  { title: "撮影準備をする", field: "必要なものや場所は？", hint: "例：スマホ・三脚・会議室など" },
  { title: "撮影する", field: "どんなカットを撮影した？", hint: "例：挨拶・作業風景・クロージングなど" },
  { title: "素材を集める", field: "使いたい写真・音楽・ロゴなどは？", hint: "例：社内資料・フリーBGMなど" },
  { title: "編集する", field: "どのアプリで編集？", hint: "例：CapCut・VN・Canvaなど" },
  { title: "確認して修正", field: "見直して気づいたことは？", hint: "例：音量調整・カット修正・字幕など" },
  { title: "アップロード", field: "どこに投稿する？", hint: "例：TikTok・社内共有フォルダなど" },
  { title: "タイトル・説明文", field: "どんな文章を添える？", hint: "例：「〇〇の魅力を紹介」など" },
  { title: "反応を見る", field: "どんな反応があった？", hint: "例：コメント・いいね数など" },
  { title: "次回の改善", field: "次はどうしたい？", hint: "例：長さを短く・構成を工夫する など" },
];

const praiseMessages = [
  "すごい！やったね！",
  "その調子！どんどんいこう！",
  "一歩前進、えらい！",
  "着実に進んでるね♪",
  "いい感じ！このままGO！",
];

function App() {
  const [checkedSteps, setCheckedSteps] = useState(() => {
    const stored = localStorage.getItem("checkedSteps");
    return stored ? JSON.parse(stored) : Array(steps.length).fill(false);
  });

  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem("notes");
    return stored ? JSON.parse(stored) : Array(steps.length).fill("");
  });

  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("checkedSteps", JSON.stringify(checkedSteps));
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [checkedSteps, notes]);

  const handleCheck = (index) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
    if (updated[index]) {
      const random = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
      setPraise(random);
    } else {
      setPraise("");
    }
  };

  const handleNoteChange = (index, value) => {
    const updated = [...notes];
    updated[index] = value;
    setNotes(updated);
  };

  const getChickImage = () => {
    const count = checkedSteps.filter(Boolean).length;
    const filename = `chick_${count}.png.png`;
    return process.env.PUBLIC_URL + "/" + filename;
  };

  return (
    <div className="app-container">
      <h1 className="title">ほめキャス</h1>
      <div className="stamp-display">
        <img src={getChickImage()} alt="成長スタンプ" className="stamp-img" />
        <div className="stamp-label">達成数：{checkedSteps.filter(Boolean).length} / {steps.length}</div>
      </div>
      {praise && <div className="praise">{praise}</div>}
      {steps.map((step, index) => (
        <div key={index} className={`step ${checkedSteps[index] ? "done" : ""}`}>
          <div className="step-header">
            <input
              type="checkbox"
              checked={checkedSteps[index]}
              onChange={() => handleCheck(index)}
            />
            <h2 className="step-title">{step.title}</h2>
          </div>
          <div className="field">
            <label className="field-label">{step.field}</label>
            <input
              className="field-input"
              type="text"
              value={notes[index]}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              placeholder={step.hint}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
