## 💸 Expense Tracker

A clean, keyboard-friendly monthly expense tracker built with React + Vite. No accounts, no servers, no tracking — your data stays in your browser.

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
- **100% local** — built with `localStorage`. No signup, no cloud, no analytics.

---

## How to use it

1. Open the [live demo](https://expense-tracker-tisw.vercel.app).
2. Pick your currency in **Settings**, customize your categories.
3. Set monthly budgets and income in **Budget & Income**.
4. Log expenses in **Daily Log** — click a cell, type a number, hit Enter.
5. Review your month in **Summary**.
6. Periodically export a CSV backup from Settings → Data & Backup.

---

## Privacy

Your data never leaves your browser. There's no account system, no database, nothing sent to a server. Open DevTools → Application → Local Storage and you'll see it all sitting there in plain JSON. Clear your browser data and it's gone forever (so download CSV backups if it matters to you).

Each visitor has their own isolated data — sharing the link doesn't share your numbers.

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
