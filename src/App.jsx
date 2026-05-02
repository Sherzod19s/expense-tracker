import { useState, useEffect, useRef } from "react";

const CATS = [
  { key: "food", label: "Food", color: "#34d399" },
  { key: "house", label: "House Exp.", color: "#818cf8" },
  { key: "utilities", label: "Utilities", color: "#fbbf24" },
  { key: "transport", label: "Transport", color: "#60a5fa" },
  { key: "health", label: "Health", color: "#f87171" },
  { key: "hygiene", label: "Hygiene", color: "#e879f9" },
  { key: "mobile", label: "Mobile", color: "#22d3ee" },
  { key: "rent", label: "Rent", color: "#fb923c" },
  { key: "education", label: "Education", color: "#a3e635" },
  { key: "family", label: "Family", color: "#f472b6" },
  { key: "entertainment", label: "Entertain.", color: "#a78bfa" },
  { key: "gifts", label: "Gifts", color: "#2dd4bf" },
  { key: "charity", label: "Charity", color: "#fb7185" },
  { key: "unexpected", label: "Unexpected", color: "#fdba74" },
  { key: "clothing", label: "Clothing", color: "#c084fc" },
];

const INCOME_SOURCES = [
  { key: "s1", label: "Salary 1" },
  { key: "e1", label: "Bonus / Extra 1" },
  { key: "s2", label: "Salary 2" },
  { key: "e2", label: "Bonus / Extra 2" },
  { key: "o1", label: "Other Income 1" },
  { key: "o2", label: "Other Income 2" },
];

const SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const fmt = (n) => n && n !== 0 ? n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
const fmtT = (n) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const BG = "#0d1117";
const SURF = "#161b22";
const SURF2 = "#1c2128";
const BORDER = "#30363d";
const BORDER2 = "#21262d";
const TEXT = "#e6edf3";
const MUTED = "#7d8590";
const GREEN = "#3fb950";
const RED = "#f85149";
const YELLOW = "#d29922";

const emptyData = () => ({ days: {}, budgets: {}, income: {} });

export default function App() {
  const [year] = useState(2025);
  const [month, setMonth] = useState(new Date().getMonth());
  const [view, setView] = useState("log");
  const [md, setMd] = useState(emptyData());
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState("");
  const inputRef = useRef(null);

  const stKey = `xpns_${year}_${month}`;

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(stKey);
        setMd(r ? JSON.parse(r.value) : emptyData());
      } catch { setMd(emptyData()); }
    })();
  }, [stKey]);

  const save = async (d) => {
    setMd(d);
    try { await window.storage.set(stKey, JSON.stringify(d)); } catch {}
  };

  const setDay = (day, key, raw) => {
    const v = parseFloat(raw);
    const newDays = { ...md.days, [day]: { ...(md.days[day] || {}) } };
    if (!raw || isNaN(v)) delete newDays[day][key];
    else newDays[day][key] = v;
    save({ ...md, days: newDays });
  };

  const nd = daysInMonth(year, month);

  const catTotals = Object.fromEntries(
    CATS.map(c => [c.key, Array.from({ length: nd }, (_, i) => md.days[i + 1]?.[c.key] || 0).reduce((a, b) => a + b, 0)])
  );
  const dayTotals = Object.fromEntries(
    Array.from({ length: nd }, (_, i) => i + 1).map(d => [d, CATS.reduce((s, c) => s + (md.days[d]?.[c.key] || 0), 0)])
  );
  const totalSpent = CATS.reduce((s, c) => s + catTotals[c.key], 0);
  const totalBudget = CATS.reduce((s, c) => s + (md.budgets[c.key] || 0), 0);
  const totalIncome = INCOME_SOURCES.reduce((s, src) => s + (md.income[src.key] || 0), 0);

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
  const netColor = totalIncome === 0 ? MUTED : net >= 0 ? GREEN : RED;

  return (
    <div style={{ fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace", background: BG, color: TEXT, minHeight: "100vh" }}>

      {/* ── Top Header ── */}
      <div style={{ background: SURF, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
                <span style={{ color: GREEN }}>$</span> Expense Tracker
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{FULL[month]} {year}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>
                {totalIncome > 0 ? "NET" : "SPENT"}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: netColor }}>
                {totalIncome > 0 ? (net >= 0 ? "+" : "") + fmtT(net) : fmtT(totalSpent)}
              </div>
            </div>
          </div>

          {/* Month tabs */}
          <div style={{ display: "flex", gap: 1, overflowX: "auto" }}>
            {SHORT.map((m, i) => (
              <button key={i} onClick={() => { setMonth(i); setEditCell(null); }} style={{
                padding: "6px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                background: month === i ? BG : "transparent",
                color: month === i ? GREEN : MUTED,
                border: `1px solid ${month === i ? BORDER : "transparent"}`,
                borderBottom: month === i ? `1px solid ${BG}` : "1px solid transparent",
                borderRadius: "4px 4px 0 0", whiteSpace: "nowrap",
                fontWeight: month === i ? 600 : 400, outline: "none"
              }}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── View Tabs ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER2}`, padding: "0 20px", display: "flex", gap: 0 }}>
        {[["log", "Daily Log"], ["summary", "Summary"], ["settings", "Budget & Income"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "10px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            background: "transparent", color: view === v ? GREEN : MUTED, border: "none",
            borderBottom: `2px solid ${view === v ? GREEN : "transparent"}`,
            fontWeight: view === v ? 600 : 400, outline: "none"
          }}>{label}</button>
        ))}
      </div>

      {/* ══ DAILY LOG VIEW ══ */}
      {view === "log" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1300, fontSize: 13 }}>
            <thead>
              <tr style={{ background: BG, position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, color: MUTED, fontWeight: 700, borderRight: `1px solid ${BORDER2}`, borderBottom: `1px solid ${BORDER}`, position: "sticky", left: 0, background: BG, minWidth: 76, letterSpacing: 1 }}>DATE</th>
                {CATS.map(c => (
                  <th key={c.key} style={{ padding: "10px 8px", textAlign: "right", fontSize: 10, color: c.color, fontWeight: 700, borderRight: `1px solid ${BORDER2}`, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap", minWidth: 82, letterSpacing: 0.5 }}>
                    {c.label.toUpperCase()}
                  </th>
                ))}
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, color: MUTED, fontWeight: 700, borderBottom: `1px solid ${BORDER}`, minWidth: 90, letterSpacing: 1 }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: nd }, (_, i) => i + 1).map(day => {
                const dt = new Date(year, month, day);
                const dow = dt.toLocaleDateString("en", { weekday: "short" });
                const isWknd = dt.getDay() === 0 || dt.getDay() === 6;
                const daytotal = dayTotals[day];
                const rowBg = isWknd ? "#111722" : SURF;
                return (
                  <tr key={day} style={{ borderBottom: `1px solid ${BORDER2}`, background: rowBg }}>
                    <td style={{ padding: "4px 12px", borderRight: `1px solid ${BORDER2}`, position: "sticky", left: 0, background: rowBg, whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600, color: isWknd ? MUTED : TEXT }}>{String(day).padStart(2, "0")}</span>
                      <span style={{ color: MUTED, marginLeft: 6, fontSize: 11 }}>{dow}</span>
                    </td>
                    {CATS.map(c => {
                      const isEdit = editCell?.day === day && editCell?.key === c.key;
                      const val = md.days[day]?.[c.key];
                      if (isEdit) return (
                        <td key={c.key} style={{ padding: 0, background: "#1a2a1a", borderRight: `1px solid ${BORDER}` }}>
                          <input
                            ref={inputRef}
                            type="number"
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditCell(null); }}
                            style={{ width: 82, background: "transparent", border: "none", color: GREEN, fontFamily: "inherit", fontSize: 13, textAlign: "right", padding: "5px 8px", outline: "none" }}
                          />
                        </td>
                      );
                      return (
                        <td key={c.key} onClick={() => startEdit(day, c.key)} style={{
                          padding: "5px 8px", textAlign: "right", cursor: "text",
                          color: val ? TEXT : BORDER2, borderRight: `1px solid ${BORDER2}`, userSelect: "none"
                        }} title="Click to add/edit">
                          {val ? fmt(val) : "·"}
                        </td>
                      );
                    })}
                    <td style={{ padding: "5px 12px", textAlign: "right", color: daytotal > 0 ? TEXT : BORDER2, fontWeight: daytotal > 0 ? 600 : 400 }}>
                      {daytotal > 0 ? fmtT(daytotal) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: BG, borderTop: `2px solid ${BORDER}` }}>
                <td style={{ padding: "8px 12px", fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${BORDER2}`, position: "sticky", left: 0, background: BG, borderTop: `2px solid ${BORDER}` }}>SPENT</td>
                {CATS.map(c => (
                  <td key={c.key} style={{ padding: "8px", textAlign: "right", color: catTotals[c.key] > 0 ? c.color : BORDER2, fontWeight: 600, borderRight: `1px solid ${BORDER2}` }}>
                    {catTotals[c.key] > 0 ? fmtT(catTotals[c.key]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "8px 12px", textAlign: "right", fontSize: 14, color: GREEN, fontWeight: 700 }}>{fmtT(totalSpent)}</td>
              </tr>
              <tr style={{ background: BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${BORDER2}`, position: "sticky", left: 0, background: BG }}>BUDGET</td>
                {CATS.map(c => (
                  <td key={c.key} style={{ padding: "6px 8px", textAlign: "right", color: md.budgets[c.key] > 0 ? MUTED : BORDER2, borderRight: `1px solid ${BORDER2}` }}>
                    {md.budgets[c.key] > 0 ? fmtT(md.budgets[c.key]) : "—"}
                  </td>
                ))}
                <td style={{ padding: "6px 12px", textAlign: "right", color: MUTED }}>{totalBudget > 0 ? fmtT(totalBudget) : "—"}</td>
              </tr>
              <tr style={{ background: BG }}>
                <td style={{ padding: "6px 12px", fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${BORDER2}`, position: "sticky", left: 0, background: BG }}>REMAINING</td>
                {CATS.map(c => {
                  const rem = (md.budgets[c.key] || 0) - catTotals[c.key];
                  const hasBudget = md.budgets[c.key] > 0;
                  return (
                    <td key={c.key} style={{ padding: "6px 8px", textAlign: "right", color: !hasBudget ? BORDER2 : rem >= 0 ? GREEN : RED, fontWeight: hasBudget ? 600 : 400, borderRight: `1px solid ${BORDER2}` }}>
                      {hasBudget ? fmtT(rem) : "—"}
                    </td>
                  );
                })}
                <td style={{ padding: "6px 12px", textAlign: "right", color: totalBudget > 0 ? (totalBudget - totalSpent >= 0 ? GREEN : RED) : BORDER2, fontWeight: 600 }}>
                  {totalBudget > 0 ? fmtT(totalBudget - totalSpent) : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* ══ SUMMARY VIEW ══ */}
      {view === "summary" && (
        <div style={{ padding: 20, maxWidth: 900 }}>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Income", value: fmtT(totalIncome), color: totalIncome > 0 ? GREEN : MUTED },
              { label: "Total Spent", value: fmtT(totalSpent), color: totalSpent > 0 ? RED : MUTED },
              { label: totalIncome > 0 ? "Net Remaining" : totalBudget > 0 ? "Budget Left" : "Unbudgeted", value: totalIncome > 0 ? fmtT(net) : totalBudget > 0 ? fmtT(totalBudget - totalSpent) : fmtT(totalSpent), color: totalIncome > 0 ? netColor : totalBudget > 0 ? (totalBudget - totalSpent >= 0 ? GREEN : RED) : MUTED },
            ].map(card => (
              <div key={card.label} style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px" }}>
                <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 8 }}>{card.label.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar if budget set */}
          {totalBudget > 0 && (
            <div style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: 1 }}>BUDGET USAGE</span>
                <span style={{ fontSize: 13, color: totalSpent / totalBudget > 1 ? RED : totalSpent / totalBudget > 0.8 ? YELLOW : GREEN, fontWeight: 600 }}>
                  {((totalSpent / totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ background: BORDER2, borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ background: totalSpent / totalBudget > 1 ? RED : totalSpent / totalBudget > 0.8 ? YELLOW : GREEN, height: "100%", width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: MUTED }}>
                <span>0</span><span>{fmtT(totalBudget)}</span>
              </div>
            </div>
          )}

          {/* Category breakdown */}
          <div style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: 1, marginBottom: 18 }}>BREAKDOWN BY CATEGORY</div>
            {CATS.filter(c => catTotals[c.key] > 0).sort((a, b) => catTotals[b.key] - catTotals[a.key]).map(c => {
              const pct = totalSpent > 0 ? (catTotals[c.key] / totalSpent) * 100 : 0;
              const bpct = md.budgets[c.key] > 0 ? (catTotals[c.key] / md.budgets[c.key]) * 100 : null;
              return (
                <div key={c.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, color: c.color, fontWeight: 500 }}>{c.label}</span>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{fmtT(catTotals[c.key])}</span>
                      <span style={{ fontSize: 11, color: MUTED }}>{pct.toFixed(1)}%</span>
                      {bpct !== null && (
                        <span style={{ fontSize: 11, color: bpct > 100 ? RED : bpct > 80 ? YELLOW : GREEN }}>
                          {bpct.toFixed(0)}% of budget
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ background: BORDER2, borderRadius: 3, height: 5, overflow: "hidden" }}>
                    <div style={{ background: c.color, height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
            {totalSpent === 0 && (
              <div style={{ color: MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                No expenses logged yet for {FULL[month]}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SETTINGS VIEW ══ */}
      {view === "settings" && (
        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, maxWidth: 900 }}>
            {/* Income */}
            <div style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>INCOME SOURCES</div>
              {INCOME_SOURCES.map(src => (
                <div key={src.key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{src.label.toUpperCase()}</div>
                  <input
                    type="number"
                    value={md.income[src.key] || ""}
                    onChange={e => {
                      const v = parseFloat(e.target.value) || 0;
                      save({ ...md, income: { ...md.income, [src.key]: v } });
                    }}
                    placeholder="0.00"
                    style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: 1 }}>TOTAL INCOME</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>{fmtT(totalIncome)}</span>
              </div>
            </div>

            {/* Budgets */}
            <div style={{ background: SURF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 20, overflowY: "auto", maxHeight: 600 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>MONTHLY BUDGETS</div>
              {CATS.map(c => (
                <div key={c.key} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: c.color, letterSpacing: 0.5, marginBottom: 5 }}>{c.label.toUpperCase()}</div>
                  <input
                    type="number"
                    value={md.budgets[c.key] || ""}
                    onChange={e => {
                      const v = parseFloat(e.target.value) || 0;
                      save({ ...md, budgets: { ...md.budgets, [c.key]: v } });
                    }}
                    placeholder="0.00"
                    style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: 6, color: TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: MUTED, letterSpacing: 1 }}>TOTAL BUDGET</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: MUTED }}>{fmtT(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
