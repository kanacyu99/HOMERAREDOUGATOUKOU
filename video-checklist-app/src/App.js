import React, { useState, useEffect } from "react";
import "./App.css";
import steps from "./steps";                 // 13ステップ定義

/* ひよこスタンプ定義 */
const stamps = [
  { count: 0,  src: "/chick_0.png"  },
  { count: 1,  src: "/chick_3.png"  },
  { count: 4,  src: "/chick_7.png"  },
  { count: 8,  src: "/chick_10.png" },
  { count: 13, src: "/chick_13.png" }
];

const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* 👉 不正なデータでも必ず配列で返すヘルパー */
const readArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function App() {
  /* 入力フォーム */
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("form")) || {};
    } catch {
      return {};
    }
  });

  /* ✅ 達成ステップID配列（←ここを修正） */
  const [done, setDone] = useState(() => readArray("done"));

  /* プロジェクト保存 */
  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("projects")) || {}; }
    catch { return {}; }
  });

  const [praise, setPraise] = useState("");

  /* ─ 保存同期 ─ */
  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(form));
    localStorage.setItem("done", JSON.stringify(done));
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [form, done, projects]);

  /* ─ 入力変更 ─ */
  const handleChange = (id, value) => {
    const nextForm = { ...form, [id]: value };
    setForm(nextForm);

    /* 達成判定 */
    if (value.trim()) {
      if (!done.includes(id)) {
        const nextDone = [...done, id];
        setDone(nextDone);
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
    } else {
      setDone(prev => prev.filter(v => v !== id));
    }
  };

  /* ─ スタンプ画像 ─ */
  const achieved = done.length;
  const stampSrc = [...stamps].reverse().find(s => achieved >= s.count).src;

  /* ─ プロジェクト操作 ─ */
  const saveProject = () => {
    const name = prompt("プロジェクト名を入力してください");
    if (name) {
      setProjects(prev => ({ ...prev, [name]: { form, done } }));
      alert("保存しました！");
    }
  };

  const loadProject = (name) => {
    if (projects[name]) {
      setForm(projects[name].form);
      setDone(projects[name].done);
    }
  };

  const deleteProject = () => {
    const name = prompt("削除するプロジェクト名を入力してください");
    if (name && projects[name]) {
      const next = { ...projects };
      delete next[name];
      setProjects(next);
      alert("削除しました！");
    }
  };

  /* ─ UI ─ */
  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <img className="stamp-img" src={stampSrc} alt="スタンプ" />
      <div className="stamp-label">達成数: {achieved} / {steps.length}</div>

      {praise && <div className="praise">{praise}</div>}

      {/* プロジェクト操作 */}
      <div style={{ textAlign:"center", marginBottom:"1rem" }}>
        <button className="save-btn"   onClick={saveProject}>💾 保存</button>
        <button className="delete-btn" onClick={deleteProject}>🗑️ 削除</button>
        {Object.keys(projects).length > 0 && (
          <select onChange={e => loadProject(e.target.value)} defaultValue="">
            <option value="" disabled>▼ プロジェクト読込</option>
            {Object.keys(projects).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ステップ入力 */}
      {steps.map(step => (
        <div key={step.id} className={`step ${done.includes(step.id) ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={done.includes(step.id)}
              onChange={e =>
                setDone(prev =>
                  e.target.checked
                    ? [...prev, step.id]
                    : prev.filter(v => v !== step.id)
                )
              }
            />
            <h2 className="step-title">{step.title}</h2>
          </label>

          <div className="field">
            <div className="field-label">💡 {step.hint}</div>
            <input
              className="field-input"
              type="text"
              value={form[step.id] || ""}
              placeholder="ここに入力"
              onChange={e => handleChange(step.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
