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

// ─────────────────────────  HELPERS  ─────────────────────────
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ─────────────────────────  STORAGE  ─────────────────────────
const CFG_KEY = "xpns_config_v1";
const monthKey = (y, m) => `xpns_${y}_${m}`;

const defaultConfig = () => ({
  theme: "dark",
  currency: CURRENCIES[0],
  categories: DEFAULT_CATS,
  incomeSources: DEFAULT_INCOME,
});

const loadConfig = () => {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        theme: p.theme === "light" ? "light" : "dark",
        currency: p.currency || CURRENCIES[0],
        categories: Array.isArray(p.categories) ? p.categories : DEFAULT_CATS,
        incomeSources: Array.isArray(p.incomeSources) ? p.incomeSources : DEFAULT_INCOME,
      };
    }
  } catch {}
  return defaultConfig();
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
  const inputRef = useRef(null);

  const T = THEMES[config.theme];
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
    updateConfig({ ...config, categories: [...CATS, { id, label: "New Category", color }] });
  };
  const updateCategory = (id, patch) =>
    updateConfig({ ...config, categories: CATS.map(c => c.id === id ? { ...c, ...patch } : c) });
  const deleteCategory = (id) => {
    const cat = CATS.find(c => c.id === id);
    if (!window.confirm(`Delete "${cat.label}"? Entries logged under this category in the current month will also be removed.`)) return;
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
    updateConfig({ ...config, incomeSources: [...INCS, { id: newId(), label: "New Source" }] });
  const updateIncomeSource = (id, patch) =>
    updateConfig({ ...config, incomeSources: INCS.map(s => s.id === id ? { ...s, ...patch } : s) });
  const deleteIncome = (id) => {
    const src = INCS.find(s => s.id === id);
    if (!window.confirm(`Delete "${src.label}"?`)) return;
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
                <span style={{ color: T.GREEN }}>{CUR.symbol}</span> Expense Tracker
              </div>
              <div style={{ fontSize: 12, color: T.MUTED, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setYear(year - 1)} style={{ ...smallBtn, height: 22, padding: "0 6px" }} title="Previous year">‹</button>
                <span style={{ minWidth: 130, display: "inline-block", textAlign: "center" }}>{FULL[month]} {year}</span>
                <button onClick={() => setYear(year + 1)} style={{ ...smallBtn, height: 22, padding: "0 6px" }} title="Next year">›</button>
                <button
                  onClick={() => { const d = new Date(); setYear(d.getFullYear()); setMonth(d.getMonth()); }}
                  style={{ ...smallBtn, height: 22, padding: "0 8px", fontSize: 10, letterSpacing: 1, marginLeft: 4 }}
                >TODAY</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button
                onClick={() => updateConfig({ ...config, theme: config.theme === "dark" ? "light" : "dark" })}
                style={{ ...smallBtn, height: 32, fontSize: 16, padding: "0 12px" }}
                title="Toggle theme"
              >{config.theme === "dark" ? "☀" : "☾"}</button>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 2 }}>{totalIncome > 0 ? "NET" : "SPENT"}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: netColor }}>
                  {totalIncome > 0 ? (net >= 0 ? "+" : "") + fmtC(net) : fmtC(totalSpent)}
                </div>
              </div>
            </div>
          </div>

          {/* Month tabs */}
          <div style={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {SHORT.map((m, i) => (
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
        {[["log", "Daily Log"], ["summary", "Summary"], ["budget", "Budget & Income"], ["settings", "Settings"]].map(([v, label]) => (
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
        <div style={{ overflowX: "auto" }}>
          {CATS.length === 0 ? (
            <EmptyState T={T} text="No categories yet. Add some in Settings." />
          ) : (
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1300, fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.BG, position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, color: T.MUTED, fontWeight: 700, borderRight: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER}`, position: "sticky", left: 0, background: T.BG, minWidth: 76, letterSpacing: 1 }}>DATE</th>
                {CATS.map(c => (
                  <th key={c.id} style={{ padding: "10px 8px", textAlign: "right", fontSize: 10, color: c.color, fontWeight: 700, borderRight: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER}`, whiteSpace: "nowrap", minWidth: 82, letterSpacing: 0.5 }}>
                    {c.label.toUpperCase()}
                  </th>
                ))}
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, color: T.MUTED, fontWeight: 700, borderBottom: `1px solid ${T.BORDER}`, minWidth: 90, letterSpacing: 1 }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: nd }, (_, i) => i + 1).map(day => {
                const dt = new Date(year, month, day);
                const dow = dt.toLocaleDateString("en", { weekday: "short" });
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
                        }} title="Click to add/edit">
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
                <td style={{ padding: "8px 12px", fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG, borderTop: `2px solid ${T.BORDER}` }}>SPENT</td>
                {CATS.map(c => (
                  <td key={c.id} style={{ padding: "8px", textAlign: "right", color: catTotals[c.id] > 0 ? c.color : T.BORDER2, fontWeight: 600, borderRight: `1px solid ${T.BORDER2}` }}>
                    {catTotals[c.id] > 0 ? fmtT(catTotals[c.id]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 14, color: T.GREEN, fontWeight: 700 }}>{fmtT(totalSpent)}</td>
              </tr>
              <tr style={{ background: T.BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG }}>BUDGET</td>
                {CATS.map(c => (
                  <td key={c.id} style={{ padding: "6px 8px", textAlign: "right", color: md.budgets[c.id] > 0 ? T.MUTED : T.BORDER2, borderRight: `1px solid ${T.BORDER2}` }}>
                    {md.budgets[c.id] > 0 ? fmtT(md.budgets[c.id]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "6px 12px", textAlign: "right", color: T.MUTED }}>{totalBudget > 0 ? fmtT(totalBudget) : "—"}</td>
              </tr>
              <tr style={{ background: T.BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG }}>REMAINING</td>
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

      {/* ══════ SUMMARY ══════ */}
      {view === "summary" && (
        <div style={{ padding: 20, maxWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Income", value: fmtC(totalIncome), color: totalIncome > 0 ? T.GREEN : T.MUTED },
              { label: "Total Spent",  value: fmtC(totalSpent),  color: totalSpent  > 0 ? T.RED   : T.MUTED },
              {
                label: totalIncome > 0 ? "Net Remaining" : totalBudget > 0 ? "Budget Left" : "Unbudgeted",
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
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>BUDGET USAGE</span>
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
            <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, marginBottom: 18 }}>BREAKDOWN BY CATEGORY</div>
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
                          {bpct.toFixed(0)}% of budget
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
                No expenses logged yet for {FULL[month]}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ BUDGET & INCOME (per-month numbers) ══════ */}
      {view === "budget" && (
        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, maxWidth: 900 }}>
            {/* Income */}
            <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>
                INCOME · {FULL[month].toUpperCase()} {year}
              </div>
              {INCS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13 }}>No income sources. Add some in Settings.</div>}
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
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>TOTAL INCOME</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.GREEN }}>{fmtC(totalIncome)}</span>
              </div>
            </div>

            {/* Budgets */}
            <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, overflowY: "auto", maxHeight: 600 }}>
              <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>
                BUDGETS · {FULL[month].toUpperCase()} {year}
              </div>
              {CATS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13 }}>No categories. Add some in Settings.</div>}
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
                <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1 }}>TOTAL BUDGET</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.MUTED }}>{fmtC(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ SETTINGS (structural / global) ══════ */}
      {view === "settings" && (
        <div style={{ padding: 20, maxWidth: 900 }}>

          {/* Preferences */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>PREFERENCES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>CURRENCY</div>
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
                <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>THEME</div>
                <select
                  value={config.theme}
                  onChange={e => updateConfig({ ...config, theme: e.target.value })}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="dark" style={{ background: T.BG, color: T.TEXT }}>Dark</option>
                  <option value="light" style={{ background: T.BG, color: T.TEXT }}>Light</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>CATEGORIES</span>
              <button onClick={addCategory} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>+ Add</button>
            </div>
            {CATS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>No categories. Click + Add.</div>}
            {CATS.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
                <label style={{ position: "relative", width: 22, height: 22, borderRadius: 4, background: c.color, border: `1px solid ${T.BORDER}`, cursor: "pointer", flexShrink: 0 }} title="Pick color">
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
                <button onClick={() => moveCategory(c.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title="Move up">↑</button>
                <button onClick={() => moveCategory(c.id, 1)} disabled={i === CATS.length - 1} style={{ ...smallBtn, opacity: i === CATS.length - 1 ? 0.3 : 1 }} title="Move down">↓</button>
                <button onClick={() => deleteCategory(c.id)} style={dangerBtn} title="Delete">✕</button>
              </div>
            ))}
          </div>

          {/* Income sources */}
          <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>INCOME SOURCES</span>
              <button onClick={addIncome} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>+ Add</button>
            </div>
            {INCS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>No income sources. Click + Add.</div>}
            {INCS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
                <input
                  type="text"
                  value={s.label}
                  onChange={e => updateIncomeSource(s.id, { label: e.target.value })}
                  style={{ ...inputStyle, padding: "6px 10px", flex: 1, minWidth: 0 }}
                />
                <button onClick={() => moveIncome(s.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title="Move up">↑</button>
                <button onClick={() => moveIncome(s.id, 1)} disabled={i === INCS.length - 1} style={{ ...smallBtn, opacity: i === INCS.length - 1 ? 0.3 : 1 }} title="Move down">↓</button>
                <button onClick={() => deleteIncome(s.id)} style={dangerBtn} title="Delete">✕</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, fontSize: 11, color: T.MUTED, lineHeight: 1.6 }}>
            Data is stored locally in your browser (localStorage). Clearing site data will erase your records — consider a manual backup if this matters.
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