export default function BudgetIncome({ T, t, CATS, INCS, CUR, monthData, setBudget, setIncome, fmtC, year, month, isMobile }) {
  const totalBudget = CATS.reduce((s, c) => s + (monthData.budgets[c.id] || 0), 0);
  const totalIncome = INCS.reduce((s, src) => s + (monthData.income[src.id] || 0), 0);

  const inputStyle = {
    width: "100%", background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
    color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
  };

  return (
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
                value={monthData.income[src.id] || ""}
                onChange={e => setIncome(src.id, parseFloat(e.target.value) || 0)}
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
                value={monthData.budgets[c.id] || ""}
                onChange={e => setBudget(c.id, parseFloat(e.target.value) || 0)}
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
  );
}
