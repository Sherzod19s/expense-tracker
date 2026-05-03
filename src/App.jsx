import { useState, useEffect, useRef } from "react";

// ─────────────────────────  DEFAULTS  ─────────────────────────
const DEFAULT_CATS = [
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

const DEFAULT_INCOME = [
  { id: "s1", label: "Salary 1" },
  { id: "e1", label: "Bonus / Extra 1" },
  { id: "s2", label: "Salary 2" },
  { id: "e2", label: "Bonus / Extra 2" },
  { id: "o1", label: "Other Income 1" },
  { id: "o2", label: "Other Income 2" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$",   locale: "en-US" },
  { code: "EUR", symbol: "€",   locale: "de-DE" },
  { code: "GBP", symbol: "£",   locale: "en-GB" },
  { code: "JPY", symbol: "¥",   locale: "ja-JP" },
  { code: "CNY", symbol: "¥",   locale: "zh-CN" },
  { code: "INR", symbol: "₹",   locale: "en-IN" },
  { code: "RUB", symbol: "₽",   locale: "ru-RU" },
  { code: "UZS", symbol: "soʻm",locale: "uz-Latn-UZ" },
  { code: "TRY", symbol: "₺",   locale: "tr-TR" },
  { code: "BRL", symbol: "R$",  locale: "pt-BR" },
  { code: "CAD", symbol: "C$",  locale: "en-CA" },
  { code: "AUD", symbol: "A$",  locale: "en-AU" },
  { code: "KRW", symbol: "₩",   locale: "ko-KR" },
  { code: "MXN", symbol: "Mex$",locale: "es-MX" },
  { code: "CHF", symbol: "CHF", locale: "de-CH" },
  { code: "SGD", symbol: "S$",  locale: "en-SG" },
  { code: "AED", symbol: "د.إ", locale: "ar-AE" },
];

const COLOR_PALETTE = [
  "#34d399", "#818cf8", "#fbbf24", "#60a5fa", "#f87171",
  "#e879f9", "#22d3ee", "#fb923c", "#a3e635", "#f472b6",
  "#a78bfa", "#2dd4bf", "#fb7185", "#fdba74", "#c084fc",
  "#facc15", "#4ade80", "#38bdf8", "#fda4af", "#94a3b8",
];

const THEMES = {
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

const SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─────────────────────────  TRANSLATIONS  ─────────────────────────
const STRINGS = {
  en: {
    appName: "Expense Tracker",
    today: "TODAY",
    spent: "SPENT",
    net: "NET",
    dailyLog: "Daily Log",
    summary: "Summary",
    budgetIncome: "Budget & Income",
    settings: "Settings",
    date: "DATE",
    total: "TOTAL",
    budget: "BUDGET",
    remaining: "REMAINING",
    totalIncome: "Total Income",
    totalSpent: "Total Spent",
    netRemaining: "Net Remaining",
    budgetLeft: "Budget Left",
    unbudgeted: "Unbudgeted",
    budgetUsage: "BUDGET USAGE",
    breakdown: "BREAKDOWN BY CATEGORY",
    ofBudget: "of budget",
    noExpenses: "No expenses logged yet for",
    income: "INCOME",
    budgets: "BUDGETS",
    totalBudget: "TOTAL BUDGET",
    noCategories: "No categories. Add some in Settings.",
    noIncomeSources: "No income sources. Add some in Settings.",
    noCategoriesShort: "No categories. Click + Add.",
    noIncomeShort: "No income sources. Click + Add.",
    preferences: "PREFERENCES",
    currency: "CURRENCY",
    theme: "THEME",
    language: "LANGUAGE",
    dark: "Dark",
    light: "Light",
    categories: "CATEGORIES",
    incomeSources: "INCOME SOURCES",
    add: "+ Add",
    moveUp: "Move up",
    moveDown: "Move down",
    delete: "Delete",
    pickColor: "Pick color",
    dataBackup: "DATA & BACKUP",
    exportMonth: "Export",
    exportAll: "Export all data",
    csv: "CSV",
    backupHint: "Data is stored locally in your browser (localStorage). Clearing site data will erase your records — download a CSV backup periodically. CSVs open in Excel, Google Sheets, or any spreadsheet app.",
    clickToEdit: "Click to add/edit",
    confirmDeleteCat: (name) => `Delete "${name}"? Entries logged under this category in the current month will also be removed.`,
    confirmDeleteInc: (name) => `Delete "${name}"?`,
    noDataExport: "No data to export yet.",
    newCategory: "New Category",
    newSource: "New Source",
    prevYear: "Previous year",
    nextYear: "Next year",
    toggleTheme: "Toggle theme",
    introTitle: "👋 Welcome",
    introBody: "Set your currency and customize categories in Settings, then tap any cell below to log your first expense.",
    introCta: "Got it",
    introOpenSettings: "Open Settings",
    pickDay: "Pick a day",
    addExpense: "+ Add expense",
    cancel: "Cancel",
    save: "Save",
    dayTotal: "Day total",
    // Default category labels (only used if user hasn't customized)
    defaultCats: {
      food: "Food", house: "House Exp.", utilities: "Utilities", transport: "Transport",
      health: "Health", hygiene: "Hygiene", mobile: "Mobile", rent: "Rent",
      education: "Education", family: "Family", entertainment: "Entertain.",
      gifts: "Gifts", charity: "Charity", unexpected: "Unexpected", clothing: "Clothing",
    },
    defaultIncome: {
      s1: "Salary 1", e1: "Bonus / Extra 1", s2: "Salary 2",
      e2: "Bonus / Extra 2", o1: "Other Income 1", o2: "Other Income 2",
    },
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthsShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    locale: "en-US",
  },
  ru: {
    appName: "Учёт расходов",
    today: "СЕГОДНЯ",
    spent: "ПОТРАЧЕНО",
    net: "ОСТАТОК",
    dailyLog: "Дневник",
    summary: "Сводка",
    budgetIncome: "Бюджет и доход",
    settings: "Настройки",
    date: "ДАТА",
    total: "ИТОГО",
    budget: "БЮДЖЕТ",
    remaining: "ОСТАТОК",
    totalIncome: "Общий доход",
    totalSpent: "Всего потрачено",
    netRemaining: "Чистый остаток",
    budgetLeft: "Остаток бюджета",
    unbudgeted: "Без бюджета",
    budgetUsage: "ИСПОЛЬЗОВАНИЕ БЮДЖЕТА",
    breakdown: "ПО КАТЕГОРИЯМ",
    ofBudget: "от бюджета",
    noExpenses: "Расходов пока нет:",
    income: "ДОХОД",
    budgets: "БЮДЖЕТЫ",
    totalBudget: "ОБЩИЙ БЮДЖЕТ",
    noCategories: "Нет категорий. Добавьте в Настройках.",
    noIncomeSources: "Нет источников дохода. Добавьте в Настройках.",
    noCategoriesShort: "Нет категорий. Нажмите + Добавить.",
    noIncomeShort: "Нет источников дохода. Нажмите + Добавить.",
    preferences: "НАСТРОЙКИ",
    currency: "ВАЛЮТА",
    theme: "ТЕМА",
    language: "ЯЗЫК",
    dark: "Тёмная",
    light: "Светлая",
    categories: "КАТЕГОРИИ",
    incomeSources: "ИСТОЧНИКИ ДОХОДА",
    add: "+ Добавить",
    moveUp: "Вверх",
    moveDown: "Вниз",
    delete: "Удалить",
    pickColor: "Выбрать цвет",
    dataBackup: "ДАННЫЕ И БЭКАП",
    exportMonth: "Экспорт",
    exportAll: "Экспорт всех данных",
    csv: "CSV",
    backupHint: "Данные хранятся локально в браузере (localStorage). Очистка данных сайта удалит записи — периодически скачивайте CSV-бэкап. CSV открывается в Excel, Google Sheets или любом табличном редакторе.",
    clickToEdit: "Нажмите для редактирования",
    confirmDeleteCat: (name) => `Удалить «${name}»? Записи в этой категории за текущий месяц также будут удалены.`,
    confirmDeleteInc: (name) => `Удалить «${name}»?`,
    noDataExport: "Пока нет данных для экспорта.",
    newCategory: "Новая категория",
    newSource: "Новый источник",
    prevYear: "Предыдущий год",
    nextYear: "Следующий год",
    toggleTheme: "Сменить тему",
    introTitle: "👋 Добро пожаловать",
    introBody: "Выберите валюту и настройте категории в Настройках, затем нажмите на любую ячейку ниже, чтобы записать первый расход.",
    introCta: "Понятно",
    introOpenSettings: "Открыть настройки",
    pickDay: "Выберите день",
    addExpense: "+ Добавить расход",
    cancel: "Отмена",
    save: "Сохранить",
    dayTotal: "Итого за день",
    defaultCats: {
      food: "Еда", house: "Дом", utilities: "Коммунал.", transport: "Транспорт",
      health: "Здоровье", hygiene: "Гигиена", mobile: "Связь", rent: "Аренда",
      education: "Учёба", family: "Семья", entertainment: "Развлеч.",
      gifts: "Подарки", charity: "Благотв.", unexpected: "Непредвид.", clothing: "Одежда",
    },
    defaultIncome: {
      s1: "Зарплата 1", e1: "Бонус / Доп. 1", s2: "Зарплата 2",
      e2: "Бонус / Доп. 2", o1: "Другой доход 1", o2: "Другой доход 2",
    },
    months: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
    monthsShort: ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],
    locale: "ru-RU",
  },
};

// ─────────────────────────  HELPERS  ─────────────────────────
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ─────────────────────────  STORAGE  ─────────────────────────
const CFG_KEY = "xpns_config_v1";
const monthKey = (y, m) => `xpns_${y}_${m}`;

const defaultConfig = (lang = "en") => ({
  theme: "dark",
  lang,
  currency: CURRENCIES[0],
  categories: DEFAULT_CATS.map(c => ({ ...c, label: STRINGS[lang].defaultCats[c.id] || c.label })),
  incomeSources: DEFAULT_INCOME.map(s => ({ ...s, label: STRINGS[lang].defaultIncome[s.id] || s.label })),
  hasSeenIntro: false,
});

const detectLang = () => {
  try {
    const nav = navigator.language || "en";
    return nav.toLowerCase().startsWith("ru") ? "ru" : "en";
  } catch { return "en"; }
};

const loadConfig = () => {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        theme: p.theme === "light" ? "light" : "dark",
        lang: p.lang === "ru" ? "ru" : "en",
        currency: p.currency || CURRENCIES[0],
        categories: Array.isArray(p.categories) ? p.categories : DEFAULT_CATS,
        incomeSources: Array.isArray(p.incomeSources) ? p.incomeSources : DEFAULT_INCOME,
        hasSeenIntro: !!p.hasSeenIntro,
      };
    }
  } catch {}
  return defaultConfig(detectLang());
};

const saveConfig = (cfg) => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch {} };

const loadMonth = (y, m) => {
  try {
    const raw = localStorage.getItem(monthKey(y, m));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { days: {}, budgets: {}, income: {} };
};

const saveMonthData = (y, m, data) => {
  try { localStorage.setItem(monthKey(y, m), JSON.stringify(data)); } catch {}
};

// ─────────────────────────  CSV EXPORT  ─────────────────────────
const csvCell = (v) => {
  if (v == null || v === "") return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCSV = (rows) => rows.map(r => r.map(csvCell).join(",")).join("\n");

const downloadCSV = (filename, csv) => {
  // BOM so Excel reads UTF-8 correctly (€, ₽, ¥ etc. show properly)
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─────────────────────────  APP  ─────────────────────────
export default function App() {
  const now = new Date();
  const [config, setConfig] = useState(loadConfig);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState("log");
  const [md, setMd] = useState(() => loadMonth(now.getFullYear(), now.getMonth()));
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [mobileDay, setMobileDay] = useState(now.getDate());
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const T = THEMES[config.theme];
  const t = STRINGS[config.lang] || STRINGS.en;
  const CATS = config.categories;
  const INCS = config.incomeSources;
  const CUR = config.currency;

  const fmt  = (n) => n && n !== 0 ? n.toLocaleString(CUR.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
  const fmtT = (n) => n.toLocaleString(CUR.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtC = (n) => `${CUR.symbol} ${fmtT(n)}`;

  useEffect(() => {
    setMd(loadMonth(year, month));
    setEditCell(null);
  }, [year, month]);

  const updateConfig = (cfg) => { setConfig(cfg); saveConfig(cfg); };
  const save = (d) => { setMd(d); saveMonthData(year, month, d); };

  const setDay = (day, key, raw) => {
    const v = parseFloat(raw);
    const nd = { ...md.days, [day]: { ...(md.days[day] || {}) } };
    if (!raw || isNaN(v)) delete nd[day][key];
    else nd[day][key] = v;
    save({ ...md, days: nd });
  };

  const nd = daysInMonth(year, month);

  const catTotals = Object.fromEntries(
    CATS.map(c => [c.id, Array.from({ length: nd }, (_, i) => md.days[i + 1]?.[c.id] || 0).reduce((a, b) => a + b, 0)])
  );
  const dayTotals = Object.fromEntries(
    Array.from({ length: nd }, (_, i) => i + 1).map(d => [d, CATS.reduce((s, c) => s + (md.days[d]?.[c.id] || 0), 0)])
  );
  const totalSpent = CATS.reduce((s, c) => s + catTotals[c.id], 0);
  const totalBudget = CATS.reduce((s, c) => s + (md.budgets[c.id] || 0), 0);
  const totalIncome = INCS.reduce((s, src) => s + (md.income[src.id] || 0), 0);

  const startEdit = (day, key) => {
    const cur = md.days[day]?.[key];
    setEditCell({ day, key });
    setEditVal(cur ? cur.toString() : "");
    setTimeout(() => inputRef.current?.select(), 20);
  };
  const commitEdit = () => {
    if (editCell) setDay(editCell.day, editCell.key, editVal);
    setEditCell(null);
  };

  const net = totalIncome - totalSpent;
  const netColor = totalIncome === 0 ? T.MUTED : net >= 0 ? T.GREEN : T.RED;

  // ── Category management ──
  const addCategory = () => {
    const id = newId();
    const color = COLOR_PALETTE[CATS.length % COLOR_PALETTE.length];
    updateConfig({ ...config, categories: [...CATS, { id, label: t.newCategory, color }] });
  };
  const updateCategory = (id, patch) =>
    updateConfig({ ...config, categories: CATS.map(c => c.id === id ? { ...c, ...patch } : c) });
  const deleteCategory = (id) => {
    const cat = CATS.find(c => c.id === id);
    if (!window.confirm(t.confirmDeleteCat(cat.label))) return;
    updateConfig({ ...config, categories: CATS.filter(c => c.id !== id) });
    const newDays = { ...md.days };
    Object.keys(newDays).forEach(d => {
      if (newDays[d][id] != null) {
        newDays[d] = { ...newDays[d] };
        delete newDays[d][id];
      }
    });
    const newBudgets = { ...md.budgets };
    delete newBudgets[id];
    save({ ...md, days: newDays, budgets: newBudgets });
  };
  const moveCategory = (id, dir) => {
    const i = CATS.findIndex(c => c.id === id);
    const j = i + dir;
    if (j < 0 || j >= CATS.length) return;
    const arr = [...CATS];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    updateConfig({ ...config, categories: arr });
  };

  // ── Income source management ──
  const addIncome = () =>
    updateConfig({ ...config, incomeSources: [...INCS, { id: newId(), label: t.newSource }] });
  const updateIncomeSource = (id, patch) =>
    updateConfig({ ...config, incomeSources: INCS.map(s => s.id === id ? { ...s, ...patch } : s) });
  const deleteIncome = (id) => {
    const src = INCS.find(s => s.id === id);
    if (!window.confirm(t.confirmDeleteInc(src.label))) return;
    updateConfig({ ...config, incomeSources: INCS.filter(s => s.id !== id) });
    const newIncome = { ...md.income };
    delete newIncome[id];
    save({ ...md, income: newIncome });
  };
  const moveIncome = (id, dir) => {
    const i = INCS.findIndex(s => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= INCS.length) return;
    const arr = [...INCS];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    updateConfig({ ...config, incomeSources: arr });
  };

  // ── CSV exports ──
  const exportCurrentMonth = () => {
    const headers = ["Date", "Day", ...CATS.map(c => c.label), "Total"];
    const rows = [headers];

    for (let day = 1; day <= nd; day++) {
      const dt = new Date(year, month, day);
      const dow = dt.toLocaleDateString("en", { weekday: "short" });
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const cats = CATS.map(c => md.days[day]?.[c.id] ?? "");
      const total = dayTotals[day] || "";
      rows.push([date, dow, ...cats, total]);
    }

    rows.push([]);
    rows.push(["SPENT", "", ...CATS.map(c => catTotals[c.id] || ""), totalSpent || ""]);
    rows.push(["BUDGET", "", ...CATS.map(c => md.budgets[c.id] || ""), totalBudget || ""]);
    rows.push(["REMAINING", "", ...CATS.map(c => {
      const b = md.budgets[c.id] || 0;
      return b > 0 ? b - (catTotals[c.id] || 0) : "";
    }), totalBudget > 0 ? totalBudget - totalSpent : ""]);

    rows.push([]);
    rows.push(["INCOME"]);
    rows.push(["Source", "Amount"]);
    INCS.forEach(s => rows.push([s.label, md.income[s.id] || ""]));
    rows.push(["TOTAL INCOME", totalIncome || ""]);

    rows.push([]);
    rows.push(["Currency", CUR.code]);

    const filename = `expense-tracker-${year}-${String(month + 1).padStart(2, "0")}.csv`;
    downloadCSV(filename, toCSV(rows));
  };

  const exportAllData = () => {
    const headers = ["Type", "Year", "Month", "Day", "ItemId", "Label", "Amount", "Currency"];
    const rows = [headers];

    const catById = Object.fromEntries(CATS.map(c => [c.id, c.label]));
    const incById = Object.fromEntries(INCS.map(s => [s.id, s.label]));

    const months = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const m = key?.match(/^xpns_(\d{4})_(\d+)$/);
      if (m) months.push({ key, year: parseInt(m[1]), month: parseInt(m[2]) });
    }
    months.sort((a, b) => a.year - b.year || a.month - b.month);

    months.forEach(({ key, year: y, month: m }) => {
      let data;
      try { data = JSON.parse(localStorage.getItem(key)); } catch { return; }
      if (!data) return;

      const sortedDays = Object.entries(data.days || {}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      sortedDays.forEach(([day, entries]) => {
        Object.entries(entries).forEach(([catId, amount]) => {
          rows.push(["expense", y, m + 1, parseInt(day), catId, catById[catId] || "(deleted)", amount, CUR.code]);
        });
      });

      Object.entries(data.budgets || {}).forEach(([catId, amount]) => {
        rows.push(["budget", y, m + 1, "", catId, catById[catId] || "(deleted)", amount, CUR.code]);
      });

      Object.entries(data.income || {}).forEach(([incId, amount]) => {
        rows.push(["income", y, m + 1, "", incId, incById[incId] || "(deleted)", amount, CUR.code]);
      });
    });

    if (rows.length === 1) {
      window.alert(t.noDataExport);
      return;
    }

    downloadCSV("expense-tracker-all.csv", toCSV(rows));
  };

  // ── Shared style snippets ──
  const inputStyle = {
    width: "100%", background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
    color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
  };
  const smallBtn = {
    background: "transparent", border: `1px solid ${T.BORDER2}`, color: T.MUTED,
    padding: "0 8px", height: 26, borderRadius: 4, cursor: "pointer",
    fontFamily: "inherit", fontSize: 13, outline: "none",
  };
  const dangerBtn = { ...smallBtn, color: T.RED };

  return (
    <div style={{ fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace", background: T.BG, color: T.TEXT, minHeight: "100vh" }}>

      {/* ══════ HEADER ══════ */}
      <div style={{ background: T.SURF, borderBottom: `1px solid ${T.BORDER}` }}>
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700, color: T.TEXT, letterSpacing: -0.5 }}>
                <span style={{ color: T.GREEN }}>{CUR.symbol}</span> {t.appName}
              </div>
              <div style={{ fontSize: 12, color: T.MUTED, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setYear(year - 1)} style={{ ...smallBtn, height: 22, padding: "0 6px" }} title={t.prevYear}>‹</button>
                <span style={{ minWidth: 130, display: "inline-block", textAlign: "center" }}>{t.months[month]} {year}</span>
                <button onClick={() => setYear(year + 1)} style={{ ...smallBtn, height: 22, padding: "0 6px" }} title={t.nextYear}>›</button>
                <button
                  onClick={() => { const d = new Date(); setYear(d.getFullYear()); setMonth(d.getMonth()); }}
                  style={{ ...smallBtn, height: 22, padding: "0 8px", fontSize: 10, letterSpacing: 1, marginLeft: 4 }}
                >{t.today}</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button
                onClick={() => updateConfig({ ...config, theme: config.theme === "dark" ? "light" : "dark" })}
                style={{ ...smallBtn, height: 32, fontSize: 16, padding: "0 12px" }}
                title={t.toggleTheme}
              >{config.theme === "dark" ? "☀" : "☾"}</button>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 2 }}>{totalIncome > 0 ? t.net : t.spent}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: netColor }}>
                  {totalIncome > 0 ? (net >= 0 ? "+" : "") + fmtC(net) : fmtC(totalSpent)}
                </div>
              </div>
            </div>
          </div>

          {/* Month tabs */}
          <div style={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {t.monthsShort.map((m, i) => (
              <button key={i} onClick={() => { setMonth(i); setEditCell(null); }} style={{
                padding: "6px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                background: month === i ? T.BG : "transparent",
                color: month === i ? T.GREEN : T.MUTED,
                border: `1px solid ${month === i ? T.BORDER : "transparent"}`,
                borderBottom: month === i ? `1px solid ${T.BG}` : "1px solid transparent",
                borderRadius: "4px 4px 0 0", whiteSpace: "nowrap",
                fontWeight: month === i ? 600 : 400, outline: "none"
              }}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ VIEW TABS ══════ */}
      <div style={{ background: T.BG, borderBottom: `1px solid ${T.BORDER2}`, padding: "0 20px", display: "flex", gap: 0, overflowX: "auto" }}>
        {[["log", t.dailyLog], ["summary", t.summary], ["budget", t.budgetIncome], ["settings", t.settings]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "10px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            background: "transparent", color: view === v ? T.GREEN : T.MUTED, border: "none",
            borderBottom: `2px solid ${view === v ? T.GREEN : "transparent"}`,
            fontWeight: view === v ? 600 : 400, outline: "none", whiteSpace: "nowrap",
          }}>{label}</button>
        ))}
      </div>

      {/* ══════ DAILY LOG ══════ */}
      {view === "log" && (
        <>
          {!config.hasSeenIntro && CATS.length > 0 && (
            <div style={{ margin: 16, padding: 16, background: T.SURF, border: `1px solid ${T.GREEN}`, borderRadius: 8, position: "relative" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.GREEN, marginBottom: 6 }}>{t.introTitle}</div>
              <div style={{ fontSize: 13, color: T.TEXT, lineHeight: 1.5, marginBottom: 12 }}>{t.introBody}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => { setView("settings"); updateConfig({ ...config, hasSeenIntro: true }); }}
                  style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.GREEN, borderColor: T.GREEN }}
                >{t.introOpenSettings}</button>
                <button
                  onClick={() => updateConfig({ ...config, hasSeenIntro: true })}
                  style={{ ...smallBtn, padding: "8px 14px", height: "auto" }}
                >{t.introCta}</button>
              </div>
            </div>
          )}

          {isMobile ? (
            <MobileDailyLog
              T={T} t={t} CATS={CATS} md={md} year={year} month={month} nd={nd}
              mobileDay={mobileDay} setMobileDay={setMobileDay}
              dayTotals={dayTotals} fmt={fmt} fmtT={fmtT} fmtC={fmtC}
              setDay={setDay} CUR={CUR}
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              {CATS.length === 0 ? (
                <EmptyState T={T} text={t.noCategories} />
              ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1300, fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.BG, position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, color: T.MUTED, fontWeight: 700, borderRight: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER}`, position: "sticky", left: 0, background: T.BG, minWidth: 76, letterSpacing: 1 }}>{t.date}</th>
                {CATS.map(c => (
                  <th key={c.id} style={{ padding: "10px 8px", textAlign: "right", fontSize: 10, color: c.color, fontWeight: 700, borderRight: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER}`, whiteSpace: "nowrap", minWidth: 82, letterSpacing: 0.5 }}>
                    {c.label.toUpperCase()}
                  </th>
                ))}
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, color: T.MUTED, fontWeight: 700, borderBottom: `1px solid ${T.BORDER}`, minWidth: 90, letterSpacing: 1 }}>{t.total}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: nd }, (_, i) => i + 1).map(day => {
                const dt = new Date(year, month, day);
                const dow = dt.toLocaleDateString(t.locale, { weekday: "short" });
                const isWknd = dt.getDay() === 0 || dt.getDay() === 6;
                const daytotal = dayTotals[day];
                const rowBg = isWknd ? T.WKND : T.SURF;
                return (
                  <tr key={day} style={{ borderBottom: `1px solid ${T.BORDER2}`, background: rowBg }}>
                    <td style={{ padding: "4px 12px", borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: rowBg, whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600, color: isWknd ? T.MUTED : T.TEXT }}>{String(day).padStart(2, "0")}</span>
                      <span style={{ color: T.MUTED, marginLeft: 6, fontSize: 11 }}>{dow}</span>
                    </td>
                    {CATS.map(c => {
                      const isEdit = editCell?.day === day && editCell?.key === c.id;
                      const val = md.days[day]?.[c.id];
                      if (isEdit) return (
                        <td key={c.id} style={{ padding: 0, background: T.EDIT, borderRight: `1px solid ${T.BORDER}` }}>
                          <input
                            ref={inputRef}
                            type="number"
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditCell(null); }}
                            style={{ width: 82, background: "transparent", border: "none", color: T.GREEN, fontFamily: "inherit", fontSize: 13, textAlign: "right", padding: "5px 8px", outline: "none" }}
                          />
                        </td>
                      );
                      return (
                        <td key={c.id} onClick={() => startEdit(day, c.id)} style={{
                          padding: "5px 8px", textAlign: "right", cursor: "text",
                          color: val ? T.TEXT : T.BORDER2, borderRight: `1px solid ${T.BORDER2}`, userSelect: "none"
                        }} title={t.clickToEdit}>
                          {val ? fmt(val) : "·"}
                        </td>
                      );
                    })}
                    <td style={{ padding: "5px 12px", textAlign: "right", color: daytotal > 0 ? T.TEXT : T.BORDER2, fontWeight: daytotal > 0 ? 600 : 400 }}>
                      {daytotal > 0 ? fmtT(daytotal) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: T.BG, borderTop: `2px solid ${T.BORDER}` }}>
                <td style={{ padding: "8px 12px", fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG, borderTop: `2px solid ${T.BORDER}` }}>{t.spent}</td>
                {CATS.map(c => (
                  <td key={c.id} style={{ padding: "8px", textAlign: "right", color: catTotals[c.id] > 0 ? c.color : T.BORDER2, fontWeight: 600, borderRight: `1px solid ${T.BORDER2}` }}>
                    {catTotals[c.id] > 0 ? fmtT(catTotals[c.id]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 14, color: T.GREEN, fontWeight: 700 }}>{fmtT(totalSpent)}</td>
              </tr>
              <tr style={{ background: T.BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG }}>{t.budget}</td>
                {CATS.map(c => (
                  <td key={c.id} style={{ padding: "6px 8px", textAlign: "right", color: md.budgets[c.id] > 0 ? T.MUTED : T.BORDER2, borderRight: `1px solid ${T.BORDER2}` }}>
                    {md.budgets[c.id] > 0 ? fmtT(md.budgets[c.id]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "6px 12px", textAlign: "right", color: T.MUTED }}>{totalBudget > 0 ? fmtT(totalBudget) : "—"}</td>
              </tr>
              <tr style={{ background: T.BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG }}>{t.remaining}</td>
                {CATS.map(c => {
                  const rem = (md.budgets[c.id] || 0) - catTotals[c.id];
                  const hasBudget = md.budgets[c.id] > 0;
                  return (
                    <td key={c.id} style={{ padding: "6px 8px", textAlign: "right", color: !hasBudget ? T.BORDER2 : rem >= 0 ? T.GREEN : T.RED, fontWeight: hasBudget ? 600 : 400, borderRight: `1px solid ${T.BORDER2}` }}>
                      {hasBudget ? fmtT(rem) : "—"}
                    </td>
                  );
                })}
                <td style={{ padding: "6px 12px", textAlign: "right", color: totalBudget > 0 ? (totalBudget - totalSpent >= 0 ? T.GREEN : T.RED) : T.BORDER2, fontWeight: 600 }}>
                  {totalBudget > 0 ? fmtT(totalBudget - totalSpent) : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
              )}
            </div>
          )}
        </>
      )}

      {/* ══════ SUMMARY ══════ */}
      {view === "summary" && (
        <div style={{ padding: isMobile ? 12 : 20, maxWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: t.totalIncome, value: fmtC(totalIncome), color: totalIncome > 0 ? T.GREEN : T.MUTED },
              { label: t.totalSpent,  value: fmtC(totalSpent),  color: totalSpent  > 0 ? T.RED   : T.MUTED },
              {
                label: totalIncome > 0 ? t.netRemaining : totalBudget > 0 ? t.budgetLeft : t.unbudgeted,
                value: totalIncome > 0 ? fmtC(net) : totalBudget > 0 ? fmtC(totalBudget - totalSpent) : fmtC(totalSpent),
                color: totalIncome > 0 ? netColor : totalBudget > 0 ? (totalBudget - totalSpent >= 0 ? T.GREEN : T.RED) : T.MUTED,
              },
            ].map(card => (
              <div key={card.label} style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 1, marginBottom: 8 }}>{card.label.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {totalBudget > 0 && (
            <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>{t.budgetUsage}</span>
                <span style={{ fontSize: 13, color: totalSpent / totalBudget > 1 ? T.RED : totalSpent / totalBudget > 0.8 ? T.YELLOW : T.GREEN, fontWeight: 600 }}>
                  {((totalSpent / totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ background: T.BORDER2, borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ background: totalSpent / totalBudget > 1 ? T.RED : totalSpent / totalBudget > 0.8 ? T.YELLOW : T.GREEN, height: "100%", width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: T.MUTED }}>
                <span>0</span><span>{fmtC(totalBudget)}</span>
              </div>
            </div>
          )}

          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, marginBottom: 18 }}>{t.breakdown}</div>
            {CATS.filter(c => catTotals[c.id] > 0).sort((a, b) => catTotals[b.id] - catTotals[a.id]).map(c => {
              const pct = totalSpent > 0 ? (catTotals[c.id] / totalSpent) * 100 : 0;
              const bpct = md.budgets[c.id] > 0 ? (catTotals[c.id] / md.budgets[c.id]) * 100 : null;
              return (
                <div key={c.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: c.color, fontWeight: 500 }}>{c.label}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: T.TEXT }}>{fmtT(catTotals[c.id])}</span>
                      <span style={{ fontSize: 11, color: T.MUTED }}>{pct.toFixed(1)}%</span>
                      {bpct !== null && (
                        <span style={{ fontSize: 11, color: bpct > 100 ? T.RED : bpct > 80 ? T.YELLOW : T.GREEN }}>
                          {bpct.toFixed(0)}% {t.ofBudget}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ background: T.BORDER2, borderRadius: 3, height: 5, overflow: "hidden" }}>
                    <div style={{ background: c.color, height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
            {totalSpent === 0 && (
              <div style={{ color: T.MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                {t.noExpenses} {t.months[month]}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ BUDGET & INCOME (per-month numbers) ══════ */}
      {view === "budget" && (
        <div style={{ padding: isMobile ? 12 : 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) minmax(0,1fr)", gap: 16, maxWidth: 900 }}>
            {/* Income */}
            <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>
                {t.income} · {t.months[month].toUpperCase()} {year}
              </div>
              {INCS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13 }}>{t.noIncomeSources}</div>}
              {INCS.map(src => (
                <div key={src.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{src.label.toUpperCase()}</div>
                  <input
                    type="number"
                    value={md.income[src.id] || ""}
                    onChange={e => save({ ...md, income: { ...md.income, [src.id]: parseFloat(e.target.value) || 0 } })}
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.BORDER}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>{t.totalIncome.toUpperCase()}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.GREEN }}>{fmtC(totalIncome)}</span>
              </div>
            </div>

            {/* Budgets */}
            <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, overflowY: "auto", maxHeight: 600 }}>
              <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>
                {t.budgets} · {t.months[month].toUpperCase()} {year}
              </div>
              {CATS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13 }}>{t.noCategories}</div>}
              {CATS.map(c => (
                <div key={c.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: c.color, letterSpacing: 0.5, marginBottom: 5 }}>{c.label.toUpperCase()}</div>
                  <input
                    type="number"
                    value={md.budgets[c.id] || ""}
                    onChange={e => save({ ...md, budgets: { ...md.budgets, [c.id]: parseFloat(e.target.value) || 0 } })}
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.BORDER}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>{t.totalBudget}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.MUTED }}>{fmtC(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ SETTINGS (structural / global) ══════ */}
      {view === "settings" && (
        <div style={{ padding: isMobile ? 12 : 20, maxWidth: 900 }}>

          {/* Preferences */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>{t.preferences}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.language}</div>
                <select
                  value={config.lang}
                  onChange={e => updateConfig({ ...config, lang: e.target.value })}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="en" style={{ background: T.BG, color: T.TEXT }}>English</option>
                  <option value="ru" style={{ background: T.BG, color: T.TEXT }}>Русский</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.currency}</div>
                <select
                  value={CUR.code}
                  onChange={e => {
                    const cur = CURRENCIES.find(c => c.code === e.target.value);
                    if (cur) updateConfig({ ...config, currency: cur });
                  }}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code} style={{ background: T.BG, color: T.TEXT }}>
                      {c.code} · {c.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.theme}</div>
                <select
                  value={config.theme}
                  onChange={e => updateConfig({ ...config, theme: e.target.value })}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="dark" style={{ background: T.BG, color: T.TEXT }}>{t.dark}</option>
                  <option value="light" style={{ background: T.BG, color: T.TEXT }}>{t.light}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>{t.categories}</span>
              <button onClick={addCategory} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>{t.add}</button>
            </div>
            {CATS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>{t.noCategoriesShort}</div>}
            {CATS.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
                <label style={{ position: "relative", width: 22, height: 22, borderRadius: 4, background: c.color, border: `1px solid ${T.BORDER}`, cursor: "pointer", flexShrink: 0 }} title={t.pickColor}>
                  <input
                    type="color"
                    value={c.color}
                    onChange={e => updateCategory(c.id, { color: e.target.value })}
                    style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                  />
                </label>
                <input
                  type="text"
                  value={c.label}
                  onChange={e => updateCategory(c.id, { label: e.target.value })}
                  style={{ ...inputStyle, padding: "6px 10px", flex: 1, minWidth: 0 }}
                />
                <button onClick={() => moveCategory(c.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title={t.moveUp}>↑</button>
                <button onClick={() => moveCategory(c.id, 1)} disabled={i === CATS.length - 1} style={{ ...smallBtn, opacity: i === CATS.length - 1 ? 0.3 : 1 }} title={t.moveDown}>↓</button>
                <button onClick={() => deleteCategory(c.id)} style={dangerBtn} title={t.delete}>✕</button>
              </div>
            ))}
          </div>

          {/* Income sources */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>{t.incomeSources}</span>
              <button onClick={addIncome} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>{t.add}</button>
            </div>
            {INCS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>{t.noIncomeShort}</div>}
            {INCS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
                <input
                  type="text"
                  value={s.label}
                  onChange={e => updateIncomeSource(s.id, { label: e.target.value })}
                  style={{ ...inputStyle, padding: "6px 10px", flex: 1, minWidth: 0 }}
                />
                <button onClick={() => moveIncome(s.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title={t.moveUp}>↑</button>
                <button onClick={() => moveIncome(s.id, 1)} disabled={i === INCS.length - 1} style={{ ...smallBtn, opacity: i === INCS.length - 1 ? 0.3 : 1 }} title={t.moveDown}>↓</button>
                <button onClick={() => deleteIncome(s.id)} style={dangerBtn} title={t.delete}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginTop: 20 }}>
            <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>{t.dataBackup}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <button
                onClick={exportCurrentMonth}
                style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.TEXT, borderColor: T.BORDER }}
              >
                ⬇ {t.exportMonth} {t.monthsShort[month]} {year} ({t.csv})
              </button>
              <button
                onClick={exportAllData}
                style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.GREEN, borderColor: T.GREEN }}
              >
                ⬇ {t.exportAll} ({t.csv})
              </button>
            </div>
            <div style={{ fontSize: 11, color: T.MUTED, lineHeight: 1.6 }}>
              {t.backupHint}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ T, text }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: T.MUTED, fontSize: 13 }}>{text}</div>
  );
}

function MobileDailyLog({ T, t, CATS, md, year, month, nd, mobileDay, setMobileDay, dayTotals, fmt, fmtT, fmtC, setDay, CUR }) {
  if (CATS.length === 0) {
    return <EmptyState T={T} text={t.noCategories} />;
  }
  const dt = new Date(year, month, mobileDay);
  const dow = dt.toLocaleDateString(t.locale, { weekday: "long" });
  const daytotal = dayTotals[mobileDay] || 0;

  return (
    <div style={{ padding: 12 }}>
      {/* Day picker scroller */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>{t.pickDay.toUpperCase()}</div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollSnapType: "x mandatory" }}>
          {Array.from({ length: nd }, (_, i) => i + 1).map(d => {
            const ddt = new Date(year, month, d);
            const isWk = ddt.getDay() === 0 || ddt.getDay() === 6;
            const sel = d === mobileDay;
            const hasData = (dayTotals[d] || 0) > 0;
            return (
              <button
                key={d}
                onClick={() => setMobileDay(d)}
                style={{
                  minWidth: 48, height: 56, padding: 4,
                  background: sel ? T.GREEN : T.SURF,
                  color: sel ? "#000" : isWk ? T.MUTED : T.TEXT,
                  border: `1px solid ${sel ? T.GREEN : T.BORDER2}`,
                  borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  scrollSnapAlign: "start", flexShrink: 0, outline: "none", position: "relative",
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.8 }}>{ddt.toLocaleDateString(t.locale, { weekday: "short" }).slice(0, 2)}</span>
                <span style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{d}</span>
                {hasData && !sel && <span style={{ position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: "50%", background: T.GREEN }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.TEXT }}>{String(mobileDay).padStart(2, "0")}</div>
          <div style={{ fontSize: 12, color: T.MUTED, textTransform: "capitalize" }}>{dow}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 1 }}>{t.dayTotal.toUpperCase()}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: daytotal > 0 ? T.GREEN : T.MUTED }}>
            {daytotal > 0 ? fmtC(daytotal) : "—"}
          </div>
        </div>
      </div>

      {/* Category rows for selected day */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, overflow: "hidden" }}>
        {CATS.map((c, i) => {
          const val = md.days[mobileDay]?.[c.id];
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: i < CATS.length - 1 ? `1px solid ${T.BORDER2}` : "none", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 14, color: T.TEXT, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
              <input
                type="number"
                inputMode="decimal"
                value={val ?? ""}
                onChange={e => setDay(mobileDay, c.id, e.target.value)}
                placeholder="0"
                style={{
                  width: 110, background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
                  color: val ? T.GREEN : T.TEXT, padding: "10px 12px", fontSize: 15, fontWeight: val ? 600 : 400,
                  fontFamily: "inherit", textAlign: "right", outline: "none",
                  WebkitAppearance: "none", MozAppearance: "textfield",
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: T.MUTED, textAlign: "center" }}>
        {CUR.code} · {CUR.symbol}
      </div>
    </div>
  );
}