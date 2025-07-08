import React, { useState, useEffect } from "react";
import "./App.css";

/* ユーザー入力ステップ（5項目＋ヒント付き） */
const steps = [
  {
    id: 1,
    title: "トーンを選ぶ",
    hint: "例：元気・真面目・誠実など",
  },
  {
    id: 2,
    title: "構成メモを書く",
    hint: "例：はじめに、どんな内容か、締めの言葉などを箇条書きで",
  },
  {
    id: 3,
    title: "台本を入力する",
    hint: "書きやすい言葉でOK！あとでAIが整えてくれるよ",
  },
  {
    id: 4,
    title: "動画タイトルを考える",
    hint: "5秒で内容が伝わるようにしよう！",
  },
  {
    id: 5,
    title: "投稿予定日を入れる",
    hint: "投稿の目安をつけよう！",
  },
];

/* ひなの成長スタンプ（条件付き） */
const stampImages = [
  { count: 0, src: "/chick_0.png", label: "たまご" },
  { count: 1, src: "/chick_1.png", label: "パカっ" },
  { count: 2, src: "/chick_2.png", label: "よちよち" },
  { count: 3, src: "/chick_3.png", label: "ぴよぴよ" },
  { count: 4, src: "/chick_4.png", label: "ふわふわ" },
  { count: 5, src: "/chick_5.png", label: "空へ羽ばたく" },
];

export default function App() {
  const [formData, setFormData] = useState(() => {
    return JSON.parse(localStorage.getItem("formData")) || {};
  });
  const [completedSteps, setCompletedSteps] = useState(() => {
    return JSON.parse(localStorage.getItem("completedSteps")) || [];
  });

  const handleChange = (id, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [id]: value };
      localStorage.setItem("formData", JSON.stringify(updated));
      return updated;
    });

    if (value.trim() !== "") {
      setCompletedSteps((prev) => {
        const updated = prev.includes(id) ? prev : [...prev, id];
        localStorage.setItem("completedSteps", JSON.stringify(updated));
        return updated;
      });
    } else {
      setCompletedSteps((prev) => {
        const updated = prev.filter((stepId) => stepId !== id);
        localStorage.setItem("completedSteps", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const currentStamp =
    [...stampImages]
      .reverse()
      .find((s) => completedSteps.length >= s.count) || stampImages[0];

  return (
    <div className="app-container">
      <h1 className="title">🐣 ほめキャス</h1>

      <div className="stamp-label">{currentStamp.label}</div>
      <img src={currentStamp.src} alt="スタンプ" className="stamp-img" />
      <div className="progress-text">
        達成数: {completedSteps.length} / {steps.length}
      </div>

      {steps.map((step) => (
        <div key={step.id} className={`step ${completedSteps.includes(step.id) ? "done" : ""}`}>
          <label className="step-title">{step.title}</label>
          <div className="hint-text">💡 {step.hint}</div>
          <input
            type="text"
            value={formData[step.id] || ""}
            onChange={(e) => handleChange(step.id, e.target.value)}
            className="field-input"
            placeholder="ここに入力してね"
          />
          {completedSteps.includes(step.id) && (
            <div className="praise-text">✨できました！✨</div>
          )}
        </div>
      ))}
    </div>
  );
}
