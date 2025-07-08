import React, { useState, useEffect } from "react";
import steps from "./steps";               // ← default export で読み込み
import "./App.css";                        // 任意。いま無くても動きます

/* ------------ 入力保存キー ------------ */
const LS_KEY = "homecast_formData_v1";

/* ------------ 達成数に応じたスタンプ画像 ------------ */
const getStampImage = (count) => {
  if (count >= 5) return "chick_13.png";   // ぜんぶ達成
  if (count >= 4) return "chick_10.png";
  if (count >= 3) return "chick_7.png";
  if (count >= 2) return "chick_3.png";
  return "chick_0.png";                    // 0〜1件
};

export default function App() {
  /* ❶ 保存データを初期値に読み込む */
  const [formData, setFormData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    } catch {
      return {};
    }
  });

  /* ❷ 入力済みステップ ID を計算 */
  const completedIds = steps
    .filter((s) => (formData[s.id] || "").trim() !== "")
    .map((s) => s.id);

  /* ❸ 入力変更ハンドラ */
  const handleChange = (id, value) => {
    const next = { ...formData, [id]: value };
    setFormData(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));  // 自動保存
  };

  /* ❹ 画面 ---------- */
  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>📣 ほめキャス</h1>

      {/* 🐣 スタンプ表示 */}
      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <img
          src={process.env.PUBLIC_URL + "/" + getStampImage(completedIds.length)}
          alt="進捗スタンプ"
          style={{ width: 140 }}
        />
        <div style={{ fontWeight: "bold", marginTop: 4 }}>
          達成 {completedIds.length} / {steps.length}
        </div>
      </div>

      {/* ステップ入力フォーム */}
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            border: "2px solid #eee",
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "1.2rem",
            background: completedIds.includes(step.id) ? "#eaffea" : "#fff",
            transition: "background 0.3s"
          }}
        >
          <label style={{ fontWeight: "bold" }}>{step.title}</label>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>{step.hint}</div>

          <input
            type="text"
            value={formData[step.id] || ""}
            placeholder={step.placeholder}
            onChange={(e) => handleChange(step.id, e.target.value)}
            style={{
              width: "100%",
              padding: "0.55rem",
              marginTop: "0.4rem",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
          />

          {completedIds.includes(step.id) && (
            <div style={{ color: "green", marginTop: "0.3rem" }}>✅ できました！</div>
          )}
        </div>
      ))}
    </div>
  );
}
