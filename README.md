## 💸 Expense Tracker

A clean, keyboard-friendly monthly expense tracker built with React + Vite. No account required; your expense data stays in your browser unless you choose to use the optional AI assistant.

🔗 **[Try it live →](https://expense-tracker-tisw.vercel.app)**

![Expense Tracker screenshot](src/assets/hero.png)

---

## Features

- **Daily log grid** — click any cell to log an expense. 31 days × your categories, with running totals.
- **Customizable categories** — add, rename, recolor, reorder, or delete categories to fit how you actually spend.
- **Income tracking** — log multiple income sources alongside expenses for a true net picture.
- **Monthly budgets** — set a budget per category, watch remaining vs. spent in real time.
- **Summary view** — at-a-glance breakdown of where your money went, with budget usage bars.
- **17 currencies supported** — USD, EUR, GBP, JPY, RUB, UZS, INR, CNY, TRY, BRL, and more.
- **Light & dark themes** — toggle in the header.
- **CSV export** — download your data anytime to keep an Excel backup. Two formats: per-month and full history.
- **Local-first data** — expense records stay in your browser. Optional AI chat sends a compact financial summary to OpenRouter only when you ask a question.

---

## How to use it

1. Open the [live demo](https://expense-tracker-tisw.vercel.app).
2. Pick your currency in **Settings**, customize your categories.
3. Set monthly budgets and income in **Budget & Income**.
4. Log expenses in **Daily Log** — click a cell, type a number, hit Enter.
5. Review your month in **Summary**.
6. Periodically export a CSV backup from Settings → Data & Backup.

---

## AI assistant

Open the floating chat button and add your own [OpenRouter API key](https://openrouter.ai/keys). Choose an OpenRouter model (the default is `openai/gpt-4o-mini`), then ask questions about spending, budgets, recent monthly totals, and savings goals. You can also configure the key and model in Settings → AI Assistant.

The assistant is read-only. The app computes a compact summary locally before sending it along with your question to OpenRouter and the selected model; raw day-by-day entries are not sent. Chat history and the API key are stored in this browser's `localStorage`, separately from expense exports. OpenRouter/model providers may process requests under their own privacy and billing terms. Do not send sensitive information.

## Privacy

Expense data is stored in this browser using `localStorage`. Without using the optional AI assistant, your expense data stays in your browser. If you ask the assistant a question, a summary of the selected month, recent monthly totals, and goals is sent to OpenRouter and your selected model. There is no app account or app-hosted database. Clear your browser data and local records are erased (so download CSV backups if it matters to you).

Each visitor has their own isolated data — sharing the link doesn't share your numbers. The OpenRouter key is never included in CSV exports.

---

## Run locally

```bash
git clone https://github.com/Sherzod19s/expense-tracker.git
cd expense-tracker
npm install
npm run dev
```

Open `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

---

## Tech stack

- **React 18** + **Vite** — fast dev server, instant HMR
- **localStorage** for persistence
- No external state management, no UI library — just plain React with inline styles
- Deployed on **Vercel**

---

## Roadmap

Potentially coming:

- [ ] JSON import/export (round-trip backup + restore)
- [ ] Notes attached to individual entries
- [ ] Recurring expenses (auto-fill rent, subscriptions on the 1st)
- [ ] Year-over-year trends view
- [ ] Mobile-optimized layout
- [ ] Keyboard navigation in the daily log

Suggestions welcome — open an issue.

---

## License

MIT — do whatever you want with it.
