export default function TabBar({ T, tabs, view, setView }) {
  return (
    <div style={{ background: T.BG, borderBottom: `1px solid ${T.BORDER2}`, padding: "0 20px", display: "flex", gap: 0, overflowX: "auto" }}>
      {tabs.map(([v, label]) => (
        <button
          key={v}
          onClick={() => setView(v)}
          style={{
            padding: "10px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            background: "transparent", color: view === v ? T.GREEN : T.MUTED, border: "none",
            borderBottom: `2px solid ${view === v ? T.GREEN : "transparent"}`,
            fontWeight: view === v ? 600 : 400, outline: "none", whiteSpace: "nowrap",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
