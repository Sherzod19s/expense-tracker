import { CURRENCIES } from "../../constants/defaults.js";
import { listMonthKeys, readJSON, toCSV, downloadCSV } from "../../hooks/useStorage.js";

export default function Settings({
  T, t, config, update, CATS, INCS, CUR,
  fmtT,
  addCategory, updateCategory, moveCategory, removeCategory,
  addIncomeSource, updateIncomeSource, moveIncomeSource, removeIncomeSource,
  year, month, monthData,
  isMobile,
}) {
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

  // ── Delete category with cascade cleanup of current month ──
  const handleDeleteCategory = (cat) => {
    if (!window.confirm(t.confirmDeleteCat(cat.label))) return;
    removeCategory(cat.id);
    // NOTE: month data cleanup is intentionally NOT done from Settings to keep concerns separated.
    // Past-month data for the deleted ID stays as orphan entries (harmless, no column to render them).
  };

  const handleDeleteIncome = (src) => {
    if (!window.confirm(t.confirmDeleteInc(src.label))) return;
    removeIncomeSource(src.id);
  };

  // ── CSV exports ──
  const exportCurrentMonth = () => {
    const nd = new Date(year, month + 1, 0).getDate();
    const catTotals = Object.fromEntries(
      CATS.map(c => [c.id, Array.from({ length: nd }, (_, i) => monthData.days[i + 1]?.[c.id] || 0).reduce((a, b) => a + b, 0)])
    );
    const dayTotals = Object.fromEntries(
      Array.from({ length: nd }, (_, i) => i + 1).map(d => [d, CATS.reduce((s, c) => s + (monthData.days[d]?.[c.id] || 0), 0)])
    );
    const totalSpent = CATS.reduce((s, c) => s + catTotals[c.id], 0);
    const totalBudget = CATS.reduce((s, c) => s + (monthData.budgets[c.id] || 0), 0);
    const totalIncome = INCS.reduce((s, src) => s + (monthData.income[src.id] || 0), 0);

    const headers = ["Date", "Day", ...CATS.map(c => c.label), "Total"];
    const rows = [headers];

    for (let day = 1; day <= nd; day++) {
      const dt = new Date(year, month, day);
      const dow = dt.toLocaleDateString("en", { weekday: "short" });
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const cats = CATS.map(c => monthData.days[day]?.[c.id] ?? "");
      const total = dayTotals[day] || "";
      rows.push([date, dow, ...cats, total]);
    }

    rows.push([]);
    rows.push(["SPENT", "", ...CATS.map(c => catTotals[c.id] || ""), totalSpent || ""]);
    rows.push(["BUDGET", "", ...CATS.map(c => monthData.budgets[c.id] || ""), totalBudget || ""]);
    rows.push(["REMAINING", "", ...CATS.map(c => {
      const b = monthData.budgets[c.id] || 0;
      return b > 0 ? b - (catTotals[c.id] || 0) : "";
    }), totalBudget > 0 ? totalBudget - totalSpent : ""]);

    rows.push([]);
    rows.push(["INCOME"]);
    rows.push(["Source", "Amount"]);
    INCS.forEach(s => rows.push([s.label, monthData.income[s.id] || ""]));
    rows.push(["TOTAL INCOME", totalIncome || ""]);

    rows.push([]);
    rows.push(["Currency", CUR.code]);

    const filename = `expense-tracker-${year}-${String(month + 1).padStart(2, "0")}.csv`;
    downloadCSV(filename, toCSV(rows));
  };

  const exportAllData = () => {
    const headers = ["Type", "Year", "Month", "Day", "ItemId", "Label", "Amount", "Currency"];
    const rows = [headers];

    const catById = Object.fromEntries(CATS.map(c => [c.id, c.label]));
    const incById = Object.fromEntries(INCS.map(s => [s.id, s.label]));

    listMonthKeys().forEach(({ key, year: y, month: m }) => {
      const data = readJSON(key);
      if (!data) return;
      const sortedDays = Object.entries(data.days || {}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      sortedDays.forEach(([day, entries]) => {
        Object.entries(entries).forEach(([catId, amount]) => {
          rows.push(["expense", y, m + 1, parseInt(day), catId, catById[catId] || "(deleted)", amount, CUR.code]);
        });
      });
      Object.entries(data.budgets || {}).forEach(([catId, amount]) => {
        rows.push(["budget", y, m + 1, "", catId, catById[catId] || "(deleted)", amount, CUR.code]);
      });
      Object.entries(data.income || {}).forEach(([incId, amount]) => {
        rows.push(["income", y, m + 1, "", incId, incById[incId] || "(deleted)", amount, CUR.code]);
      });
    });

    if (rows.length === 1) {
      window.alert(t.noDataExport);
      return;
    }
    downloadCSV("expense-tracker-all.csv", toCSV(rows));
  };

  return (
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 900 }}>

      {/* Preferences */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 18 }}>{t.preferences}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.language}</div>
            <select
              value={config.lang}
              onChange={e => update({ lang: e.target.value })}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            >
              <option value="en" style={{ background: T.BG, color: T.TEXT }}>English</option>
              <option value="ru" style={{ background: T.BG, color: T.TEXT }}>Русский</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.currency}</div>
            <select
              value={CUR.code}
              onChange={e => {
                const cur = CURRENCIES.find(c => c.code === e.target.value);
                if (cur) update({ currency: cur });
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
            <div style={{ fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5 }}>{t.theme}</div>
            <select
              value={config.theme}
              onChange={e => update({ theme: e.target.value })}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            >
              <option value="dark" style={{ background: T.BG, color: T.TEXT }}>{t.dark}</option>
              <option value="light" style={{ background: T.BG, color: T.TEXT }}>{t.light}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>{t.categories}</span>
          <button onClick={addCategory} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>{t.add}</button>
        </div>
        {CATS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>{t.noCategoriesShort}</div>}
        {CATS.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
            <label style={{ position: "relative", width: 22, height: 22, borderRadius: 4, background: c.color, border: `1px solid ${T.BORDER}`, cursor: "pointer", flexShrink: 0 }} title={t.pickColor}>
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
            <button onClick={() => moveCategory(c.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title={t.moveUp}>↑</button>
            <button onClick={() => moveCategory(c.id, 1)} disabled={i === CATS.length - 1} style={{ ...smallBtn, opacity: i === CATS.length - 1 ? 0.3 : 1 }} title={t.moveDown}>↓</button>
            <button onClick={() => handleDeleteCategory(c)} style={dangerBtn} title={t.delete}>✕</button>
          </div>
        ))}
      </div>

      {/* Income sources */}
      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1 }}>{t.incomeSources}</span>
          <button onClick={addIncomeSource} style={{ ...smallBtn, color: T.GREEN, borderColor: T.GREEN }}>{t.add}</button>
        </div>
        {INCS.length === 0 && <div style={{ color: T.MUTED, fontSize: 13, padding: "10px 0" }}>{t.noIncomeShort}</div>}
        {INCS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, background: T.BG, border: `1px solid ${T.BORDER2}`, borderRadius: 6 }}>
            <input
              type="text"
              value={s.label}
              onChange={e => updateIncomeSource(s.id, { label: e.target.value })}
              style={{ ...inputStyle, padding: "6px 10px", flex: 1, minWidth: 0 }}
            />
            <button onClick={() => moveIncomeSource(s.id, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.3 : 1 }} title={t.moveUp}>↑</button>
            <button onClick={() => moveIncomeSource(s.id, 1)} disabled={i === INCS.length - 1} style={{ ...smallBtn, opacity: i === INCS.length - 1 ? 0.3 : 1 }} title={t.moveDown}>↓</button>
            <button onClick={() => handleDeleteIncome(s)} style={dangerBtn} title={t.delete}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 20, marginTop: 20 }}>
        <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>{t.dataBackup}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <button
            onClick={exportCurrentMonth}
            style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.TEXT, borderColor: T.BORDER }}
          >
            ⬇ {t.exportMonth} {t.monthsShort[month]} {year} ({t.csv})
          </button>
          <button
            onClick={exportAllData}
            style={{ ...smallBtn, padding: "8px 14px", height: "auto", color: T.GREEN, borderColor: T.GREEN }}
          >
            ⬇ {t.exportAll} ({t.csv})
          </button>
        </div>
        <div style={{ fontSize: 11, color: T.MUTED, lineHeight: 1.6 }}>
          {t.backupHint}
        </div>
      </div>
    </div>
  );
}
