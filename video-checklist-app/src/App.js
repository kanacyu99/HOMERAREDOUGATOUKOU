import React, { useState, useEffect } from "react";
import steps from "./steps";          // ❶ ステップ定義（そのまま）

/* -- ❷ 保存用キー（好きな名前でOK） -- */
const STORAGE_KEY = "homecast_formData";

export default function App() {
  /* -- ❸ localStorage から初期値を読む -- */
  const [formData, setFormData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return saved;
    } catch {
      return {};
    }
  });

  /* -- ❹ 入力済み → 完了ステップを算出 -- */
  const calcCompleted = (data) =>
    steps
      .filter((s) => (data[s.id] || "").trim() !== "")
      .map((s) => s.id);

  const [completedSteps, setCompletedSteps] = useState(() =>
    calcCompleted(formData)
  );

  /* -- ❺ 入力変更ハンドラ -- */
  const handleChange = (stepId, value) => {
    // 新しい formData
    const nextData = { ...formData, [stepId]: value };
    setFormData(nextData);
    setCompletedSteps(calcCompleted(nextData));
  };

  /* -- ❻ formData を自動保存 -- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  /* -- ❼ 画面 ---------- */
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>ほめキャス&nbsp;アプリ</h1>

      {steps.map((step) => (
        <div key={step.id} style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "bold" }}>{step.title}</label>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>{step.hint}</div>

          <input
            type="text"
            value={formData[step.id] || ""}
            onChange={(e) => handleChange(step.id, e.target.value)}
            placeholder="ここに入力…"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.3rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />

          {completedSteps.includes(step.id) && (
            <div style={{ color: "green", marginTop: "0.2rem" }}>
              ✅&nbsp;できました！
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "2rem", fontWeight: "bold" }}>
        達成数:&nbsp;{completedSteps.length} / {steps.length}
      </div>
    </div>
  );
}
