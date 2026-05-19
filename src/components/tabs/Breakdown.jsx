import { useMemo } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { listMonthKeys, readJSON } from "../../hooks/useStorage.js";

const buildAllMonthsData = () => {
  return listMonthKeys().map(({ key, year, month }) => {
    const data = readJSON(key);
    if (!data) return null;
    const catSums = {};
    let total = 0;
    Object.values(data.days || {}).forEach(dayObj => {
      Object.entries(dayObj).forEach(([catId, amt]) => {
        catSums[catId] = (catSums[catId] || 0) + amt;
        total += amt;
      });
    });
    const incomeTotal = Object.values(data.income || {}).reduce((a, b) => a + b, 0);
    return { year, month, total, incomeTotal, catSums };
  }).filter(Boolean);
};

export default function Breakdown({ T, t, CATS, CUR, breakdownRange, setBreakdownRange, year, month, isMobile, fmtT, fmtC, refreshKey }) {
  const allMonthsData = useMemo(() => buildAllMonthsData(), [refreshKey]);

  const filtered = useMemo(() => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth();

    if (breakdownRange === "month") {
      return allMonthsData.filter(e => e.year === year && e.month === month);
    }
    if (breakdownRange === "3months") {
      const cutoff = new Date(curY, curM - 2, 1);
      return allMonthsData.filter(e => new Date(e.year, e.month, 1) >= cutoff);
    }
    if (breakdownRange === "year") {
      return allMonthsData.filter(e => e.year === curY);
    }
    return allMonthsData;
  }, [allMonthsData, breakdownRange, year, month]);

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

      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: "14px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: T.MUTED, letterSpacing: 1, fontWeight: 700 }}>{t.totalSpent_period.toUpperCase()}</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: aggregated.total > 0 ? T.RED : T.MUTED }}>{fmtC(aggregated.total)}</span>
      </div>

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
