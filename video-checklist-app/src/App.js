import React, { useState, useEffect } from "react";
import "./App.css";

const steps = [
  {
    title: "目標設定・コンセプト決め",
    fields: [
      {
        label: "目的",
        key: "purpose",
        opts: ["認知度向上", "販売促進", "ブランディング", "採用活動", "社内教育"]
      },
      { label: "視聴者ターゲット", key: "audience", opts: [] },
      {
        label: "動画ジャンル",
        key: "genre",
        opts: ["解説", "Vlog", "広告", "レビュー", "ショート動画"]
      },
      {
        label: "成功の定義",
        key: "success",
        opts: ["再生数", "登録者数", "販売", "認知"]
      }
    ]
  },
  {
    title: "アイデア出し・企画",
    fields: [
      { label: "企画タイトル", key: "planTitle", opts: [] },
      {
        label: "動画のトーン",
        key: "tone",
        opts: ["真面目", "ゆるい", "おもしろ系", "感動系"]
      },
      { label: "構成メモ", key: "structureMemo", opts: [] }
    ]
  },
  {
    title: "台本・構成設計",
    fields: [
      { label: "大枠構成（導入・本編・まとめ）", key: "outline", opts: [] },
      { label: "詳細な台本", key: "script", opts: [] },
      { label: "セリフ・ナレーション原稿", key: "lines", opts: [] },
      { label: "ストーリーボード案", key: "storyboard", opts: [] },
      { label: "カット割り計画", key: "cuts", opts: [] },
      { label: "BGM/効果音イメージ", key: "sound", opts: [] }
    ]
  }
];

const toneTemplates = {
  真面目: `【導入】\n課題や目的を端的に提示\n\n【本編】\n事実・データに基づく説明\n\n【まとめ】\n得られるメリットと次のアクション`,
  ゆるい: `【導入】\nラフな自己紹介や挨拶\n\n【本編】\n雑談を交えつつ内容紹介\n\n【まとめ】\n視聴者への呼びかけ＋終わりの挨拶`,
  おもしろ系: `【導入】\n笑えるフックや小ネタ\n\n【本編】\nネタ → オチ でテンポ良く\n\n【まとめ】\nリアクション募集や次回予告`,
  感動系: `【導入】\n困難な状況の提示\n\n【本編】\n努力の過程やエピソード\n\n【まとめ】\n視聴者へのメッセージ & CTA`
};

const praises = [
  "すごい！完璧だね！✨",
  "Great job! 🎉",
  "バッチリ！👏",
  "もうプロレベル！💯",
  "感動したよ！🥹",
  "順調すぎる！🚀"
];

const getInitialRecords = () => {
  return JSON.parse(localStorage.getItem("records") || "[]");
};

export default function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "{}"));
  const [praise, setPraise] = useState("");
  const [records, setRecords] = useState(getInitialRecords);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const allCompleted = steps.every((step, sIdx) =>
      step.fields.every((_, fIdx) => (notes[sIdx]?.[fIdx] || "").trim())
    );
    if (allCompleted && praise === "") {
      const newPraise = "🌟 あなたの作品がまたひとつ完成しました！すばらしい！";
      setPraise(newPraise);
      setRecords((prev) => {
        const updated = [...prev, notes];
        localStorage.setItem("records", JSON.stringify(updated));
        return updated;
      });
      setNotes({});
      const timer = setTimeout(() => setPraise(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notes, praise]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      if (sIdx === 1 && steps[1].fields[fIdx].key === "tone") {
        const memoIdx = 2;
        if (!next[1]?.[memoIdx]) {
          const template = toneTemplates[val] || "";
          if (template) {
            next[1][memoIdx] = template;
          }
        }
      }
      return next;
    });
  };

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>
      <div className="record-visual">🎁{"🎁".repeat(records.length)} 完成した動画企画たち！</div>
      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className="step">
          <h2 className="step-title">✅ {step.title}</h2>
          {step.fields.map((field, fIdx) => {
            const id = `dl-${sIdx}-${fIdx}`;
            const value = notes[sIdx]?.[fIdx] || "";
            const filled = value.trim() !== "";
            return (
              <div className={`field ${filled ? "completed" : ""}`} key={fIdx}>
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

      <div className="records-list">
        <h3>📚 過去の企画記録</h3>
        {records.length === 0 ? (
          <p>まだ記録がありません。</p>
        ) : (
          records.map((record, idx) => (
            <details key={idx} className="record-item">
              <summary>🎬 記録 {idx + 1}</summary>
              {steps.map((step, sIdx) => (
                <div key={sIdx}>
                  <h4>{step.title}</h4>
                  <ul>
                    {step.fields.map((field, fIdx) => (
                      <li key={fIdx}>
                        <strong>{field.label}</strong>: {record[sIdx]?.[fIdx] || "（未記入）"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </details>
          ))
        )}
      </div>
    </div>
  );
}
