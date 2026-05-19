// Default categories with stable IDs — never change these IDs
export const DEFAULT_CATS = [
  { id: "food", label: "Food", color: "#34d399" },
  { id: "house", label: "House Exp.", color: "#818cf8" },
  { id: "utilities", label: "Utilities", color: "#fbbf24" },
  { id: "transport", label: "Transport", color: "#60a5fa" },
  { id: "health", label: "Health", color: "#f87171" },
  { id: "hygiene", label: "Hygiene", color: "#e879f9" },
  { id: "mobile", label: "Mobile", color: "#22d3ee" },
  { id: "rent", label: "Rent", color: "#fb923c" },
  { id: "education", label: "Education", color: "#a3e635" },
  { id: "family", label: "Family", color: "#f472b6" },
  { id: "entertainment", label: "Entertain.", color: "#a78bfa" },
  { id: "gifts", label: "Gifts", color: "#2dd4bf" },
  { id: "charity", label: "Charity", color: "#fb7185" },
  { id: "unexpected", label: "Unexpected", color: "#fdba74" },
  { id: "clothing", label: "Clothing", color: "#c084fc" },
];

export const DEFAULT_INCOME = [
  { id: "s1", label: "Salary 1" },
  { id: "e1", label: "Bonus / Extra 1" },
  { id: "s2", label: "Salary 2" },
  { id: "e2", label: "Bonus / Extra 2" },
  { id: "o1", label: "Other Income 1" },
  { id: "o2", label: "Other Income 2" },
];

export const CURRENCIES = [
  { code: "USD", symbol: "$",    locale: "en-US" },
  { code: "EUR", symbol: "€",    locale: "de-DE" },
  { code: "GBP", symbol: "£",    locale: "en-GB" },
  { code: "JPY", symbol: "¥",    locale: "ja-JP" },
  { code: "CNY", symbol: "¥",    locale: "zh-CN" },
  { code: "INR", symbol: "₹",    locale: "en-IN" },
  { code: "RUB", symbol: "₽",    locale: "ru-RU" },
  { code: "UZS", symbol: "soʻm", locale: "uz-Latn-UZ" },
  { code: "TRY", symbol: "₺",    locale: "tr-TR" },
  { code: "BRL", symbol: "R$",   locale: "pt-BR" },
  { code: "CAD", symbol: "C$",   locale: "en-CA" },
  { code: "AUD", symbol: "A$",   locale: "en-AU" },
  { code: "KRW", symbol: "₩",    locale: "ko-KR" },
  { code: "MXN", symbol: "Mex$", locale: "es-MX" },
  { code: "CHF", symbol: "CHF",  locale: "de-CH" },
  { code: "SGD", symbol: "S$",   locale: "en-SG" },
  { code: "AED", symbol: "د.إ",  locale: "ar-AE" },
];

export const COLOR_PALETTE = [
  "#34d399", "#818cf8", "#fbbf24", "#60a5fa", "#f87171",
  "#e879f9", "#22d3ee", "#fb923c", "#a3e635", "#f472b6",
  "#a78bfa", "#2dd4bf", "#fb7185", "#fdba74", "#c084fc",
  "#facc15", "#4ade80", "#38bdf8", "#fda4af", "#94a3b8",
];

export const THEMES = {
  dark: {
    BG: "#0d1117", SURF: "#161b22", SURF2: "#1c2128",
    BORDER: "#30363d", BORDER2: "#21262d",
    TEXT: "#e6edf3", MUTED: "#7d8590",
    GREEN: "#3fb950", RED: "#f85149", YELLOW: "#d29922",
    WKND: "#111722", EDIT: "#1a2a1a",
  },
  light: {
    BG: "#ffffff", SURF: "#f6f8fa", SURF2: "#eaeef2",
    BORDER: "#d0d7de", BORDER2: "#e1e4e8",
    TEXT: "#1f2328", MUTED: "#656d76",
    GREEN: "#1a7f37", RED: "#cf222e", YELLOW: "#9a6700",
    WKND: "#f0f3f6", EDIT: "#dafbe1",
  },
};

export const SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Utility helpers
export const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
