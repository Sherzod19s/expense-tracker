function EmptyState({ T, text }) {
  return <div style={{ padding: 40, textAlign: "center", color: T.MUTED, fontSize: 13 }}>{text}</div>;
}

export default function DayCardView({ T, t, CATS, monthData, year, month, nd, mobileDay, setMobileDay, dayTotals, fmt, fmtT, fmtC, setDay, CUR }) {
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
          const val = monthData.days[mobileDay]?.[c.id];
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
