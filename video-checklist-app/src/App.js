import React, { useState, useEffect } from "react";
import "./App.css";

/* ---------- ステップ定義 ---------- */
const steps = [
  {
    title: "テーマを決める",
    fields: [{ label: "目的・テーマ", hint: "💡 例：採用説明・仕事紹介 など" }]
  },
  {
    title: "動画のトーン & 構成メモ",
    fields: [
      {
        label: "動画のトーン",
        type: "select",
        opts: ["真面目", "ゆるい", "おもしろ系", "感動系"],
        hint: "💡 雰囲気を選ぶと構成メモが自動入力"
      },
      {
        label: "構成メモ",
        type: "text",
        hint: "💡 トーンに合わせた流れを考えてみよう"
      }
    ]
  },
  { title: "台本を書く", fields: [{ label: "セリフ案", hint: "💡 例：「こんにちは！◯◯です」" }] },
  { title: "撮影場所を決める", fields: [{ label: "ロケーション候補", hint: "💡 会議室・オフィス など" }] },
  { title: "撮影を行う", fields: [{ label: "撮影メモ", hint: "💡 深呼吸してリラックス♪" }] },
  { title: "編集する", fields: [{ label: "編集ポイント", hint: "💡 テロップ・BGMを追加" }] },
  { title: "投稿する", fields: [{ label: "プラットフォーム", hint: "💡 例：TikTok / YouTube" }] },
  { title: "振り返る", fields: [{ label: "良かった点・改善点", hint: "💡 コメントをメモ" }] }
];

/* トーン別構成メモテンプレ */
const toneTemplates = {
  真面目: "導入: 課題提示 → 本編: 論理的説明 → まとめ: 結論",
  ゆるい: "雑談で導入 → 会話調で内容紹介 → 締めもフランクに",
  おもしろ系: "冒頭にネタ → テンポよく展開 → オチで笑い",
  感動系: "体験談で共感 → クライマックスで感動 → 励ましの言葉"
};

/* ほめメッセージ & 成長スタンプ */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];
const getStamp = (c) => (c>=8?"chick_13.png":c>=6?"chick_10.png":c>=4?"chick_7.png":c>=2?"chick_3.png":"chick_0.png");

/* --- Appコンポーネント --- */
export default function App() {
  /* ステップ達成・入力メモ */
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem("done")||"[]"));
  const [notes,setNotes]= useState(() => JSON.parse(localStorage.getItem("notes")||"[]"));

  /* プロジェクト管理 */
  const [projectName,setProjectName]=useState("");
  const [projects,setProjects]=useState(() => JSON.parse(localStorage.getItem("projects")||"{}"));

  /* ほめコメント */
  const [praise,setPraise]=useState("");

  /* 保存同期 */
  useEffect(()=>{
    localStorage.setItem("done",JSON.stringify(done));
    localStorage.setItem("notes",JSON.stringify(notes));
    localStorage.setItem("projects",JSON.stringify(projects));
  },[done,notes,projects]);

  /* チェック切り替え */
  const toggleStep=(i)=>{
    const nd=[...done]; nd[i]=!nd[i]; setDone(nd);
    if(nd[i]){setPraise(praises[Math.floor(Math.random()*praises.length)]);setTimeout(()=>setPraise(""),2500);}
  };

  /* フィールド入力 */
  const onFieldChange=(s,f,val)=>{
    const n=[...notes]; if(!n[s]) n[s]=[]; n[s][f]=val;

    /* トーン→構成メモ自動 */
    if(steps[s].fields[f].label==="動画のトーン"){
      const memoIdx=1; // 同ステップ内の構成メモindex
      n[s][memoIdx]=toneTemplates[val]||"";
    }
    setNotes(n);
  };

  /* プロジェクト保存 */
  const saveProject=()=>{
    if(!projectName.trim()){alert("プロジェクト名を入力してください");return;}
    const newProjects={...projects,[projectName]:{done,notes}};
    setProjects(newProjects);
    setProjectName("");
    alert("プロジェクトを保存しました！");
  };

  /* プロジェクト読込 */
  const loadProject=(name)=>{
    const data=projects[name];
    if(!data){return;}
    setDone(data.done);
    setNotes(data.notes);
  };

  /* 完了数 */
  const achieved=done.filter(Boolean).length;

  /* ---- UI ---- */
  return(
    <div className="app-container">
      <h1 className="title">📣 ほめキャス</h1>

      {/* スタンプ */}
      <div className="stamp-display">
        <img src={process.env.PUBLIC_URL+"/"+getStamp(achieved)} alt="stamp" className="stamp-img"/>
        <div className="stamp-label">{achieved}/{steps.length}</div>
      </div>
      {praise && <div className="praise">{praise}</div>}

      {/* 🔖 プロジェクト保存/読込UI */}
      <div className="project-box">
        <input
          type="text"
          value={projectName}
          onChange={(e)=>setProjectName(e.target.value)}
          placeholder="プロジェクト名を入力"
          className="project-input"
        />
        <button onClick={saveProject} className="project-btn">保存</button>

        {Object.keys(projects).length>0 && (
          <>
            <select onChange={(e)=>loadProject(e.target.value)} defaultValue="">
              <option value="" disabled>▼ 過去プロジェクトを選択</option>
              {Object.keys(projects).map(name=>(
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* ステップ一覧 */}
      {steps.map((step,sIdx)=>(
        <div key={sIdx} className={`step ${done[sIdx]?"done":""}`}>
          <div className="step-header">
            <input type="checkbox" checked={done[sIdx]||false} onChange={()=>toggleStep(sIdx)}/>
            <h2 className="step-title">STEP {sIdx+1}: {step.title}</h2>
          </div>

          {step.fields.map((f,fIdx)=>(
            <div className="field" key={fIdx}>
              <label className="field-label">{f.label}</label>
              {f.type==="select"?(
                <select
                  className="field-input"
                  value={notes[sIdx]?.[fIdx]||""}
                  onChange={(e)=>onFieldChange(sIdx,fIdx,e.target.value)}
                >
                  <option value="">選択してください</option>
                  {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              ):(
                <input
                  className="field-input"
                  type="text"
                  value={notes[sIdx]?.[fIdx]||""}
                  onChange={(e)=>onFieldChange(sIdx,fIdx,e.target.value)}
                  placeholder={f.hint.replace("💡 ","")}
                />
              )}
              {!done[sIdx] && <div className="hint-bubble">{f.hint}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
