import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   ステップ定義（STEP0, STEP1）
--------------------------------*/
const steps = [
  // STEP0
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

  // STEP1
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
  }
];

/* トーンごとのテンプレート */
const toneTemplates = {
  真面目: `【導入】\n課題や目的を端的に提示\n\n【本編】\n事実・データに基づく説明\n\n【まとめ】\n得られるメリットと次のアクション`,
  ゆるい: `【導入】\nラフな自己紹介や挨拶\n\n【本編】\n雑談を交えつつ内容紹介\n\n【まとめ】\n視聴者への呼びかけ＋終わりの挨拶`,
  おもしろ系: `【導入】\n笑えるフックや小ネタ\n\n【本編】\nネタ → オチ でテンポ良く\n\n【まとめ】\nリアクション募集や次回予告`,
  感動系: `【導入】\n困難な状況の提示\n\n【本編】\n努力の過程やエピソード\n\n【まとめ】\n視聴者へのメッセージ & CTA`
};

const praises = ["すごい！完璧だね！✨", "Great job! 🎉", "バッチリ！👏"];

export default function App() {
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "{}")
  );
  const [praise, setPraise] = useState("");

  /* localStorage 保存 */
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  /* STEP0 完了で褒める */
  useEffect(() => {
    const firstStep = steps[0];
    const filled = firstStep.fields.every((_, idx) =>
      (notes[0]?.[idx] || "").trim()
    );
    if (filled && praise === "") {
      setPraise(praises[Math.floor(Math.random() * praises.length)]);
      const timer = setTimeout(() => setPraise(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notes, praise]);

  /* 入力ハンドラ */
  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };

      // STEP1 の tone 選択で構成メモを自動補完
      if (sIdx === 1 && steps[1].fields[fIdx].key === "tone") {
        const memoIdx = 2; // structureMemo は3番目
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
      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className="step">
          <h2 className="step-title">{step.title}</h2>
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
