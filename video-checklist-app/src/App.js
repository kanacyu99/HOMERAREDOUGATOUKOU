import React, { useState, useEffect } from "react";
import "./App.css";
import { steps } from "./steps";

const praises = ["すごい！✨", "よくできました！🎉", "ナイス！👍", "バッチリ！👏"];
const stampImages = [
  { count: 0, img: "/chick_0.png", label: "ひよこたまご" },
  { count: 1, img: "/chick_3.png", label: "ひよこぴよ" },
  { count: 3, img: "/chick_7.png", label: "ひよこリボンな" },
  { count: 6, img: "/chick_10.png", label: "ひよこ元気" },
  { count: 9, img: "/chick_13.png", label: "とり出発！" },
  { count: 13, img: "/homecast-icon.png", label: "ぜんぶ達成！🌈" }
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
      const allFilled = steps[sIdx].fields.every((_, i) => (next[sIdx]?.[i] || "").trim());
      if (allFilled && !completed[sIdx]) {
        setCompleted((prevC) => {
          const up = [...prevC];
          up[sIdx] = true;
          return up;
        });
        setPraise(praises[Math.floor(Math.random() * praises.length)]);
        setTimeout(() => setPraise(""), 2500);
      }
      return next;
    });
  };

  const achievedCount = completed.filter(Boolean).length;
  const currentStamp = [...stampImages].reverse().find((s) => achievedCount >= s.count);

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

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <div className="stamp-display">
        <p>がんばりスタンプ</p>
        {currentStamp && <img src={currentStamp.img} alt={currentStamp.label} className="stamp-img" />}
        <p>達成数: {achievedCount} / {steps.length}</p>
      </div>

      {praise && <div className="praise">{praise}</div>}

      <button className="save-btn" onClick={saveProject}>💾 プロジェクト保存</button>

      {Object.keys(projects).length > 0 && (
        <>
          <select onChange={(e) => loadProject(e.target.value)} defaultValue="">
            <option value="" disabled>▼ 過去プロジェクトを選択</option>
            {Object.keys(projects).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <button
            className="delete-btn"
            onClick={() => {
              const toDelete = window.prompt("削除するプロジェクト名を正確に入力してください");
              if (toDelete && projects[toDelete]) {
                const newProjects = { ...projects };
                delete newProjects[toDelete];
                setProjects(newProjects);
                alert("削除しました！");
              }
            }}
          >
            🗑️ 削除
          </button>
        </>
      )}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={completed[sIdx] || false}
              onChange={(e) => {
                const up = [...completed];
                up[sIdx] = e.target.checked;
                setCompleted(up);
              }}
            />
            <h2 className="step-title">{`${sIdx + 1}. ${step.title}`}</h2>
          </label>

          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            return (
              <div className="field" key={fIdx}>
                <label className="field-label">{field.label}</label>
                {field.opts.length ? (
                  <>
                    <input
                      list={id}
                      className="field-input"
                      value={value}
                      onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                      placeholder="選択または入力してください"
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
                    className="field-input"
                    value={value}
                    onChange={(e) => handleChange(sIdx, fIdx, e.target.value)}
                    placeholder="入力してください"
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
