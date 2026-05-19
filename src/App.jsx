import { useState, useEffect } from "react";
import { useConfig } from "./hooks/useConfig.js";
import { useMonthData, useGoals } from "./hooks/useStorage.js";
import TabBar from "./components/ui/TabBar.jsx";
import DailyLog from "./components/tabs/DailyLog.jsx";
import Summary from "./components/tabs/Summary.jsx";
import Breakdown from "./components/tabs/Breakdown.jsx";
import Goals from "./components/tabs/Goals.jsx";
import BudgetIncome from "./components/tabs/BudgetIncome.jsx";
import Settings from "./components/tabs/Settings.jsx";
import Logo from "./components/ui/Logo.jsx";


export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState("log");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [breakdownRange, setBreakdownRange] = useState("month");

  const {
    config, update, T, t, CUR,
    fmt, fmtT, fmtC,
    addCategory, updateCategory, moveCategory, removeCategory,
    addIncomeSource, updateIncomeSource, moveIncomeSource, removeIncomeSource,
  } = useConfig();

  const CATS = config.categories;
  const INCS = config.incomeSources;

  const { data: monthData, setDay, setBudget, setIncome } = useMonthData(year, month);
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();

  // Track viewport changes
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Header derived numbers
  const totalSpent = CATS.reduce((s, c) => {
    const total = Object.values(monthData.days || {}).reduce((dSum, day) => dSum + (day[c.id] || 0), 0);
    return s + total;
  }, 0);
  const totalIncome = INCS.reduce((s, src) => s + (monthData.income[src.id] || 0), 0);
  const net = totalIncome - totalSpent;
  const netColor = totalIncome === 0 ? T.MUTED : net >= 0 ? T.GREEN : T.RED;

  const tabs = [
    ["log", t.dailyLog],
    ["summary", t.summary],
    ["breakdown", t.breakdown_tab],
    ["goals", t.goals_tab],
    ["budget", t.budgetIncome],
    ["settings", t.settings],
  ];

  const smallBtn = {
    background: "transparent", border: `1px solid ${T.BORDER2}`, color: T.MUTED,
    padding: "0 8px", height: 26, borderRadius: 4, cursor: "pointer",
    fontFamily: "inherit", fontSize: 13, outline: "none",
  };

  return (
    <div style={{ fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace", background: T.BG, color: T.TEXT, minHeight: "100vh" }}>

      {/* ══════ HEADER ══════ */}
      <div style={{ background: T.SURF, borderBottom: `1px solid ${T.BORDER}` }}>
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: T.TEXT, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 8 }}>
                  <Logo size={22} color={T.GREEN} />
                  {t.appName}
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
                onClick={() => update({ theme: config.theme === "dark" ? "light" : "dark" })}
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
              <button key={i} onClick={() => setMonth(i)} style={{
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

      <TabBar T={T} tabs={tabs} view={view} setView={setView} />

      {/* ══════ TAB ROUTING ══════ */}
      {view === "log" && (
        <DailyLog
          T={T} t={t} CATS={CATS} CUR={CUR}
          fmt={fmt} fmtT={fmtT} fmtC={fmtC}
          year={year} month={month}
          monthData={monthData} setDay={setDay}
          isMobile={isMobile}
          config={config} update={update}
          setView={setView}
        />
      )}
      {view === "summary" && (
        <Summary
          T={T} t={t} CATS={CATS}
          monthData={monthData}
          fmtT={fmtT} fmtC={fmtC}
          year={year} month={month}
          isMobile={isMobile}
        />
      )}
      {view === "breakdown" && (
        <Breakdown
          T={T} t={t} CATS={CATS} CUR={CUR}
          breakdownRange={breakdownRange} setBreakdownRange={setBreakdownRange}
          year={year} month={month}
          isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
          refreshKey={`${year}-${month}-${Object.keys(monthData.days || {}).length}`}
        />
      )}
      {view === "goals" && (
        <Goals
          T={T} t={t} CUR={CUR}
          goals={goals}
          addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal}
          isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
        />
      )}
      {view === "budget" && (
        <BudgetIncome
          T={T} t={t} CATS={CATS} INCS={INCS} CUR={CUR}
          monthData={monthData}
          setBudget={setBudget} setIncome={setIncome}
          fmtC={fmtC}
          year={year} month={month}
          isMobile={isMobile}
        />
      )}
      {view === "settings" && (
        <Settings
          T={T} t={t} config={config} update={update}
          CATS={CATS} INCS={INCS} CUR={CUR}
          fmtT={fmtT}
          addCategory={addCategory} updateCategory={updateCategory}
          moveCategory={moveCategory} removeCategory={removeCategory}
          addIncomeSource={addIncomeSource} updateIncomeSource={updateIncomeSource}
          moveIncomeSource={moveIncomeSource} removeIncomeSource={removeIncomeSource}
          year={year} month={month} monthData={monthData}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
