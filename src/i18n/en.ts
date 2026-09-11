import type { Dictionary } from './types'

export const en: Dictionary = {
  common: {
    settings: 'Settings',
    close: 'Close',
    backToTop: 'Back to top',
    loading: 'Loading...',
    selectPlaceholder: 'Please select',
    removeImage: 'Remove this photo',
    storeImageFallbackAlt: 'Store photo',
    seatType: {
      table: 'Table',
      counter: 'Counter',
    },
  },

  top: {
    recommendTitle: 'Recommended for you',
    storeLinkButton: 'For restaurant owners',
  },

  search: {
    searching: 'Searching...',
    resultCount: (n: number) => `${n} results`,
    filterOpenButton: 'Filters',
    filterCloseButton: 'Close filters',
    noResults: 'No restaurants match your criteria.',
  },

  searchBar: {
    placeholder: 'Search for something',
    ariaLabel: 'Search restaurants',
    submit: 'Search',
  },

  aiSearchBox: {
    placeholder: 'e.g. Cheap ramen available right now',
    ariaLabel: 'Tell the AI what you are looking for',
    thinking: 'Thinking...',
    submit: 'AI Search',
    badge: 'AI',
  },

  filterPanel: {
    genresLabel: 'Genre',
    priceRangeLabel: 'Price range (max)',
    noPreference: 'No preference',
    priceUpTo: (price: number) => `Up to ¥${price.toLocaleString()}`,
    openNowLabel: 'Show only open restaurants',
  },

  storeCard: {
    waitUnit: ' min wait',
  },

  storeDetail: {
    waitEstimate: (n: number) => `Estimated wait: about ${n} min`,
    overview: 'Overview',
    descriptionFallback: 'Store details are coming soon.',
    share: 'Share',
    save: 'Save',
    featurePreparing: 'This feature is coming soon',
  },

  storeAuth: {
    title: 'For Restaurant Owners',
    loginTab: 'Log In',
    registerTab: 'Sign Up',
    email: 'Email address',
    password: 'Password',
    storeName: 'Restaurant name',
    loginSubmitting: 'Logging in...',
    loginSubmit: 'Log In',
    registerSubmitting: 'Signing up...',
    registerSubmit: 'Sign Up',
  },

  storeManage: {
    menuAria: 'Menu',
    enter: 'Check in',
    exit: 'Check out',
    seatStatus: 'Seat type',
    peopleCount: 'Party size',
    groupId: 'Group ID',
    groupIdRequired: 'Please enter a group ID',
    exitGroupRequired: 'Please select a group to check out',
  },

  storeSettings: {
    idGeneratingIncrement: 'Auto-number (increment)',
    idGeneratingManual: 'Manual entry',
    backAria: 'Back',
    title: 'Restaurant Settings',
    name: 'Restaurant name',
    description: 'Description',
    address: 'Address',
    phone: 'Phone number',
    websiteUrl: 'Website URL',
    price: 'Price',
    hours: 'Business hours',
    genresLabel: 'Genres (tags)',
    photos: 'Photos',
    tableAmount: 'Number of tables',
    counterAmount: 'Number of counter seats',
    idGeneratingLabel: 'Group ID method',
    idGeneratingSelectAria: 'Select the group ID method',
    savingSubmit: 'Saving...',
    saveSubmit: 'Save',
  },

  settingsDrawer: {
    language: 'Language',
    contact: 'Contact',
    terms: 'Terms of Service',
    preparing: 'Coming soon',
    version: 'Version',
    darkMode: 'Dark mode',
  },

  groupIdField: {
    placeholder: 'Group ID',
    ariaLabel: 'Group ID',
  },

  peopleCounter: {
    decreaseAria: 'Decrease party size',
    increaseAria: 'Increase party size',
    unit: (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`,
  },

  priceRangeField: {
    min: 'Min',
    max: 'Max',
  },

  activeGroupList: {
    empty: 'No groups are currently checked in.',
    placeholder: 'Please select a group',
    selectAria: 'Select a group to check out',
  },

  hamburgerMenu: {
    settings: 'Settings',
    logout: 'Log out',
  },

  imageManager: {
    addButton: '+',
    hint: (total: number, max: number) => `${total}/${max} photos (uploaded when you save)`,
  },

  storeAuthContext: {
    connectionFailedPrefix: (msg: string) => `Failed to connect to Supabase: ${msg}`,
    envHint:
      'Please check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in your .env file (see supabase/README.md).',
  },

  errors: {
    unknown: 'An unknown error occurred',
    aiSearchFailed: 'AI search failed',
    searchFailed: 'Search failed',
    enterFailed: 'Failed to check in',
    exitFailed: 'Failed to check out',
    saveFailed: 'Failed to save',
    supabaseConnectionFailed: 'Failed to connect to Supabase',
    anonymousSignInFailed: 'Anonymous sign-in failed',
    invalidCredentials: 'Incorrect email or password',
    storeAccountOnly: 'This action is only available to restaurant accounts',
    emailAlreadyRegistered: 'This email address is already registered',
    registrationFailed: 'Registration failed',
    confirmEmailSent:
      'A confirmation email has been sent. Please open the link in the email before logging in ' +
      '(during development, you can skip this by turning off Confirm email under ' +
      'Authentication > Sign In / Providers > Email in the Supabase dashboard).',
    duplicateGroupId: 'This group ID is already checked in. Please use a different group ID.',
    aiResponseParseFailed: "Failed to parse Claude's response",
    claudeRequestFailed: (message: string) =>
      `Failed to contact Claude: ${message} (is npm run claude-server running in another terminal?)`,
    claudeResponseInvalid: "Claude's response format was invalid",
    imageUploadFailed: (fileName: string, message: string) =>
      `Failed to upload image (${fileName}): ${message}`,
  },
}
