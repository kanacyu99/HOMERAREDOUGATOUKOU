import React, { useState, useEffect } from "react";
import "./App.css";
import steps from "./steps";           // ← export default なので {} なしで読み込む

/* ひよこスタンプ：達成数に応じて画像を切替え */
const stamps = [
  { count: 0, src: "/chick_0.png"  },   // 卵
  { count: 1, src: "/chick_3.png"  },   // ﾊﾟｶｯ
  { count: 4, src: "/chick_7.png"  },   // ﾋﾅ
  { count: 8, src: "/chick_10.png" },   // 成長
  { count: 13, src: "/chick_13.png" }   // 羽ばたき🌈
];

const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

export default function App() {
  const [form, setForm]           = useState(() => JSON.parse(localStorage.getItem("form") || "{}"));
  const [done, setDone]           = useState(() => JSON.parse(localStorage.getItem("done") || "[]"));
  const [praise, setPraise]       = useState("");
  const [projects, setProjects]   = useState(() => JSON.parse(localStorage.getItem("projects") || "{}"));

  /* ───────── 保存 ───────── */
  useEffect(() => {
    localStorage.setItem("form",     JSON.stringify(form));
    localStorage.setItem("done",     JSON.stringify(done));
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [form, done, projects]);

  /* ───────── 入力処理 ───────── */
  const handleChange = (id, value) => {
    setForm(prev => ({ ...prev, [id]: value }));

    // 値が入れば達成
    if (value.trim()) {
      if (!done.includes(id)) {
        const nextDone = [...done, id];
        setDone(nextDone);
        // 褒めメッセージ
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
    } else {
      setDone(prev => prev.filter(v => v !== id));
    }
  };

  /* ───────── スタンプ判定 ───────── */
  const achieved = done.length;
  const stampSrc = [...stamps].reverse().find(s => achieved >= s.count)?.src || stamps[0].src;

  /* ───────── プロジェクト保存 / 取得 / 削除 ───────── */
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

  /* ───────── UI ───────── */
  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <img className="stamp-img" src={stampSrc} alt="成長スタンプ" />
      <div className="stamp-label">達成数：{achieved} / {steps.length}</div>

      {praise && <div className="praise">{praise}</div>}

      {/* プロジェクト操作 */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={saveProject} className="save-btn">💾 保存</button>
        <button onClick={deleteProject} className="delete-btn">🗑️ 削除</button>
        {Object.keys(projects).length > 0 && (
          <select onChange={e => loadProject(e.target.value)} defaultValue="">
            <option value="" disabled>▼ プロジェクト読込</option>
            {Object.keys(projects).map(name => <option key={name}>{name}</option>)}
          </select>
        )}
      </div>

      {/* 13 ステップ入力 */}
      {steps.map(step => (
        <div key={step.id} className={`step ${done.includes(step.id) ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={done.includes(step.id)}
              onChange={e =>
                setDone(prev => e.target.checked
                  ? [...prev, step.id]
                  : prev.filter(v => v !== step.id))}
            />
            <h2 className="step-title">{step.title}</h2>
          </label>

          <div className="field">
            <div className="field-label">{step.hint}</div>
            <input
              type="text"
              className="field-input"
              value={form[step.id] || ""}
              placeholder="入力してください"
              onChange={e => handleChange(step.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
