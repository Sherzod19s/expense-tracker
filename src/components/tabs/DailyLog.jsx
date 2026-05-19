import { useState, useRef } from "react";
import DayCardView from "../ui/DayCardView.jsx";
import { daysInMonth } from "../../constants/defaults.js";

function EmptyState({ T, text }) {
  return <div style={{ padding: 40, textAlign: "center", color: T.MUTED, fontSize: 13 }}>{text}</div>;
}

export default function DailyLog({
  T, t, CATS, CUR, fmt, fmtT, fmtC,
  year, month, monthData, setDay,
  isMobile, config, update, setView,
}) {
  const nd = daysInMonth(year, month);
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [mobileDay, setMobileDay] = useState(new Date().getDate());
  const inputRef = useRef(null);

  // Derived totals
  const catTotals = Object.fromEntries(
    CATS.map(c => [c.id, Array.from({ length: nd }, (_, i) => monthData.days[i + 1]?.[c.id] || 0).reduce((a, b) => a + b, 0)])
  );
  const dayTotals = Object.fromEntries(
    Array.from({ length: nd }, (_, i) => i + 1).map(d => [d, CATS.reduce((s, c) => s + (monthData.days[d]?.[c.id] || 0), 0)])
  );
  const totalSpent = CATS.reduce((s, c) => s + catTotals[c.id], 0);
  const totalBudget = CATS.reduce((s, c) => s + (monthData.budgets[c.id] || 0), 0);

  const startEdit = (day, key) => {
    const cur = monthData.days[day]?.[key];
    setEditCell({ day, key });
    setEditVal(cur ? cur.toString() : "");
    setTimeout(() => inputRef.current?.select(), 20);
  };

  const commitEdit = () => {
    if (editCell) setDay(editCell.day, editCell.key, editVal);
    setEditCell(null);
  };

  const smallBtn = {
    background: "transparent", border: `1px solid ${T.BORDER2}`, color: T.MUTED,
    padding: "0 8px", height: 26, borderRadius: 4, cursor: "pointer",
    fontFamily: "inherit", fontSize: 13, outline: "none",
  };

  return (
    <>
      {/* First-run intro banner */}
      {!config.hasSeenIntro && CATS.length > 0 && (
        <div style={{ margin: 16, padding: 16, background: T.SURF, border: `1px solid ${T.GREEN}`, borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.GREEN, marginBottom: 6 }}>{t.introTitle}</div>
          <div style={{ fontSize: 13, color: T.TEXT, lineHeight: 1.5, marginBottom: 12 }}>{t.introBody}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => { setView("settings"); update({ hasSeenIntro: true }); }}
              style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.GREEN, borderColor: T.GREEN }}
            >{t.introOpenSettings}</button>
            <button
              onClick={() => update({ hasSeenIntro: true })}
              style={{ ...smallBtn, padding: "8px 14px", height: "auto" }}
            >{t.introCta}</button>
          </div>
        </div>
      )}

      {isMobile ? (
        <DayCardView
          T={T} t={t} CATS={CATS} monthData={monthData}
          year={year} month={month} nd={nd}
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
                        const val = monthData.days[day]?.[c.id];
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
                    <td key={c.id} style={{ padding: "6px 8px", textAlign: "right", color: monthData.budgets[c.id] > 0 ? T.MUTED : T.BORDER2, borderRight: `1px solid ${T.BORDER2}` }}>
                      {monthData.budgets[c.id] > 0 ? fmtT(monthData.budgets[c.id]) : "—"}
                    </td>
                  ))}
                  <td style={{ padding: "6px 12px", textAlign: "right", color: T.MUTED }}>{totalBudget > 0 ? fmtT(totalBudget) : "—"}</td>
                </tr>
                <tr style={{ background: T.BG }}>
                  <td style={{ padding: "6px 12px", fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, borderRight: `1px solid ${T.BORDER2}`, position: "sticky", left: 0, background: T.BG }}>{t.remaining}</td>
                  {CATS.map(c => {
                    const rem = (monthData.budgets[c.id] || 0) - catTotals[c.id];
                    const hasBudget = monthData.budgets[c.id] > 0;
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
  );
}
