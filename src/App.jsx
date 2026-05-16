import { useState, useEffect, useRef, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  { code: "TJS", symbol: "смн",   locale: "ru-RU" },
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
    trends: "Trends",
    monthlyOverview: "MONTHLY OVERVIEW",
    spendingByCategory: "SPENDING BY CATEGORY",
    last6Months: "Last 6 months",
    last12Months: "Last 12 months",
    allTime: "All time",
    needMoreData: "Log expenses for at least 2 months to see trends.",
    noDataYet: "No data yet — start logging in the Daily Log tab.",
    avgPerMonth: "Avg per month",
    totalAcross: "Total across",
    months_count: (n) => `${n} months`,
    spent_legend: "Spent",
    income_legend: "Income",
    // Breakdown
    breakdown_tab: "Breakdown",
    thisMonth: "This month",
    last3Months: "Last 3 months",
    thisYear: "This year",
    totalSpent_period: "Total spent",
    barChartTitle: "BREAKDOWN BY CATEGORY",
    noSpending: "No spending in this period.",
    of_total: "of total",
    // Goals
    goals_tab: "Goals",
    addGoal: "+ New goal",
    editGoal: "Edit goal",
    goalName: "Goal name",
    goalNamePh: "e.g., Istanbul trip with family",
    goalDescription: "Description (optional)",
    goalDescPh: "Why this matters to you",
    targetAmount: "Target amount",
    currentSaved: "Currently saved",
    targetDate: "Target date",
    monthlyRequired: "Required per month",
    monthsLeft: "Months left",
    daysLeft: "Days left",
    progress: "Progress",
    goalsEmpty: "No goals yet. Set one to start tracking what you're saving toward.",
    goalsHint: "SMART goals = Specific, Measurable, Achievable, Relevant, Time-bound. We calculate what you need to save each month to reach your target on time.",
    achieved: "Achieved 🎉",
    overdue: "Past target date",
    saveGoal: "Save goal",
    quickAdd: "Quick add",
    customAmount: "Custom amount",
    markComplete: "Mark complete",
    reopen: "Reopen",
    deleteGoal: "Delete goal",
    confirmDeleteGoal: (name) => `Delete goal "${name}"? This cannot be undone.`,
    active: "Active",
    completed: "Completed",
    requiredNote: "to reach your goal on time",
    goalCreated: "Created",
    addToSaved: "Add to saved",
    pleaseFillRequired: "Please fill in name, target amount, and target date.",
    targetMustBeFuture: "Target date should be in the future.",
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
    trends: "Динамика",
    monthlyOverview: "ОБЗОР ПО МЕСЯЦАМ",
    spendingByCategory: "РАСХОДЫ ПО КАТЕГОРИЯМ",
    last6Months: "Последние 6 месяцев",
    last12Months: "Последние 12 месяцев",
    allTime: "Всё время",
    needMoreData: "Записывайте расходы хотя бы за 2 месяца, чтобы увидеть динамику.",
    noDataYet: "Пока нет данных — начните вводить во вкладке Дневник.",
    avgPerMonth: "Среднее за месяц",
    totalAcross: "Всего за",
    months_count: (n) => {
      const lastTwo = n % 100;
      const last = n % 10;
      if (lastTwo >= 11 && lastTwo <= 14) return `${n} месяцев`;
      if (last === 1) return `${n} месяц`;
      if (last >= 2 && last <= 4) return `${n} месяца`;
      return `${n} месяцев`;
    },
    spent_legend: "Потрачено",
    income_legend: "Доход",
    // Breakdown
    breakdown_tab: "Разбивка",
    thisMonth: "Этот месяц",
    last3Months: "Последние 3 месяца",
    thisYear: "Этот год",
    totalSpent_period: "Всего потрачено",
    barChartTitle: "РАЗБИВКА ПО КАТЕГОРИЯМ",
    noSpending: "В этом периоде расходов нет.",
    of_total: "от общего",
    // Goals
    goals_tab: "Цели",
    addGoal: "+ Новая цель",
    editGoal: "Изменить цель",
    goalName: "Название цели",
    goalNamePh: "напр. Поездка в Стамбул с семьёй",
    goalDescription: "Описание (необязательно)",
    goalDescPh: "Почему это важно для вас",
    targetAmount: "Целевая сумма",
    currentSaved: "Накоплено сейчас",
    targetDate: "Целевая дата",
    monthlyRequired: "Нужно в месяц",
    monthsLeft: "Месяцев осталось",
    daysLeft: "Дней осталось",
    progress: "Прогресс",
    goalsEmpty: "Целей пока нет. Создайте одну, чтобы отслеживать, на что вы копите.",
    goalsHint: "SMART-цели: Конкретные, Измеримые, Достижимые, Релевантные, Ограниченные по времени. Мы посчитаем, сколько нужно откладывать каждый месяц, чтобы достичь цели в срок.",
    achieved: "Достигнуто 🎉",
    overdue: "Срок прошёл",
    saveGoal: "Сохранить цель",
    quickAdd: "Быстрое пополнение",
    customAmount: "Своя сумма",
    markComplete: "Отметить как выполненную",
    reopen: "Открыть снова",
    deleteGoal: "Удалить цель",
    confirmDeleteGoal: (name) => `Удалить цель «${name}»? Это действие нельзя отменить.`,
    active: "Активные",
    completed: "Выполненные",
    requiredNote: "чтобы достичь цели в срок",
    goalCreated: "Создана",
    addToSaved: "Добавить к накоплениям",
    pleaseFillRequired: "Заполните название, целевую сумму и дату.",
    targetMustBeFuture: "Целевая дата должна быть в будущем.",
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

// ─────────────────────────  GOALS STORAGE  ─────────────────────────
const GOALS_KEY = "xpns_goals_v1";

const loadGoals = () => {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveGoalsToStorage = (goals) => {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); } catch {}
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
  const [trendRange, setTrendRange] = useState("12");
  const [breakdownRange, setBreakdownRange] = useState("month");
  const [goals, setGoals] = useState(loadGoals);
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

  // Sync body background and iOS status-bar color with current theme
  useEffect(() => {
    document.body.style.backgroundColor = T.BG;
    document.documentElement.style.backgroundColor = T.BG;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", T.BG);
  }, [T.BG]);

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

  // Collect all months from localStorage for trends view
  const allMonthsData = useMemo(() => {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const m = key?.match(/^xpns_(\d{4})_(\d+)$/);
        if (!m) continue;
        const y = parseInt(m[1]);
        const mo = parseInt(m[2]);
        let data;
        try { data = JSON.parse(localStorage.getItem(key)); } catch { continue; }
        if (!data) continue;

        const catSums = {};
        let total = 0;
        Object.values(data.days || {}).forEach(dayObj => {
          Object.entries(dayObj).forEach(([catId, amt]) => {
            catSums[catId] = (catSums[catId] || 0) + amt;
            total += amt;
          });
        });
        const incomeTotal = Object.values(data.income || {}).reduce((a, b) => a + b, 0);
        out.push({ year: y, month: mo, total, incomeTotal, catSums });
      }
    } catch {}
    out.sort((a, b) => a.year - b.year || a.month - b.month);
    return out;
  }, [view, year, month, md]);

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

  // ── Goals management ──
  const persistGoals = (next) => { setGoals(next); saveGoalsToStorage(next); };

  const addGoal = (g) => persistGoals([...goals, { ...g, id: newId(), createdAt: new Date().toISOString(), completed: false }]);
  const updateGoal = (id, patch) => persistGoals(goals.map(g => g.id === id ? { ...g, ...patch } : g));
  const deleteGoalById = (id) => {
    const g = goals.find(g => g.id === id);
    if (!g) return;
    if (!window.confirm(t.confirmDeleteGoal(g.name))) return;
    persistGoals(goals.filter(g => g.id !== id));
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
        {[["log", t.dailyLog], ["summary", t.summary], ["breakdown", t.breakdown_tab], ["trends", t.trends], ["goals", t.goals_tab], ["budget", t.budgetIncome], ["settings", t.settings]].map(([v, label]) => (
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

      {/* ══════ BREAKDOWN ══════ */}
      {view === "breakdown" && (
        <BreakdownView
          T={T} t={t} CATS={CATS} CUR={CUR}
          allMonthsData={allMonthsData}
          breakdownRange={breakdownRange} setBreakdownRange={setBreakdownRange}
          isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
          year={year} month={month}
        />
      )}

      {/* ══════ GOALS ══════ */}
      {view === "goals" && (
        <GoalsView
          T={T} t={t} CUR={CUR}
          goals={goals}
          addGoal={addGoal} updateGoal={updateGoal} deleteGoalById={deleteGoalById}
          isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
        />
      )}

      {/* ══════ TRENDS ══════ */}
      {view === "trends" && (
        <TrendsView
          T={T} t={t} CATS={CATS} CUR={CUR}
          allMonthsData={allMonthsData}
          trendRange={trendRange} setTrendRange={setTrendRange}
          isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
        />
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

function TrendsView({ T, t, CATS, CUR, allMonthsData, trendRange, setTrendRange, isMobile, fmtT, fmtC }) {
  // Filter by selected range
  const filtered = useMemo(() => {
    if (trendRange === "all") return allMonthsData;
    const n = parseInt(trendRange);
    return allMonthsData.slice(-n);
  }, [allMonthsData, trendRange]);

  if (allMonthsData.length === 0) {
    return (
      <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1000 }}>
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 40, textAlign: "center", color: T.MUTED, fontSize: 14 }}>
          {t.noDataYet}
        </div>
      </div>
    );
  }

  if (allMonthsData.length < 2) {
    return (
      <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1000 }}>
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 40, textAlign: "center", color: T.MUTED, fontSize: 14 }}>
          {t.needMoreData}
        </div>
      </div>
    );
  }

  // Build chart data
  const monthLabel = (entry) => `${t.monthsShort[entry.month]} ${String(entry.year).slice(2)}`;

  const overviewData = filtered.map(e => ({
    name: monthLabel(e),
    [t.spent_legend]: Math.round(e.total * 100) / 100,
    [t.income_legend]: Math.round(e.incomeTotal * 100) / 100,
  }));

  const categoryData = filtered.map(e => {
    const row = { name: monthLabel(e) };
    CATS.forEach(c => {
      row[c.label] = Math.round((e.catSums[c.id] || 0) * 100) / 100;
    });
    return row;
  });

  // Stats: avg per month and total
  const totalSum = filtered.reduce((s, e) => s + e.total, 0);
  const avgPerMonth = totalSum / filtered.length;

  // Categories that have any data in the filtered range (cleaner chart)
  const activeCats = CATS.filter(c => filtered.some(e => (e.catSums[c.id] || 0) > 0));

  // Custom tooltip for both charts (theme-aware)
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{
        background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 6,
        padding: "8px 12px", fontFamily: "inherit", fontSize: 12,
      }}>
        <div style={{ color: T.TEXT, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload
          .filter(p => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .map(p => (
          <div key={p.dataKey} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>{p.dataKey}</span>
            <span style={{ fontWeight: 600 }}>{fmtT(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const rangeOptions = [
    { value: "6", label: t.last6Months },
    { value: "12", label: t.last12Months },
    { value: "all", label: t.allTime },
  ];

  return (
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1000 }}>
      {/* Range selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {rangeOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setTrendRange(opt.value)}
            style={{
              padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              background: trendRange === opt.value ? T.GREEN : "transparent",
              color: trendRange === opt.value ? "#000" : T.MUTED,
              border: `1px solid ${trendRange === opt.value ? T.GREEN : T.BORDER}`,
              borderRadius: 6, fontWeight: trendRange === opt.value ? 600 : 400, outline: "none",
            }}
          >{opt.label}</button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(2, 1fr)", gap: 12, marginBottom: 20, maxWidth: 600 }}>
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 1, marginBottom: 6 }}>{t.avgPerMonth.toUpperCase()}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.TEXT }}>{fmtC(avgPerMonth)}</div>
        </div>
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: "14px 18px" }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 1, marginBottom: 6 }}>
            {t.totalAcross.toUpperCase()} {t.months_count(filtered.length).toUpperCase()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.TEXT }}>{fmtC(totalSum)}</div>
        </div>
      </div>

      {/* Overview chart */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: isMobile ? 12 : 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, marginBottom: 16, fontWeight: 700 }}>{t.monthlyOverview}</div>
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
          <LineChart data={overviewData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.BORDER2} />
            <XAxis dataKey="name" stroke={T.MUTED} tick={{ fontSize: 11, fill: T.MUTED }} />
            <YAxis stroke={T.MUTED} tick={{ fontSize: 11, fill: T.MUTED }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: T.TEXT }} iconType="circle" />
            <Line type="monotone" dataKey={t.spent_legend} stroke={T.RED} strokeWidth={2} dot={{ r: 3, fill: T.RED }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey={t.income_legend} stroke={T.GREEN} strokeWidth={2} dot={{ r: 3, fill: T.GREEN }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-category chart */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: isMobile ? 12 : 20 }}>
        <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, marginBottom: 16, fontWeight: 700 }}>{t.spendingByCategory}</div>
        {activeCats.length === 0 ? (
          <div style={{ color: T.MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
            {t.noDataYet}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
            <LineChart data={categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.BORDER2} />
              <XAxis dataKey="name" stroke={T.MUTED} tick={{ fontSize: 11, fill: T.MUTED }} />
              <YAxis stroke={T.MUTED} tick={{ fontSize: 11, fill: T.MUTED }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: T.TEXT, paddingTop: 10 }} iconType="circle" />
              {activeCats.map(c => (
                <Line
                  key={c.id}
                  type="monotone"
                  dataKey={c.label}
                  stroke={c.color}
                  strokeWidth={2}
                  dot={{ r: 2, fill: c.color }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        <div style={{ fontSize: 11, color: T.MUTED, marginTop: 10, textAlign: "center" }}>
          {isMobile ? "" : "Click legend items to toggle visibility"}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────  BREAKDOWN VIEW  ─────────────────────────
function BreakdownView({ T, t, CATS, CUR, allMonthsData, breakdownRange, setBreakdownRange, isMobile, fmtT, fmtC, year, month }) {
  // Filter months based on range
  const filtered = useMemo(() => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth();

    if (breakdownRange === "month") {
      return allMonthsData.filter(e => e.year === year && e.month === month);
    }
    if (breakdownRange === "3months") {
      // Last 3 months including current
      const cutoff = new Date(curY, curM - 2, 1);
      return allMonthsData.filter(e => new Date(e.year, e.month, 1) >= cutoff);
    }
    if (breakdownRange === "year") {
      return allMonthsData.filter(e => e.year === curY);
    }
    return allMonthsData; // all time
  }, [allMonthsData, breakdownRange, year, month]);

  // Aggregate totals per category
  const aggregated = useMemo(() => {
    const sums = {};
    filtered.forEach(e => {
      Object.entries(e.catSums || {}).forEach(([catId, amt]) => {
        sums[catId] = (sums[catId] || 0) + amt;
      });
    });
    const total = Object.values(sums).reduce((s, v) => s + v, 0);
    const rows = CATS
      .map(c => ({ ...c, amount: sums[c.id] || 0, pct: total > 0 ? ((sums[c.id] || 0) / total) * 100 : 0 }))
      .filter(r => r.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    return { rows, total };
  }, [filtered, CATS]);

  const rangeOptions = [
    { value: "month", label: t.thisMonth },
    { value: "3months", label: t.last3Months },
    { value: "year", label: t.thisYear },
    { value: "all", label: t.allTime },
  ];

  const chartData = aggregated.rows.map(r => ({
    name: r.label,
    amount: Math.round(r.amount * 100) / 100,
    color: r.color,
    pct: r.pct,
  }));

  const BarTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 6, padding: "8px 12px", fontFamily: "inherit", fontSize: 12 }}>
        <div style={{ color: d.color, fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
        <div style={{ color: T.TEXT, fontWeight: 600 }}>{fmtC(d.amount)}</div>
        <div style={{ color: T.MUTED, fontSize: 11 }}>{d.pct.toFixed(1)}% {t.of_total}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 1000 }}>
      {/* Range selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {rangeOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setBreakdownRange(opt.value)}
            style={{
              padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              background: breakdownRange === opt.value ? T.GREEN : "transparent",
              color: breakdownRange === opt.value ? "#000" : T.MUTED,
              border: `1px solid ${breakdownRange === opt.value ? T.GREEN : T.BORDER}`,
              borderRadius: 6, fontWeight: breakdownRange === opt.value ? 600 : 400, outline: "none",
            }}
          >{opt.label}</button>
        ))}
      </div>

      {/* Total */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: "14px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, fontWeight: 700 }}>{t.totalSpent_period.toUpperCase()}</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: aggregated.total > 0 ? T.RED : T.MUTED }}>{fmtC(aggregated.total)}</span>
      </div>

      {/* Bar chart */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: isMobile ? 12 : 20, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, marginBottom: 16, fontWeight: 700 }}>{t.barChartTitle}</div>
        {chartData.length === 0 ? (
          <div style={{ color: T.MUTED, fontSize: 13, padding: "30px 0", textAlign: "center" }}>{t.noSpending}</div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.BORDER2} vertical={false} />
              <XAxis dataKey="name" stroke={T.MUTED} tick={{ fontSize: 10, fill: T.MUTED }} angle={-35} textAnchor="end" interval={0} height={60} />
              <YAxis stroke={T.MUTED} tick={{ fontSize: 11, fill: T.MUTED }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: T.BORDER2, opacity: 0.3 }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category list */}
      {aggregated.rows.length > 0 && (
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, overflow: "hidden" }}>
          {aggregated.rows.map((r, i) => (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", padding: "14px 16px", gap: 12,
              borderBottom: i < aggregated.rows.length - 1 ? `1px solid ${T.BORDER2}` : "none",
            }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: T.TEXT, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
                <div style={{ background: T.BORDER2, borderRadius: 2, height: 3, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ background: r.color, height: "100%", width: `${r.pct}%`, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{fmtC(r.amount)}</div>
                <div style={{ fontSize: 11, color: T.MUTED }}>{r.pct.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────  GOALS VIEW  ─────────────────────────
function GoalsView({ T, t, CUR, goals, addGoal, updateGoal, deleteGoalById, isMobile, fmtT, fmtC }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", targetAmount: "", savedAmount: "0", targetDate: "" });
  const [filter, setFilter] = useState("active");

  const resetForm = () => {
    setForm({ name: "", description: "", targetAmount: "", savedAmount: "0", targetDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.targetAmount || !form.targetDate) {
      window.alert(t.pleaseFillRequired);
      return;
    }
    const target = parseFloat(form.targetAmount);
    const saved = parseFloat(form.savedAmount) || 0;
    if (isNaN(target) || target <= 0) {
      window.alert(t.pleaseFillRequired);
      return;
    }
    const targetDate = new Date(form.targetDate);
    if (!editingId && targetDate <= new Date()) {
      if (!window.confirm(t.targetMustBeFuture + " Continue anyway?")) return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      targetAmount: target,
      savedAmount: saved,
      targetDate: form.targetDate,
    };
    if (editingId) updateGoal(editingId, payload);
    else addGoal(payload);
    resetForm();
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      description: g.description || "",
      targetAmount: g.targetAmount.toString(),
      savedAmount: g.savedAmount.toString(),
      targetDate: g.targetDate,
    });
    setShowForm(true);
  };

  const visibleGoals = goals.filter(g => filter === "active" ? !g.completed : g.completed);

  const inputStyle = {
    width: "100%", background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
    color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
  };
  const labelStyle = { fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5, display: "block" };

  return (
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 900 }}>
      {/* Header + filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["active", t.active], ["completed", t.completed]].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              style={{
                padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                background: filter === v ? T.GREEN : "transparent",
                color: filter === v ? "#000" : T.MUTED,
                border: `1px solid ${filter === v ? T.GREEN : T.BORDER}`,
                borderRadius: 6, fontWeight: filter === v ? 600 : 400, outline: "none",
              }}
            >{label}</button>
          ))}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "8px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              background: T.GREEN, color: "#000", border: "none",
              borderRadius: 6, fontWeight: 600, outline: "none",
            }}
          >{t.addGoal}</button>
        )}
      </div>

      {/* SMART hint when no goals */}
      {goals.length === 0 && !showForm && (
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
          <div style={{ color: T.TEXT, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{t.goalsEmpty}</div>
          <div style={{ color: T.MUTED, fontSize: 13, lineHeight: 1.6 }}>{t.goalsHint}</div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: T.SURF, border: `1px solid ${T.GREEN}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
            {editingId ? t.editGoal.toUpperCase() : t.addGoal.replace("+", "").trim().toUpperCase()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
              <label style={labelStyle}>{t.goalName} *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.goalNamePh} />
            </div>
            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
              <label style={labelStyle}>{t.goalDescription}</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder={t.goalDescPh} />
            </div>
            <div>
              <label style={labelStyle}>{t.targetAmount} ({CUR.symbol}) *</label>
              <input style={inputStyle} type="number" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} placeholder="10000" />
            </div>
            <div>
              <label style={labelStyle}>{t.currentSaved} ({CUR.symbol})</label>
              <input style={inputStyle} type="number" value={form.savedAmount} onChange={e => setForm({...form, savedAmount: e.target.value})} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>{t.targetDate} *</label>
              <input style={inputStyle} type="date" value={form.targetDate} onChange={e => setForm({...form, targetDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              style={{ padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: T.GREEN, color: "#000", border: "none", borderRadius: 6, fontWeight: 600, outline: "none" }}
            >{t.saveGoal}</button>
            <button
              onClick={resetForm}
              style={{ padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}
            >{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Goals list */}
      {visibleGoals.length === 0 && goals.length > 0 && (
        <div style={{ color: T.MUTED, fontSize: 13, padding: "30px 0", textAlign: "center" }}>—</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleGoals.map(g => (
          <GoalCard
            key={g.id}
            goal={g}
            T={T} t={t} CUR={CUR} isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
            onEdit={() => startEdit(g)}
            onDelete={() => deleteGoalById(g.id)}
            onToggleComplete={() => updateGoal(g.id, { completed: !g.completed })}
            onAddSaved={(amt) => updateGoal(g.id, { savedAmount: Math.max(0, g.savedAmount + amt) })}
            onSetSaved={(amt) => updateGoal(g.id, { savedAmount: Math.max(0, amt) })}
          />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ goal, T, t, CUR, isMobile, fmtT, fmtC, onEdit, onDelete, onToggleComplete, onAddSaved, onSetSaved }) {
  const [quickAddVal, setQuickAddVal] = useState("");
  const [editingSaved, setEditingSaved] = useState(false);
  const [savedInput, setSavedInput] = useState(goal.savedAmount.toString());

  const now = new Date();
  const target = new Date(goal.targetDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((target - now) / msPerDay);
  const monthsLeft = daysLeft / 30.44;
  const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const monthlyRequired = monthsLeft > 0 && remaining > 0 ? remaining / monthsLeft : 0;

  const isOverdue = !goal.completed && daysLeft < 0 && goal.savedAmount < goal.targetAmount;
  const isAchieved = goal.savedAmount >= goal.targetAmount;

  let statusColor = T.GREEN;
  let statusLabel = null;
  if (goal.completed || isAchieved) {
    statusColor = T.GREEN;
    statusLabel = t.achieved;
  } else if (isOverdue) {
    statusColor = T.RED;
    statusLabel = t.overdue;
  }

  const handleQuickAdd = () => {
    const v = parseFloat(quickAddVal);
    if (!isNaN(v) && v !== 0) {
      onAddSaved(v);
      setQuickAddVal("");
    }
  };

  const handleSetSaved = () => {
    const v = parseFloat(savedInput);
    if (!isNaN(v)) onSetSaved(v);
    setEditingSaved(false);
  };

  return (
    <div style={{ background: T.SURF, border: `1px solid ${isAchieved || goal.completed ? T.GREEN : isOverdue ? T.RED : T.BORDER}`, borderRadius: 8, padding: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.TEXT, overflow: "hidden", textOverflow: "ellipsis" }}>{goal.name}</div>
          {goal.description && <div style={{ fontSize: 12, color: T.MUTED, marginTop: 2 }}>{goal.description}</div>}
        </div>
        {statusLabel && (
          <span style={{ fontSize: 11, color: statusColor, fontWeight: 700, padding: "3px 8px", border: `1px solid ${statusColor}`, borderRadius: 4, whiteSpace: "nowrap" }}>
            {statusLabel}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: T.MUTED }}>{t.progress}</span>
          <span style={{ color: T.TEXT, fontWeight: 600 }}>{Math.min(progress, 100).toFixed(1)}%</span>
        </div>
        <div style={{ background: T.BORDER2, borderRadius: 4, height: 8, overflow: "hidden" }}>
          <div style={{ background: isAchieved ? T.GREEN : isOverdue ? T.RED : T.GREEN, height: "100%", width: `${Math.min(progress, 100)}%`, borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: T.MUTED }}>
          <span>{fmtC(goal.savedAmount)}</span>
          <span>{fmtC(goal.targetAmount)}</span>
        </div>
      </div>

      {/* SMART stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10, padding: "10px 0", borderTop: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER2}`, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>
            {daysLeft >= 0 ? (monthsLeft >= 1 ? t.monthsLeft.toUpperCase() : t.daysLeft.toUpperCase()) : t.daysLeft.toUpperCase()}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: daysLeft < 0 ? T.RED : T.TEXT, marginTop: 2 }}>
            {daysLeft >= 0 ? (monthsLeft >= 1 ? Math.ceil(monthsLeft) : daysLeft) : daysLeft}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>{t.monthlyRequired.toUpperCase()}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isAchieved ? T.GREEN : T.TEXT, marginTop: 2 }}>
            {isAchieved ? "—" : monthlyRequired > 0 ? fmtC(monthlyRequired) : "—"}
          </div>
        </div>
        <div style={{ gridColumn: isMobile ? "span 2" : "auto" }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>{t.targetDate.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT, marginTop: 2 }}>
            {new Date(goal.targetDate).toLocaleDateString(t.locale, { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Quick-add saved amount */}
      {!goal.completed && !isAchieved && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5, marginBottom: 6 }}>{t.addToSaved.toUpperCase()}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <input
              type="number"
              value={quickAddVal}
              onChange={e => setQuickAddVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleQuickAdd(); }}
              placeholder={CUR.symbol}
              style={{
                flex: 1, minWidth: 120, background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
                color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", outline: "none",
              }}
            />
            <button
              onClick={handleQuickAdd}
              disabled={!quickAddVal}
              style={{ padding: "8px 14px", fontSize: 13, cursor: quickAddVal ? "pointer" : "not-allowed", fontFamily: "inherit", background: T.GREEN, color: "#000", border: "none", borderRadius: 6, fontWeight: 600, outline: "none", opacity: quickAddVal ? 1 : 0.5 }}
            >+</button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={onEdit} style={{ flex: 1, minWidth: 0, padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.TEXT, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}>
          {t.editGoal}
        </button>
        <button onClick={onToggleComplete} style={{ flex: 1, minWidth: 0, padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: goal.completed ? T.MUTED : T.GREEN, border: `1px solid ${goal.completed ? T.BORDER : T.GREEN}`, borderRadius: 6, outline: "none" }}>
          {goal.completed ? t.reopen : t.markComplete}
        </button>
        <button onClick={onDelete} style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.RED, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}>
          ✕
        </button>
      </div>
    </div>
  );
}