const steps = [
  /* 0. 目標設定・コンセプト決め */
  {
    title: "目標設定・コンセプト決め",
    fields: [
      { label: "目的", key: "purpose", opts: ["認知度向上", "販売促進", "ブランディング", "採用活動", "社内教育"] },
      { label: "視聴者ターゲット", key: "audience", opts: [] },
      { label: "動画ジャンル", key: "genre", opts: ["解説", "Vlog", "広告", "レビュー", "ショート動画"] },
      { label: "成功の定義", key: "success", opts: ["再生数", "登録者数", "販売", "認知"] }
    ]
  },

  /* 1. アイデア出し・企画 */
  {
    title: "アイデア出し・企画",
    fields: [
      { label: "企画タイトル", key: "planTitle", opts: [] },
      { label: "動画のトーン", key: "tone", opts: ["真面目", "ゆるい", "おもしろ系", "感動系"] },
      { label: "構成メモ", key: "structureMemo", opts: [] }
    ]
  },

  /* 2. 台本・構成設計 */
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

  /* 3. 撮影計画・準備 */
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

  /* 4. 撮影 */
  {
    title: "撮影",
    fields: [
      { label: "セットアップメモ", key: "setup", opts: [] },
      { label: "テスト撮影メモ", key: "testShoot", opts: [] },
      { label: "本番撮影メモ", key: "mainShoot", opts: [] },
      { label: "バックアップ方法", key: "backup", opts: [] }
    ]
  },

  /* 5. 素材整理・管理 */
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

  /* 6. 編集（ポストプロダクション） */
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

  /* 7. レビュー・修正 */
  {
    title: "レビュー・修正",
    fields: [
      { label: "自己レビュー", key: "selfReview", opts: [] },
      { label: "フィードバック", key: "feedback", opts: [] },
      { label: "修正内容", key: "fixes", opts: [] }
    ]
  },

  /* 8. 書き出し（レンダリング） */
  {
    title: "書き出し（レンダリング）",
    fields: [
      { label: "解像度/フレーム設定", key: "exportSetting", opts: [] },
      { label: "書き出し形式", key: "codec", opts: [] },
      { label: "ファイルサイズ最適化", key: "fileSize", opts: [] }
    ]
  },

  /* 9. サムネイル・説明文作成 */
  {
    title: "サムネイル・説明文作成",
    fields: [
      { label: "サムネイル案", key: "thumbnail", opts: [] },
      { label: "SEOキーワード", key: "seo", opts: [] },
      { label: "説明文", key: "description", opts: [] },
      { label: "タグ設定", key: "tags", opts: [] }
    ]
  },

  /* 10. 公開準備 */
  {
    title: "公開準備",
    fields: [
      { label: "プラットフォーム選定", key: "platform", opts: ["YouTube", "TikTok", "Instagram", "Vimeo"] },
      { label: "公開スケジュール", key: "schedulePub", opts: [] },
      { label: "最終チェック", key: "finalCheck", opts: [] }
    ]
  },

  /* 11. 公開 */
  {
    title: "公開",
    fields: [
      { label: "アップロードURL", key: "url", opts: [] },
      { label: "告知方法", key: "announce", opts: ["SNS", "ブログ", "メール"] },
      { label: "SNS共有設定", key: "snsShare", opts: [] }
    ]
  },

  /* 12. 分析・改善／継続計画 */
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
