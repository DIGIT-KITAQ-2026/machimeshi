// 日本語辞書。他言語（en.ts/ko.ts）はこのファイルからTypeScriptの型（Dictionary）を
// 導出するため、キーの追加・変更は必ずここから行うこと（キー漏れはビルド時にエラーになる）。

export const ja = {
  common: {
    settings: '設定',
    close: '閉じる',
    backToTop: 'トップへ戻る',
    loading: '読み込み中...',
    selectPlaceholder: '選択してください',
    removeImage: 'この画像を削除',
    storeImageFallbackAlt: '店舗画像',
    seatType: {
      table: 'テーブル',
      counter: 'カウンター',
    },
  },

  top: {
    recommendTitle: 'あなたへのおすすめ',
    storeLinkButton: '店舗の方はこちら',
  },

  search: {
    searching: '検索中...',
    resultCount: (n: number) => `検索結果（${n}件）`,
    filterOpenButton: 'フィルタ',
    filterCloseButton: 'フィルタを閉じる',
    noResults: '条件に一致する店舗が見つかりませんでした。',
  },

  searchBar: {
    placeholder: '何か検索する',
    ariaLabel: '店舗を検索',
    submit: '検索',
  },

  aiSearchBox: {
    placeholder: '例：今すぐ入れる安いラーメン屋',
    ariaLabel: 'AIに検索条件を伝える',
    thinking: '考え中...',
    submit: 'AIで検索',
    badge: 'AI',
  },

  filterPanel: {
    genresLabel: 'ジャンル',
    priceRangeLabel: '価格帯（上限）',
    noPreference: '指定なし',
    priceUpTo: (price: number) => `〜￥${price.toLocaleString()}`,
    openNowLabel: '営業中の店舗のみ表示',
  },

  storeCard: {
    waitUnit: '分待ち',
  },

  storeDetail: {
    waitEstimate: (n: number) => `現在の待ち時間の目安: 約${n}分`,
    overview: '概要',
    descriptionFallback: '店舗情報は準備中です。',
    share: '共有',
    save: '保存',
    featurePreparing: 'この機能は準備中です',
  },

  storeAuth: {
    title: '店舗の方へ',
    loginTab: 'ログイン',
    registerTab: '新規登録',
    email: 'メールアドレス',
    password: 'パスワード',
    storeName: '店名',
    loginSubmitting: 'ログイン中...',
    loginSubmit: 'ログイン',
    registerSubmitting: '登録中...',
    registerSubmit: '新規登録',
  },

  storeManage: {
    menuAria: 'メニュー',
    enter: '入店',
    exit: '退店',
    seatStatus: '席状況',
    peopleCount: '人数',
    groupId: 'グループID',
    groupIdRequired: 'グループIDを入力してください',
    exitGroupRequired: '退店するグループを選択してください',
  },

  storeSettings: {
    idGeneratingIncrement: '自動採番（インクリメント）',
    idGeneratingManual: '手動入力',
    backAria: '戻る',
    title: '店舗設定',
    name: '店名',
    description: '概要',
    address: '住所',
    phone: '電話番号',
    websiteUrl: 'ウェブサイトURL',
    price: '金額',
    hours: '営業時間',
    genresLabel: 'ジャンル（タグ）',
    photos: '写真',
    tableAmount: '卓の数',
    counterAmount: 'カウンターの数',
    idGeneratingLabel: 'IDの生成方法',
    idGeneratingSelectAria: 'IDの生成方法を選択',
    savingSubmit: '保存中...',
    saveSubmit: '決定',
  },

  settingsDrawer: {
    language: '言語',
    contact: '連絡先',
    terms: '利用規約',
    preparing: '準備中',
    version: 'バージョン',
    darkMode: 'ダークモード',
  },

  groupIdField: {
    placeholder: 'グループID',
    ariaLabel: 'グループID',
  },

  peopleCounter: {
    decreaseAria: '人数を減らす',
    increaseAria: '人数を増やす',
    unit: (n: number) => `${n}人`,
  },

  priceRangeField: {
    min: '下限',
    max: '上限',
  },

  activeGroupList: {
    empty: '現在入店中のグループはいません。',
    placeholder: 'グループIDを選択してください',
    selectAria: '退店するグループを選択',
  },

  hamburgerMenu: {
    settings: '設定',
    logout: 'ログアウト',
  },

  imageManager: {
    addButton: '＋',
    hint: (total: number, max: number) => `${total}/${max}枚（保存を押すとアップロードされます）`,
  },

  storeAuthContext: {
    connectionFailedPrefix: (msg: string) => `Supabaseへの接続に失敗しました: ${msg}`,
    envHint: '.env の VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を確認してください（supabase/README.md参照）。',
  },

  errors: {
    unknown: '不明なエラーが発生しました',
    aiSearchFailed: 'AI検索に失敗しました',
    searchFailed: '検索に失敗しました',
    enterFailed: '入店処理に失敗しました',
    exitFailed: '退店処理に失敗しました',
    saveFailed: '保存に失敗しました',
    supabaseConnectionFailed: 'Supabaseへの接続に失敗しました',
    anonymousSignInFailed: '匿名サインインに失敗しました',
    invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
    storeAccountOnly: 'この操作は店舗アカウントのみ利用できます',
    emailAlreadyRegistered: 'このメールアドレスは既に登録されています',
    registrationFailed: '登録に失敗しました',
    confirmEmailSent:
      '確認メールを送信しました。メール内のリンクを開いてからログインしてください' +
      '（開発中はSupabaseダッシュボードのAuthentication > Sign In / Providers > Emailで' +
      'Confirm emailをオフにすると省略できます）。',
    duplicateGroupId: 'このグループIDは既に入店中です。別のグループIDを指定してください。',
    aiResponseParseFailed: 'Claudeの応答を解析できませんでした',
    claudeRequestFailed: (message: string) =>
      `Claudeへの問い合わせに失敗しました: ${message}（別ターミナルで npm run claude-server を起動していますか？）`,
    claudeResponseInvalid: 'Claudeからの応答形式が不正です',
    imageUploadFailed: (fileName: string, message: string) =>
      `画像のアップロードに失敗しました（${fileName}）: ${message}`,
  },
}
