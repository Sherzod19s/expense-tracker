import { useState } from "react";

function GoalCard({ goal, T, t, CUR, isMobile, fmtT, fmtC, onEdit, onDelete, onToggleComplete, onAddSaved, onSetSaved }) {
  const [quickAddVal, setQuickAddVal] = useState("");

  const now = new Date();
  const target = new Date(goal.targetDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((target - now) / msPerDay);
  const monthsLeft = daysLeft / 30.44;
  const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const monthlyRequired = monthsLeft > 0 && remaining > 0 ? remaining / monthsLeft : 0;

  const isOverdue = !goal.completed && daysLeft < 0 && goal.savedAmount < goal.targetAmount;
  const isAchieved = goal.savedAmount >= goal.targetAmount;

  let statusColor = T.GREEN;
  let statusLabel = null;
  if (goal.completed || isAchieved) {
    statusColor = T.GREEN;
    statusLabel = t.achieved;
  } else if (isOverdue) {
    statusColor = T.RED;
    statusLabel = t.overdue;
  }

  const handleQuickAdd = () => {
    const v = parseFloat(quickAddVal);
    if (!isNaN(v) && v !== 0) {
      onAddSaved(v);
      setQuickAddVal("");
    }
  };

  return (
    <div style={{ background: T.SURF, border: `1px solid ${isAchieved || goal.completed ? T.GREEN : isOverdue ? T.RED : T.BORDER}`, borderRadius: 8, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.TEXT, overflow: "hidden", textOverflow: "ellipsis" }}>{goal.name}</div>
          {goal.description && <div style={{ fontSize: 12, color: T.MUTED, marginTop: 2 }}>{goal.description}</div>}
        </div>
        {statusLabel && (
          <span style={{ fontSize: 11, color: statusColor, fontWeight: 700, padding: "3px 8px", border: `1px solid ${statusColor}`, borderRadius: 4, whiteSpace: "nowrap" }}>
            {statusLabel}
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: T.MUTED }}>{t.progress}</span>
          <span style={{ color: T.TEXT, fontWeight: 600 }}>{Math.min(progress, 100).toFixed(1)}%</span>
        </div>
        <div style={{ background: T.BORDER2, borderRadius: 4, height: 8, overflow: "hidden" }}>
          <div style={{ background: isAchieved ? T.GREEN : isOverdue ? T.RED : T.GREEN, height: "100%", width: `${Math.min(progress, 100)}%`, borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: T.MUTED }}>
          <span>{fmtC(goal.savedAmount)}</span>
          <span>{fmtC(goal.targetAmount)}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10, padding: "10px 0", borderTop: `1px solid ${T.BORDER2}`, borderBottom: `1px solid ${T.BORDER2}`, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>
            {daysLeft >= 0 ? (monthsLeft >= 1 ? t.monthsLeft.toUpperCase() : t.daysLeft.toUpperCase()) : t.daysLeft.toUpperCase()}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: daysLeft < 0 ? T.RED : T.TEXT, marginTop: 2 }}>
            {daysLeft >= 0 ? (monthsLeft >= 1 ? Math.ceil(monthsLeft) : daysLeft) : daysLeft}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>{t.monthlyRequired.toUpperCase()}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isAchieved ? T.GREEN : T.TEXT, marginTop: 2 }}>
            {isAchieved ? "—" : monthlyRequired > 0 ? fmtC(monthlyRequired) : "—"}
          </div>
        </div>
        <div style={{ gridColumn: isMobile ? "span 2" : "auto" }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5 }}>{t.targetDate.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT, marginTop: 2 }}>
            {new Date(goal.targetDate).toLocaleDateString(t.locale, { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {!goal.completed && !isAchieved && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: T.MUTED, letterSpacing: 0.5, marginBottom: 6 }}>{t.addToSaved.toUpperCase()}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <input
              type="number"
              value={quickAddVal}
              onChange={e => setQuickAddVal(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleQuickAdd(); }}
              placeholder={CUR.symbol}
              style={{
                flex: 1, minWidth: 120, background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
                color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit", outline: "none",
              }}
            />
            <button
              onClick={handleQuickAdd}
              disabled={!quickAddVal}
              style={{ padding: "8px 14px", fontSize: 13, cursor: quickAddVal ? "pointer" : "not-allowed", fontFamily: "inherit", background: T.GREEN, color: "#000", border: "none", borderRadius: 6, fontWeight: 600, outline: "none", opacity: quickAddVal ? 1 : 0.5 }}
            >+</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={onEdit} style={{ flex: 1, minWidth: 0, padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.TEXT, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}>
          {t.editGoal}
        </button>
        <button onClick={onToggleComplete} style={{ flex: 1, minWidth: 0, padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: goal.completed ? T.MUTED : T.GREEN, border: `1px solid ${goal.completed ? T.BORDER : T.GREEN}`, borderRadius: 6, outline: "none" }}>
          {goal.completed ? t.reopen : t.markComplete}
        </button>
        <button onClick={onDelete} style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.RED, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Goals({ T, t, CUR, goals, addGoal, updateGoal, deleteGoal, isMobile, fmtT, fmtC }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", targetAmount: "", savedAmount: "0", targetDate: "" });
  const [filter, setFilter] = useState("active");

  const resetForm = () => {
    setForm({ name: "", description: "", targetAmount: "", savedAmount: "0", targetDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.targetAmount || !form.targetDate) {
      window.alert(t.pleaseFillRequired);
      return;
    }
    const target = parseFloat(form.targetAmount);
    const saved = parseFloat(form.savedAmount) || 0;
    if (isNaN(target) || target <= 0) {
      window.alert(t.pleaseFillRequired);
      return;
    }
    const targetDate = new Date(form.targetDate);
    if (!editingId && targetDate <= new Date()) {
      if (!window.confirm(t.targetMustBeFuture + " Continue anyway?")) return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      targetAmount: target,
      savedAmount: saved,
      targetDate: form.targetDate,
    };
    if (editingId) updateGoal(editingId, payload);
    else addGoal(payload);
    resetForm();
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      description: g.description || "",
      targetAmount: g.targetAmount.toString(),
      savedAmount: g.savedAmount.toString(),
      targetDate: g.targetDate,
    });
    setShowForm(true);
  };

  const handleDelete = (g) => {
    if (!window.confirm(t.confirmDeleteGoal(g.name))) return;
    deleteGoal(g.id);
  };

  const visibleGoals = goals.filter(g => filter === "active" ? !g.completed : g.completed);

  const inputStyle = {
    width: "100%", background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 6,
    color: T.TEXT, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
  };
  const labelStyle = { fontSize: 11, color: T.MUTED, letterSpacing: 0.5, marginBottom: 5, display: "block" };

  return (
    <div style={{ padding: isMobile ? 12 : 20, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["active", t.active], ["completed", t.completed]].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              style={{
                padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                background: filter === v ? T.GREEN : "transparent",
                color: filter === v ? "#000" : T.MUTED,
                border: `1px solid ${filter === v ? T.GREEN : T.BORDER}`,
                borderRadius: 6, fontWeight: filter === v ? 600 : 400, outline: "none",
              }}
            >{label}</button>
          ))}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "8px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              background: T.GREEN, color: "#000", border: "none",
              borderRadius: 6, fontWeight: 600, outline: "none",
            }}
          >{t.addGoal}</button>
        )}
      </div>

      {goals.length === 0 && !showForm && (
        <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 8, padding: 24, marginBottom: 16 }}>
          <div style={{ color: T.TEXT, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{t.goalsEmpty}</div>
          <div style={{ color: T.MUTED, fontSize: 13, lineHeight: 1.6 }}>{t.goalsHint}</div>
        </div>
      )}

      {showForm && (
        <div style={{ background: T.SURF, border: `1px solid ${T.GREEN}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: T.GREEN, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
            {editingId ? t.editGoal.toUpperCase() : t.addGoal.replace("+", "").trim().toUpperCase()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
              <label style={labelStyle}>{t.goalName} *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t.goalNamePh} />
            </div>
            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
              <label style={labelStyle}>{t.goalDescription}</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder={t.goalDescPh} />
            </div>
            <div>
              <label style={labelStyle}>{t.targetAmount} ({CUR.symbol}) *</label>
              <input style={inputStyle} type="number" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} placeholder="10000" />
            </div>
            <div>
              <label style={labelStyle}>{t.currentSaved} ({CUR.symbol})</label>
              <input style={inputStyle} type="number" value={form.savedAmount} onChange={e => setForm({...form, savedAmount: e.target.value})} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>{t.targetDate} *</label>
              <input style={inputStyle} type="date" value={form.targetDate} onChange={e => setForm({...form, targetDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              style={{ padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: T.GREEN, color: "#000", border: "none", borderRadius: 6, fontWeight: 600, outline: "none" }}
            >{t.saveGoal}</button>
            <button
              onClick={resetForm}
              style={{ padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: "transparent", color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 6, outline: "none" }}
            >{t.cancel}</button>
          </div>
        </div>
      )}

      {visibleGoals.length === 0 && goals.length > 0 && (
        <div style={{ color: T.MUTED, fontSize: 13, padding: "30px 0", textAlign: "center" }}>—</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleGoals.map(g => (
          <GoalCard
            key={g.id}
            goal={g}
            T={T} t={t} CUR={CUR} isMobile={isMobile} fmtT={fmtT} fmtC={fmtC}
            onEdit={() => startEdit(g)}
            onDelete={() => handleDelete(g)}
            onToggleComplete={() => updateGoal(g.id, { completed: !g.completed })}
            onAddSaved={(amt) => updateGoal(g.id, { savedAmount: Math.max(0, g.savedAmount + amt) })}
            onSetSaved={(amt) => updateGoal(g.id, { savedAmount: Math.max(0, amt) })}
          />
        ))}
      </div>
    </div>
  );
}
