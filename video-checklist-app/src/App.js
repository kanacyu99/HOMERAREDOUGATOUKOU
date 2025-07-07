import React, { useState, useEffect } from "react";
import "./App.css";

/* ------------------------------
   0〜12：動画制作フロー全ステップ
--------------------------------*/
const steps = [
  {
    title: "目標設定・コンセプト決め",
    fields: [
      { label: "目的", key: "purpose", opts: ["認知度向上", "販売促進", "ブランディング", "採用活動", "社内教育"] },
      { label: "視聴者ターゲット", key: "audience", opts: [] },
      { label: "動画ジャンル", key: "genre", opts: ["解説", "Vlog", "広告", "レビュー", "ショート動画"] },
      { label: "成功の定義", key: "success", opts: ["再生数", "登録者数", "販売", "認知"] }
    ]
  },
  {
    title: "アイデア出し・企画",
    fields: [
      { label: "企画タイトル", key: "planTitle", opts: [] },
      { label: "動画のトーン", key: "tone", opts: ["真面目", "ゆるい", "おもしろ系", "感動系"] },
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
  },
  {
    title: "撮影計画・準備",
    fields: [
      { label: "撮影スケジュール", key: "schedule", opts: [] },
      { label: "ロケーション", key: "location", opts: [] },
      { label: "照明プラン", key: "lighting", opts: [] },
      { label: "カメラ設定メモ", key: "camera", opts: [] },
      { label: "小道具/衣装", key: "props", opts: [] }
    ]
  },
  {
    title: "撮影",
    fields: [
      { label: "セットアップメモ", key: "setup", opts: [] },
      { label: "テスト撮影メモ", key: "testShoot", opts: [] },
      { label: "本番撮影メモ", key: "mainShoot", opts: [] },
      { label: "バックアップ方法", key: "backup", opts: [] }
    ]
  },
  {
    title: "素材整理・管理",
    fields: [
      { label: "取り込み状況", key: "import", opts: [] },
      { label: "ファイル名ルール", key: "naming", opts: [] },
      { label: "バックアップ状況", key: "backupStatus", opts: [] },
      { label: "良いテイク選定", key: "bestTake", opts: [] },
      { label: "タグ付け", key: "tagging", opts: [] }
    ]
  },
  {
    title: "編集（ポストプロダクション）",
    fields: [
      { label: "カット編集方針", key: "cutPolicy", opts: [] },
      { label: "BGM/効果音", key: "bgm", opts: [] },
      { label: "字幕・テロップ", key: "caption", opts: [] },
      { label: "カラーグレーディング", key: "grading", opts: [] },
      { label: "仮書き出しチェック", key: "draftExport", opts: [] }
    ]
  },
  {
    title: "レビュー・修正",
    fields: [
      { label: "自己レビュー", key: "selfReview", opts: [] },
      { label: "フィードバック", key: "feedback", opts: [] },
      { label: "修正内容", key: "fixes", opts: [] }
    ]
  },
  {
    title: "書き出し（レンダリング）",
    fields: [
      { label: "解像度/フレーム設定", key: "exportSetting", opts: [] },
      { label: "書き出し形式", key: "codec", opts: [] },
      { label: "ファイルサイズ最適化", key: "fileSize", opts: [] }
    ]
  },
  {
    title: "サムネイル・説明文作成",
    fields: [
      { label: "サムネイル案", key: "thumbnail", opts: [] },
      { label: "SEOキーワード", key: "seo", opts: [] },
      { label: "説明文", key: "description", opts: [] },
      { label: "タグ設定", key: "tags", opts: [] }
    ]
  },
  {
    title: "公開準備",
    fields: [
      { label: "プラットフォーム選定", key: "platform", opts: ["YouTube", "TikTok", "Instagram", "Vimeo"] },
      { label: "公開スケジュール", key: "schedulePub", opts: [] },
      { label: "最終チェック", key: "finalCheck", opts: [] }
    ]
  },
  {
    title: "公開",
    fields: [
      { label: "アップロードURL", key: "url", opts: [] },
      { label: "告知方法", key: "announce", opts: ["SNS", "ブログ", "メール"] },
      { label: "SNS共有設定", key: "snsShare", opts: [] }
    ]
  },
  {
    title: "分析・改善／継続計画",
    fields: [
      { label: "視聴データ分析", key: "analytics", opts: [] },
      { label: "コメント感想メモ", key: "comments", opts: [] },
      { label: "次回改善点", key: "nextImprove", opts: [] },
      { label: "継続アイデア", key: "nextIdeas", opts: [] }
    ]
  }
];

/* 褒めコメント */
const praises = ["Great job! 🎉", "すごい！完璧！✨", "バッチリ！👏"];

/* スタンプ進化テーブル */
const stampTable = [
  { count: 0, icon: "🥚" },
  { count: 1, icon: "🐣" },
  { count: 3, icon: "🐥" },
  { count: 6, icon: "🕊️" },
  { count: 9, icon: "🕊️💫" },
  { count: 13, icon: "🌈🕊️✨" }
];

export default function App() {
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "{}")
  );
  const [completed, setCompleted] = useState(() =>
    JSON.parse(localStorage.getItem("completed") || "[]")
  );
  const [praise, setPraise] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [notes, completed]);

  const handleChange = (sIdx, fIdx, val) => {
    setNotes((prev) => {
      const next = { ...prev, [sIdx]: { ...(prev[sIdx] || {}), [fIdx]: val } };
      const allFilled = steps[sIdx].fields.every(
        (_, i) => (next[sIdx]?.[i] || "").trim()
      );
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
  const currentStamp =
    [...stampTable].reverse().find((s) => achievedCount >= s.count)?.icon || "🥚";

  return (
    <div className="app-container">
      <h1 className="title">📣 ほめキャス ✨</h1>

      <div className="stamp-display" title={`達成: ${achievedCount} / 13`}>
        {currentStamp} ({achievedCount}/13)
      </div>

      {praise && <div className="praise">{praise}</div>}

      {steps.map((step, sIdx) => (
        <div key={sIdx} className={`step ${completed[sIdx] ? "done" : ""}`}>
          <label className="step-header">
            <input
              type="checkbox"
              checked={completed[sIdx] || false}
              onChange={(e) =>
                setCompleted((prev) => {
                  const up = [...prev];
                  up[sIdx] = e.target.checked;
                  return up;
                })
              }
            />
            <h2 className="step-title">{`${sIdx}. ${step.title}`}</h2>
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
                      onChange={(e) =>
                        handleChange(sIdx, fIdx, e.target.value)
                      }
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
                    onChange={(e) =>
                      handleChange(sIdx, fIdx, e.target.value)
                    }
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
