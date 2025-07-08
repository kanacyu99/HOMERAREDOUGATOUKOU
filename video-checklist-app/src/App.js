import React, { useState, useEffect } from "react";
import "./App.css";
import { steps } from "./steps";

const praises = ["よくできました！👏", "すごい！完璧！✨", "バッチリ！👍"];
const stampTable = [
  { count: 0, src: "/stamp_0.png" },
  { count: 3, src: "/stamp_3.png" },
  { count: 7, src: "/stamp_7.png" },
  { count: 10, src: "/stamp_10.png" },
  { count: 13, src: "/stamp_13.png" },
];

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("completed") || "[]"));
  const [praise, setPraise] = useState("");
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem("projects") || "{}"));

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [notes, completed, projects]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim() !== "");
      if (allFilled && !completed[sIdx]) {
        setCompleted((prevC) => {
          const up = [...prevC];
          up[sIdx] = true;
          return up;
        });
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2000);
      }
      return next;
    });
  };

  const achievedCount = completed.filter(Boolean).length;
  const currentStamp = [...stampTable].reverse().find((s) => achievedCount >= s.count)?.src || "/stamp_0.png";

  const saveProject = () => {
    const name = window.prompt("保存するプロジェクト名を入力してください");
    if (name) {
      const newProjects = { ...projects, [name]: { notes, completed } };
      setProjects(newProjects);
      alert("保存しました！");
    }
  };

  const loadProject = (name) => {
    if (projects[name]) {
      setNotes(projects[name].notes);
      setCompleted(projects[name].completed);
    }
  };

  const deleteProject = () => {
    const name = window.prompt("削除するプロジェクト名を正確に入力してください");
    if (name && projects[name]) {
      const newProjects = { ...projects };
      delete newProjects[name];
      setProjects(newProjects);
      alert("削除しました！");
    }
  };

  return (
    <div className="app-container">
      <h1>📣 ほめキャス ✨</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <p>がんばりスタンプ</p>
        <img src={currentStamp} alt="がんばりスタンプ" height={64} />
        <p>達成数: {achievedCount} / 13</p>
      </div>

      {praise && <div className="praise">{praise}</div>}

      <button onClick={saveProject}>💾 プロジェクト保存</button>

      {Object.keys(projects).length > 0 && (
        <>
          <select onChange={(e) => loadProject(e.target.value)} defaultValue="">
            <option value="" disabled>▼ 過去プロジェクトを選択</option>
            {Object.keys(projects).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={deleteProject}>🗑️ 削除</button>
        </>
      )}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`} style={{ backgroundColor: completed[sIdx] ? "#e6ffe6" : "#f9f9f9", margin: "1rem 0", padding: "1rem", borderRadius: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={completed[sIdx] || false}
              onChange={(e) => {
                const up = [...completed];
                up[sIdx] = e.target.checked;
                setCompleted(up);
              }}
            />
            <strong>{`${sIdx + 1}. ${step.title}`}</strong>
          </label>

          {step.fields.map((field, fIdx) => {
            const id = `field-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            return (
              <div key={id} style={{ marginTop: "0.5rem" }}>
                <label>{field.label}</label>
                {field.opts.length ? (
                  <>
                    <input
                      list={id}
                      value={value}
                      onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                      placeholder="選択または入力してください"
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <datalist id={id}>
                      {field.opts.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                    placeholder="入力してください"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
