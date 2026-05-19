import { useState, useEffect, useCallback } from "react";
import { CFG_KEY, readJSON, writeJSON } from "./useStorage.js";
import { DEFAULT_CATS, DEFAULT_INCOME, CURRENCIES, COLOR_PALETTE, THEMES, newId } from "../constants/defaults.js";
import { STRINGS, detectLang } from "../constants/strings.js";

const defaultConfig = (lang = "en") => ({
  theme: "dark",
  lang,
  currency: CURRENCIES[0],
  categories: DEFAULT_CATS.map(c => ({ ...c, label: STRINGS[lang].defaultCats[c.id] || c.label })),
  incomeSources: DEFAULT_INCOME.map(s => ({ ...s, label: STRINGS[lang].defaultIncome[s.id] || s.label })),
  hasSeenIntro: false,
});

const loadConfig = () => {
  const stored = readJSON(CFG_KEY);
  if (!stored) return defaultConfig(detectLang());
  return {
    theme: stored.theme === "light" ? "light" : "dark",
    lang: stored.lang === "ru" ? "ru" : "en",
    currency: stored.currency || CURRENCIES[0],
    categories: Array.isArray(stored.categories) ? stored.categories : DEFAULT_CATS,
    incomeSources: Array.isArray(stored.incomeSources) ? stored.incomeSources : DEFAULT_INCOME,
    hasSeenIntro: !!stored.hasSeenIntro,
  };
};

export function useConfig() {
  const [config, setConfig] = useState(loadConfig);

  const T = THEMES[config.theme];
  const t = STRINGS[config.lang] || STRINGS.en;

  const update = useCallback((patch) => {
    setConfig(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      writeJSON(CFG_KEY, next);
      return next;
    });
  }, []);

  // Sync body background and iOS status-bar color with current theme
  useEffect(() => {
    document.body.style.backgroundColor = T.BG;
    document.documentElement.style.backgroundColor = T.BG;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", T.BG);
  }, [T.BG]);

  // ── Convenience formatters bound to the current currency ──
  const CUR = config.currency;
  const fmt  = (n) => n && n !== 0 ? n.toLocaleString(CUR.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
  const fmtT = (n) => n.toLocaleString(CUR.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtC = (n) => `${CUR.symbol} ${fmtT(n)}`;

  // ── Category management ──
  const addCategory = useCallback(() => {
    update(prev => {
      const id = newId();
      const color = COLOR_PALETTE[prev.categories.length % COLOR_PALETTE.length];
      return { ...prev, categories: [...prev.categories, { id, label: STRINGS[prev.lang].newCategory, color }] };
    });
  }, [update]);

  const updateCategory = useCallback((id, patch) => {
    update(prev => ({ ...prev, categories: prev.categories.map(c => c.id === id ? { ...c, ...patch } : c) }));
  }, [update]);

  const moveCategory = useCallback((id, dir) => {
    update(prev => {
      const i = prev.categories.findIndex(c => c.id === id);
      const j = i + dir;
      if (j < 0 || j >= prev.categories.length) return prev;
      const arr = [...prev.categories];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, categories: arr };
    });
  }, [update]);

  const removeCategory = useCallback((id) => {
    update(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
  }, [update]);

  // ── Income source management ──
  const addIncomeSource = useCallback(() => {
    update(prev => ({ ...prev, incomeSources: [...prev.incomeSources, { id: newId(), label: STRINGS[prev.lang].newSource }] }));
  }, [update]);

  const updateIncomeSource = useCallback((id, patch) => {
    update(prev => ({ ...prev, incomeSources: prev.incomeSources.map(s => s.id === id ? { ...s, ...patch } : s) }));
  }, [update]);

  const moveIncomeSource = useCallback((id, dir) => {
    update(prev => {
      const i = prev.incomeSources.findIndex(s => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= prev.incomeSources.length) return prev;
      const arr = [...prev.incomeSources];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...prev, incomeSources: arr };
    });
  }, [update]);

  const removeIncomeSource = useCallback((id) => {
    update(prev => ({ ...prev, incomeSources: prev.incomeSources.filter(s => s.id !== id) }));
  }, [update]);

  return {
    config, update, T, t, CUR,
    fmt, fmtT, fmtC,
    addCategory, updateCategory, moveCategory, removeCategory,
    addIncomeSource, updateIncomeSource, moveIncomeSource, removeIncomeSource,
  };
}
