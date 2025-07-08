// src/steps.js

const steps = [
  {
    title: "トーンを選ぶ",
    hint: "例：元気・真面目・誠実など",
    fields: [
      { label: "トーン", opts: ["元気", "真面目", "誠実", "熱血", "やさしい", "冷静"] }
    ]
  },
  {
    title: "構成メモを書く",
    hint: "はじめ・中身・しめ などをメモしておくと台本が書きやすいよ！",
    fields: [
      { label: "はじめ", opts: [] },
      { label: "中身", opts: [] },
      { label: "しめ", opts: [] }
    ]
  },
  {
    title: "台本を書く",
    hint: "話すように書いてOK！",
    fields: [
      { label: "台本", opts: [] }
    ]
  },
  {
    title: "動画タイトルを考える",
    hint: "5秒で伝わるタイトルをつけよう！",
    fields: [
      { label: "タイトル", opts: [] }
    ]
  },
  {
    title: "投稿予定日を決める",
    hint: "目標を決めると継続しやすくなるよ",
    fields: [
      { label: "予定日", opts: [] }
    ]
  },
  {
    title: "撮影場所を考える",
    hint: "背景や光も大事！",
    fields: [
      { label: "場所メモ", opts: [] }
    ]
  },
  {
    title: "撮影に使う小道具",
    hint: "説明しやすくなるかも！",
    fields: [
      { label: "小道具メモ", opts: [] }
    ]
  },
  {
    title: "撮影する曜日や時間",
    hint: "ルーティン化しよう",
    fields: [
      { label: "曜日/時間", opts: [] }
    ]
  },
  {
    title: "テンポやトーンの確認",
    hint: "自分のキャラを活かそう！",
    fields: [
      { label: "テンポ/トーン", opts: [] }
    ]
  },
  {
    title: "撮影リハーサル",
    hint: "何度か練習して自信をつけよう",
    fields: [
      { label: "リハ感想", opts: [] }
    ]
  },
  {
    title: "動画編集",
    hint: "カット・テロップ・BGM",
    fields: [
      { label: "編集メモ", opts: [] }
    ]
  },
  {
    title: "アップロード設定",
    hint: "公開範囲・説明文・ハッシュタグなど",
    fields: [
      { label: "アップ設定", opts: [] }
    ]
  },
  {
    title: "ふりかえり記録",
    hint: "どんな反応があった？次回どうする？",
    fields: [
      { label: "ふりかえり", opts: [] }
    ]
  }
];

export default steps;
