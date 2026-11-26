import { useEffect, useRef, useState } from "react";
import { buildFinancialContext } from "../../utils/financialContext.js";

const SUGGESTIONS = {
  en: ["Where did I spend the most this month?", "Am I over budget?", "Compare this month to last month", "How are my savings goals doing?"],
  ru: ["На что я потратил больше всего в этом месяце?", "Я превысил бюджет?", "Сравни этот месяц с прошлым", "Как продвигаются мои цели накопления?"],
};

const CHAT_POSITION_KEY = "xpns_chat_position_v1";
const CHAT_BUTTON_SIZE = 54;
const CHAT_EDGE_GAP = 12;

function readChatPosition() {
  const fallback = {
    x: typeof window === "undefined" ? 16 : Math.max(CHAT_EDGE_GAP, window.innerWidth - CHAT_BUTTON_SIZE - 16),
    y: typeof window === "undefined" ? 16 : Math.max(CHAT_EDGE_GAP, window.innerHeight - CHAT_BUTTON_SIZE - 16),
  };
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_POSITION_KEY) || "null");
    if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
      return {
        x: Math.max(CHAT_EDGE_GAP, Math.min(saved.x, window.innerWidth - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
        y: Math.max(CHAT_EDGE_GAP, Math.min(saved.y, window.innerHeight - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
      };
    }
  } catch {
    // Use the default corner if browser storage is unavailable.
  }
  return fallback;
}

function saveChatPosition(position) {
  try {
    localStorage.setItem(CHAT_POSITION_KEY, JSON.stringify(position));
  } catch {
    // The widget still moves for this session if browser storage is unavailable.
  }
}

function formatInline(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => (
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>
  ));
}

function formatText(text, T) {
  return text.split("\n").map((line, lineIndex) => {
    const isBullet = line.startsWith("- ") || line.startsWith("• ");
    return (
      <span key={lineIndex} style={{ display: "block", minHeight: line ? undefined : 8 }}>
        {isBullet && <span style={{ color: T.GREEN }}>• </span>}
        {formatInline(isBullet ? line.slice(2) : line)}
      </span>
    );
  });
}

export default function ChatWidget({ T, config, goals, year, month, monthData, ai, updateAI, isMobile, chat }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [setupReady, setSetupReady] = useState(false);
  const [chatPosition, setChatPosition] = useState(readChatPosition);
  const { messages, isLoading, error, sendMessage, stop, clear } = chat;
  const listRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const inputRef = useRef(null);
  const setupKeyRef = useRef(null);
  const setupModelRef = useRef(null);

  useEffect(() => {
    if (isOpen && ai.apiKey) inputRef.current?.focus();
  }, [isOpen, ai.apiKey]);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen, error]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = event => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);
  useEffect(() => {
    const onResize = () => {
      setChatPosition(previous => {
        const next = {
          x: Math.max(CHAT_EDGE_GAP, Math.min(previous.x, window.innerWidth - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
          y: Math.max(CHAT_EDGE_GAP, Math.min(previous.y, window.innerHeight - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
        };
        saveChatPosition(next);
        return next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePointerDown = event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: chatPosition.x,
      startY: chatPosition.y,
      position: chatPosition,
    };
    draggedRef.current = false;
  };

  const handlePointerMove = event => {
    if (!dragRef.current) return;
    const drag = dragRef.current;
    const deltaX = event.clientX - drag.pointerX;
    const deltaY = event.clientY - drag.pointerY;
    if (!draggedRef.current && Math.hypot(deltaX, deltaY) < 6) return;
    draggedRef.current = true;
    drag.position = {
      x: Math.max(CHAT_EDGE_GAP, Math.min(drag.startX + deltaX, window.innerWidth - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
      y: Math.max(CHAT_EDGE_GAP, Math.min(drag.startY + deltaY, window.innerHeight - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP)),
    };
    setChatPosition(drag.position);
  };

  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const position = dragRef.current.position;
    dragRef.current = null;
    if (!draggedRef.current) return;
    const maxX = Math.max(CHAT_EDGE_GAP, window.innerWidth - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP);
    const snapped = {
      x: position.x + CHAT_BUTTON_SIZE / 2 < window.innerWidth / 2 ? CHAT_EDGE_GAP : maxX,
      y: position.y,
    };
    setChatPosition(snapped);
    saveChatPosition(snapped);
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    draggedRef.current = false;
  };

  const submit = async text => {
    const content = (text ?? draft).trim();
    if (!content || isLoading) return;
    setDraft("");
    const financialContext = buildFinancialContext({ config, goals, year, month, monthData });
    await sendMessage(content, { ai, financialContext, language: config.lang });
  };

  const viewportWidth = typeof window === "undefined" ? 390 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 844 : window.innerHeight;
  const panelWidth = Math.min(isMobile ? 360 : 380, viewportWidth - CHAT_EDGE_GAP * 2);
  const preferredPanelHeight = isMobile ? Math.min(520, viewportHeight * 0.68) : 560;
  const roomAbove = chatPosition.y - CHAT_EDGE_GAP * 2;
  const roomBelow = viewportHeight - chatPosition.y - CHAT_BUTTON_SIZE - CHAT_EDGE_GAP * 2;
  const panelOpensAbove = roomAbove >= roomBelow;
  const panelHeight = Math.max(180, Math.min(preferredPanelHeight, panelOpensAbove ? roomAbove : roomBelow));
  const panelOnLeft = chatPosition.x + CHAT_BUTTON_SIZE / 2 < viewportWidth / 2;
  const panelStyle = {
    position: "fixed", zIndex: 1000,
    ...(panelOnLeft ? { left: CHAT_EDGE_GAP } : { right: CHAT_EDGE_GAP }),
    ...(panelOpensAbove ? { bottom: viewportHeight - chatPosition.y + 10 } : { top: chatPosition.y + CHAT_BUTTON_SIZE + 10 }),
    width: panelWidth, height: panelHeight, maxHeight: "calc(100dvh - 24px)",
    display: "flex", flexDirection: "column", overflow: "hidden",
    background: T.SURF, color: T.TEXT, border: `1px solid ${T.BORDER}`,
    borderRadius: 14, boxShadow: "0 18px 60px rgba(0,0,0,.35)",
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace",
  };
  const buttonStyle = {
    border: `1px solid ${T.BORDER2}`, borderRadius: 6, background: "transparent", color: T.MUTED,
    cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: "6px 9px",
  };
  const inputStyle = {
    width: "100%", boxSizing: "border-box", border: `1px solid ${T.BORDER}`, borderRadius: 8,
    background: T.BG, color: T.TEXT, padding: "11px 12px", font: "inherit", fontSize: 13, outline: "none",
  };

  return (
    <>
      {isOpen && (
        <section style={panelStyle} aria-label={config.lang === "ru" ? "Чат-помощник" : "Chat assistant"}>
          <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${T.BORDER}` }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: `${T.GREEN}22`, color: T.GREEN, fontSize: 18 }}>✦</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{config.lang === "ru" ? "Финансовый помощник" : "Expense assistant"}</div>
              <div style={{ fontSize: 10, color: T.MUTED, marginTop: 3 }}>{ai.model}</div>
            </div>
            {messages.length > 0 && <button type="button" onClick={clear} style={buttonStyle} title={config.lang === "ru" ? "Очистить чат" : "Clear chat"}>⌫</button>}
            <button type="button" onClick={() => setIsOpen(false)} style={{ ...buttonStyle, fontSize: 17, lineHeight: 1, padding: "4px 8px" }} aria-label={config.lang === "ru" ? "Закрыть" : "Close"}>×</button>
          </header>

          {!ai.apiKey ? (
            <div key={`${ai.apiKey}:${ai.model}`} style={{ padding: 22, overflowY: "auto" }}>
              <div style={{ fontSize: 23, marginBottom: 8 }}>✦</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{config.lang === "ru" ? "Подключите OpenRouter" : "Connect OpenRouter"}</div>
              <p style={{ color: T.MUTED, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px" }}>
                {config.lang === "ru" ? "Добавьте свой API-ключ, чтобы задавать вопросы о расходах. Он хранится только в этом браузере." : "Add your API key to ask questions about your expenses. It is stored only in this browser."}
              </p>
              <label style={{ display: "block", fontSize: 11, color: T.MUTED, marginBottom: 6 }}>{config.lang === "ru" ? "Ключ OpenRouter" : "OpenRouter API key"}</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input ref={setupKeyRef} autoComplete="off" type={showKey ? "text" : "password"} defaultValue={ai.apiKey} onChange={() => setSetupReady(Boolean(setupKeyRef.current?.value.trim() && setupModelRef.current?.value.trim()))} placeholder="sk-or-v1-…" style={inputStyle} />
                <button type="button" onClick={() => setShowKey(value => !value)} style={buttonStyle}>{showKey ? (config.lang === "ru" ? "Скрыть" : "Hide") : (config.lang === "ru" ? "Показать" : "Show")}</button>
              </div>
              <label style={{ display: "block", fontSize: 11, color: T.MUTED, margin: "14px 0 6px" }}>{config.lang === "ru" ? "Модель" : "Model"}</label>
              <input ref={setupModelRef} list="chat-model-presets" defaultValue={ai.model} onChange={() => setSetupReady(Boolean(setupKeyRef.current?.value.trim() && setupModelRef.current?.value.trim()))} style={inputStyle} />
              <datalist id="chat-model-presets"><option value="openai/gpt-4o-mini" /><option value="google/gemini-2.0-flash-001" /><option value="meta-llama/llama-3.3-70b-instruct:free" /></datalist>
              <button type="button" disabled={!setupReady} onClick={() => updateAI({ apiKey: setupKeyRef.current?.value.trim() || "", model: setupModelRef.current?.value.trim() || ai.model })} style={{ width: "100%", marginTop: 14, padding: 11, border: 0, borderRadius: 7, background: T.GREEN, color: "#07110a", font: "inherit", fontWeight: 700, cursor: "pointer", opacity: setupReady ? 1 : 0.5 }}>
                {config.lang === "ru" ? "Сохранить и начать" : "Save and start"}
              </button>
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" style={{ display: "block", color: T.GREEN, fontSize: 11, marginTop: 12 }}>{config.lang === "ru" ? "Получить API-ключ ↗" : "Get an API key ↗"}</a>
              <p style={{ color: T.MUTED, fontSize: 10, lineHeight: 1.5, marginTop: 16 }}>{config.lang === "ru" ? "При отправке вопроса краткая сводка расходов передаётся OpenRouter и выбранной модели. Не включайте секретную информацию." : "When you ask a question, a compact spending summary is sent to OpenRouter and your selected model. Don’t include sensitive information."}</p>
            </div>
          ) : (
            <>
              <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.length === 0 ? (
                  <div style={{ margin: "auto 0", padding: "12px 2px" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", background: `${T.GREEN}22`, color: T.GREEN, fontSize: 20, marginBottom: 14 }}>✦</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{config.lang === "ru" ? "Спросите о своих деньгах" : "Ask about your money"}</div>
                    <div style={{ color: T.MUTED, fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>{config.lang === "ru" ? "Я помогу понять расходы, бюджеты и цели накопления." : "I can help you understand your spending, budgets, and savings goals."}</div>
                    <div style={{ display: "grid", gap: 7 }}>
                      {SUGGESTIONS[config.lang === "ru" ? "ru" : "en"].map(suggestion => <button key={suggestion} type="button" onClick={() => submit(suggestion)} style={{ ...buttonStyle, textAlign: "left", padding: "9px 10px", color: T.TEXT }}>{suggestion} <span style={{ color: T.GREEN, float: "right" }}>↗</span></button>)}
                    </div>
                  </div>
                ) : messages.map((message, index) => (
                  <div key={`${index}-${message.role}`} style={{ alignSelf: message.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%", background: message.role === "user" ? `${T.GREEN}20` : T.SURF2, border: `1px solid ${message.role === "user" ? `${T.GREEN}44` : T.BORDER2}`, borderRadius: 10, padding: "10px 12px", fontSize: 12, lineHeight: 1.65, overflowWrap: "anywhere" }}>
                    {message.content ? formatText(message.content, T) : isLoading && index === messages.length - 1 ? <span style={{ color: T.MUTED }}>{config.lang === "ru" ? "Думаю…" : "Thinking…"}</span> : null}
                  </div>
                ))}
                {error && <div role="alert" style={{ color: T.RED, background: `${T.RED}12`, border: `1px solid ${T.RED}44`, borderRadius: 8, padding: 10, fontSize: 11, lineHeight: 1.5 }}>{error}</div>}
              </div>
              <div style={{ borderTop: `1px solid ${T.BORDER}`, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: T.BG, border: `1px solid ${T.BORDER}`, borderRadius: 9, padding: 7 }}>
                  <textarea ref={inputRef} rows={1} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder={config.lang === "ru" ? "Спросите о расходах…" : "Ask about your expenses…"} style={{ flex: 1, minWidth: 0, maxHeight: 100, resize: "none", border: 0, outline: 0, background: "transparent", color: T.TEXT, font: "inherit", fontSize: 12, lineHeight: 1.5, padding: "5px 4px" }} />
                  {isLoading ? <button type="button" onClick={stop} title={config.lang === "ru" ? "Остановить" : "Stop"} style={{ ...buttonStyle, background: T.SURF2, color: T.RED, flexShrink: 0 }}>■</button> : <button type="button" onClick={() => submit()} disabled={!draft.trim()} title={config.lang === "ru" ? "Отправить" : "Send"} style={{ ...buttonStyle, background: T.GREEN, borderColor: T.GREEN, color: "#07110a", fontWeight: 700, flexShrink: 0, opacity: draft.trim() ? 1 : 0.45 }}>↑</button>}
                </div>
                <div style={{ fontSize: 9, color: T.MUTED, textAlign: "center", marginTop: 8 }}>{config.lang === "ru" ? "Ответы могут содержать ошибки · только чтение" : "AI can make mistakes · read-only assistant"}</div>
              </div>
            </>
          )}
        </section>
      )}
      {!isOpen && <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={() => {
          if (draggedRef.current) {
            draggedRef.current = false;
            return;
          }
          setIsOpen(true);
        }}
        aria-label={config.lang === "ru" ? "Открыть или переместить помощника" : "Open or move assistant"}
        title={config.lang === "ru" ? "Перетащите, чтобы переместить" : "Drag to move"}
        style={{ position: "fixed", zIndex: 1001, left: chatPosition.x, top: chatPosition.y, width: CHAT_BUTTON_SIZE, height: CHAT_BUTTON_SIZE, borderRadius: "50%", border: `1px solid ${T.GREEN}`, background: T.GREEN, color: "#07110a", boxShadow: "0 8px 26px rgba(0,0,0,.3)", fontSize: 22, cursor: "grab", display: "grid", placeItems: "center", touchAction: "none", userSelect: "none" }}
      >
        ✦
      </button>}
    </>
  );
}
