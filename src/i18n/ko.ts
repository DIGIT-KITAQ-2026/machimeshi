import type { Dictionary } from './types'

export const ko: Dictionary = {
  common: {
    settings: '설정',
    close: '닫기',
    backToTop: '홈으로 돌아가기',
    loading: '불러오는 중...',
    selectPlaceholder: '선택해 주세요',
    removeImage: '이 사진 삭제',
    storeImageFallbackAlt: '매장 사진',
    seatType: {
      table: '테이블',
      counter: '카운터',
    },
  },

  top: {
    recommendTitle: '맞춤 추천',
    storeLinkButton: '사장님은 여기로',
  },

  search: {
    searching: '검색 중...',
    resultCount: (n: number) => `검색 결과 (${n}건)`,
    filterOpenButton: '필터',
    filterCloseButton: '필터 닫기',
    noResults: '조건에 맞는 매장을 찾을 수 없습니다.',
  },

  searchBar: {
    placeholder: '검색어를 입력하세요',
    ariaLabel: '매장 검색',
    submit: '검색',
  },

  aiSearchBox: {
    placeholder: '예: 지금 바로 갈 수 있는 저렴한 라멘집',
    ariaLabel: 'AI에게 원하는 조건을 알려주세요',
    thinking: '생각 중...',
    submit: 'AI 검색',
    badge: 'AI',
  },

  filterPanel: {
    genresLabel: '장르',
    priceRangeLabel: '가격대 (상한)',
    noPreference: '지정 안 함',
    priceUpTo: (price: number) => `~￥${price.toLocaleString()}`,
    openNowLabel: '영업 중인 매장만 표시',
  },

  storeCard: {
    waitUnit: '분 대기',
  },

  storeDetail: {
    waitEstimate: (n: number) => `현재 예상 대기 시간: 약 ${n}분`,
    overview: '개요',
    descriptionFallback: '매장 정보를 준비 중입니다.',
    share: '공유',
    save: '저장',
    featurePreparing: '준비 중인 기능입니다',
  },

  storeAuth: {
    title: '사장님 전용',
    loginTab: '로그인',
    registerTab: '신규 등록',
    email: '이메일 주소',
    password: '비밀번호',
    storeName: '매장명',
    loginSubmitting: '로그인 중...',
    loginSubmit: '로그인',
    registerSubmitting: '등록 중...',
    registerSubmit: '신규 등록',
  },

  storeManage: {
    menuAria: '메뉴',
    enter: '입장',
    exit: '퇴장',
    seatStatus: '좌석 상태',
    peopleCount: '인원 수',
    groupId: '그룹 ID',
    groupIdRequired: '그룹 ID를 입력해 주세요',
    exitGroupRequired: '퇴장할 그룹을 선택해 주세요',
  },

  storeSettings: {
    idGeneratingIncrement: '자동 번호(증가)',
    idGeneratingManual: '수동 입력',
    backAria: '뒤로',
    title: '매장 설정',
    name: '매장명',
    description: '소개',
    address: '주소',
    phone: '전화번호',
    websiteUrl: '웹사이트 URL',
    price: '가격',
    hours: '영업시간',
    genresLabel: '장르(태그)',
    photos: '사진',
    tableAmount: '테이블 수',
    counterAmount: '카운터 좌석 수',
    idGeneratingLabel: 'ID 생성 방식',
    idGeneratingSelectAria: 'ID 생성 방식 선택',
    savingSubmit: '저장 중...',
    saveSubmit: '결정',
  },

  settingsDrawer: {
    language: '언어',
    contact: '문의처',
    terms: '이용약관',
    preparing: '준비 중',
    version: '버전',
    darkMode: '다크 모드',
  },

  groupIdField: {
    placeholder: '그룹 ID',
    ariaLabel: '그룹 ID',
  },

  peopleCounter: {
    decreaseAria: '인원 수 줄이기',
    increaseAria: '인원 수 늘리기',
    unit: (n: number) => `${n}명`,
  },

  priceRangeField: {
    min: '하한',
    max: '상한',
  },

  activeGroupList: {
    empty: '현재 입장 중인 그룹이 없습니다.',
    placeholder: '그룹을 선택해 주세요',
    selectAria: '퇴장할 그룹 선택',
  },

  hamburgerMenu: {
    settings: '설정',
    logout: '로그아웃',
  },

  imageManager: {
    addButton: '＋',
    hint: (total: number, max: number) => `${total}/${max}장 (저장을 누르면 업로드됩니다)`,
  },

  storeAuthContext: {
    connectionFailedPrefix: (msg: string) => `Supabase 연결에 실패했습니다: ${msg}`,
    envHint:
      '.env 파일의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 확인해 주세요(supabase/README.md 참고).',
  },

  errors: {
    unknown: '알 수 없는 오류가 발생했습니다',
    aiSearchFailed: 'AI 검색에 실패했습니다',
    searchFailed: '검색에 실패했습니다',
    enterFailed: '입장 처리에 실패했습니다',
    exitFailed: '퇴장 처리에 실패했습니다',
    saveFailed: '저장에 실패했습니다',
    supabaseConnectionFailed: 'Supabase 연결에 실패했습니다',
    anonymousSignInFailed: '익명 로그인에 실패했습니다',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
    storeAccountOnly: '이 작업은 매장 계정만 이용할 수 있습니다',
    emailAlreadyRegistered: '이미 등록된 이메일 주소입니다',
    registrationFailed: '등록에 실패했습니다',
    confirmEmailSent:
      '확인 메일을 보냈습니다. 메일 속 링크를 연 후 로그인해 주세요' +
      '(개발 중에는 Supabase 대시보드의 Authentication > Sign In / Providers > Email에서 ' +
      'Confirm email을 꺼두면 생략할 수 있습니다).',
    duplicateGroupId: '이 그룹 ID는 이미 입장 중입니다. 다른 그룹 ID를 지정해 주세요.',
    aiResponseParseFailed: 'Claude의 응답을 해석할 수 없습니다',
    claudeRequestFailed: (message: string) =>
      `Claude 요청에 실패했습니다: ${message} (다른 터미널에서 npm run claude-server를 실행 중인가요?)`,
    claudeResponseInvalid: 'Claude 응답 형식이 올바르지 않습니다',
    imageUploadFailed: (fileName: string, message: string) =>
      `이미지 업로드에 실패했습니다(${fileName}): ${message}`,
  },
}
