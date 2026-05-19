export default function Summary({ T, t, CATS, monthData, fmtT, fmtC, year, month, isMobile }) {
  // Derived totals
  const catTotals = Object.fromEntries(
    CATS.map(c => {
      const total = Object.values(monthData.days || {}).reduce((s, day) => s + (day[c.id] || 0), 0);
      return [c.id, total];
    })
  );
  const totalSpent = CATS.reduce((s, c) => s + catTotals[c.id], 0);
  const totalBudget = CATS.reduce((s, c) => s + (monthData.budgets[c.id] || 0), 0);
  const totalIncome = Object.values(monthData.income || {}).reduce((s, v) => s + v, 0);
  const net = totalIncome - totalSpent;
  const netColor = totalIncome === 0 ? T.MUTED : net >= 0 ? T.GREEN : T.RED;

  return (
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
          const bpct = monthData.budgets[c.id] > 0 ? (catTotals[c.id] / monthData.budgets[c.id]) * 100 : null;
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
  );
}
