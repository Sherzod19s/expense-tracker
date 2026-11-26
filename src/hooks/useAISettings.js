import { useCallback, useState } from "react";

export const AI_SETTINGS_KEY = "xpns_ai_v1";
export const CHAT_HISTORY_KEY = "xpns_chat_v1";
export const DEFAULT_AI_MODEL = "openai/gpt-4o-mini";

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export function useAISettings() {
  const [ai, setAI] = useState(() => {
    const saved = readStored(AI_SETTINGS_KEY, {});
    return {
      apiKey: typeof saved.apiKey === "string" ? saved.apiKey : "",
      model: typeof saved.model === "string" && saved.model.trim() ? saved.model : DEFAULT_AI_MODEL,
    };
  });

  const updateAI = useCallback((patch) => {
    setAI(prev => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(next));
      } catch {
        // Keep the in-memory setting if browser storage is unavailable.
      }
      return next;
    });
  }, []);

  return { ai, updateAI };
}
