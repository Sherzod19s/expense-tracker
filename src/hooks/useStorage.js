import { useState, useEffect, useCallback } from "react";

// ─────────────────────────  STORAGE KEYS  ─────────────────────────
export const CFG_KEY = "xpns_config_v1";
export const GOALS_KEY = "xpns_goals_v1";
export const monthKey = (y, m) => `xpns_${y}_${m}`;

// ─────────────────────────  RAW HELPERS  ─────────────────────────
export const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

// Iterate all month keys (used by Breakdown, exports)
export const listMonthKeys = () => {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const m = key?.match(/^xpns_(\d{4})_(\d+)$/);
      if (m) keys.push({ key, year: parseInt(m[1]), month: parseInt(m[2]) });
    }
  } catch {}
  keys.sort((a, b) => a.year - b.year || a.month - b.month);
  return keys;
};

// ─────────────────────────  MONTH DATA HOOK  ─────────────────────────
const emptyMonth = () => ({ days: {}, budgets: {}, income: {} });

export function useMonthData(year, month) {
  const [data, setData] = useState(() => readJSON(monthKey(year, month), emptyMonth()));

  useEffect(() => {
    setData(readJSON(monthKey(year, month), emptyMonth()));
  }, [year, month]);

  const save = useCallback((next) => {
    setData(next);
    writeJSON(monthKey(year, month), next);
  }, [year, month]);

  const setDay = useCallback((day, key, raw) => {
    setData(prev => {
      const v = parseFloat(raw);
      const newDays = { ...prev.days, [day]: { ...(prev.days[day] || {}) } };
      if (!raw || isNaN(v)) delete newDays[day][key];
      else newDays[day][key] = v;
      const next = { ...prev, days: newDays };
      writeJSON(monthKey(year, month), next);
      return next;
    });
  }, [year, month]);

  const setBudget = useCallback((catId, amount) => {
    setData(prev => {
      const next = { ...prev, budgets: { ...prev.budgets, [catId]: amount } };
      writeJSON(monthKey(year, month), next);
      return next;
    });
  }, [year, month]);

  const setIncome = useCallback((srcId, amount) => {
    setData(prev => {
      const next = { ...prev, income: { ...prev.income, [srcId]: amount } };
      writeJSON(monthKey(year, month), next);
      return next;
    });
  }, [year, month]);

  return { data, save, setDay, setBudget, setIncome };
}

// ─────────────────────────  GOALS HOOK  ─────────────────────────
import { newId } from "../constants/defaults.js";

export function useGoals() {
  const [goals, setGoals] = useState(() => readJSON(GOALS_KEY, []));

  const persist = useCallback((next) => {
    setGoals(next);
    writeJSON(GOALS_KEY, next);
  }, []);

  const addGoal = useCallback((g) => {
    setGoals(prev => {
      const next = [...prev, { ...g, id: newId(), createdAt: new Date().toISOString(), completed: false }];
      writeJSON(GOALS_KEY, next);
      return next;
    });
  }, []);

  const updateGoal = useCallback((id, patch) => {
    setGoals(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...patch } : g);
      writeJSON(GOALS_KEY, next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals(prev => {
      const next = prev.filter(g => g.id !== id);
      writeJSON(GOALS_KEY, next);
      return next;
    });
  }, []);

  return { goals, addGoal, updateGoal, deleteGoal, persist };
}

// ─────────────────────────  CSV EXPORT  ─────────────────────────
const csvCell = (v) => {
  if (v == null || v === "") return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCSV = (rows) => rows.map(r => r.map(csvCell).join(",")).join("\n");

export const downloadCSV = (filename, csv) => {
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
