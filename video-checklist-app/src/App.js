import React, { useState } from "react";
import steps from "./steps"; // default export に対応した読み込み

function App() {
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleChange = (stepId, value) => {
    setFormData((prev) => ({ ...prev, [stepId]: value }));

    // 入力が空じゃなければ達成リストに追加
    if (value.trim() !== "") {
      setCompletedSteps((prev) =>
        prev.includes(stepId) ? prev : [...prev, stepId]
      );
    } else {
      // 空に戻したら達成リストから除外
      setCompletedSteps((prev) => prev.filter((id) => id !== stepId));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>ほめキャス アプリ</h1>

      {steps.map((step) => (
        <div key={step.id} style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "bold" }}>{step.title}</label>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>{step.hint}</div>
          <input
            type="text"
            value={formData[step.id] || ""}
            onChange={(e) => handleChange(step.id, e.target.value)}
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
              ✅ できました！
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "2rem", fontWeight: "bold" }}>
        達成数: {completedSteps.length} / {steps.length}
      </div>
    </div>
  );
}

export default App;
