# Ledger — Personal Finance Dashboard

A personal expense tracker built with React and Vite for a college project.
It records income and expenses, shows a live summary, tracks a monthly
budget, and charts spending by category — all persisted locally in the
browser, with no backend or login required.

## Features

- **Dashboard** — a hero balance figure, income/expense/transaction-count
  summary cards, a quick-add transaction form, a spending-by-category donut
  chart, a monthly budget tracker with a progress bar and over-budget
  warning, a browsable monthly summary, and a "recent transactions" list.
- **Transactions page** — the full transaction history with filtering by
  category and type, sorting (newest, oldest, highest, lowest amount), and
  a "clear all data" option.
- **Add transactions** — a validated form (type, amount, category,
  description, date) that blocks zero/negative/non-numeric amounts and
  empty descriptions, with inline, accessible error messages.
- **Delete with confirmation** — every delete (single transaction or
  clear-all) goes through a confirmation dialog before anything is removed.
- **Editable monthly budget** — set your own budget; the app warns you the
  moment your spending for the current month goes over it.
- **Sample data** — an optional "Load sample data" button (shown only when
  the tracker is empty) fills in ~3 months of realistic example
  transactions, so the dashboard, chart, and budget states aren't empty on
  a first look.
- **Responsive** — a single-column, hamburger-nav layout on phones; a
  two-column dashboard and a real data table on larger screens. The
  transaction table becomes a stack of labeled cards on narrow screens
  instead of scrolling sideways.
- **Accessible by construction** — every input has a real `<label>`, icon
  buttons have `aria-label`s, the delete dialog traps focus and returns it
  on close, colors are never the only signal (income/expense/warnings all
  carry a text label or sign as well), and the whole page respects
  `prefers-reduced-motion`.

## Tech Stack

- **React 19** with function components and hooks only (no class components)
- **Vite** as the build tool and dev server
- **React Router DOM** for the Dashboard / Transactions routes
- **Plain CSS** (one stylesheet, CSS custom properties for the design
  tokens — no Tailwind, no CSS framework)
- **lucide-react** for the handful of functional icons (menu, delete, edit,
  warning, trend arrows)
- **localStorage** as the only persistence layer — nothing leaves the
  browser

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint over the project
```

## Folder Structure

```
src/
├── assets/                  (empty — no static image assets used)
├── components/
│   ├── Layout.jsx           Header, responsive nav, skip link, <Outlet />
│   ├── SummaryCards.jsx     Balance hero + income/expense/count cards
│   ├── TransactionForm.jsx  Add-transaction form with validation
│   ├── TransactionList.jsx  Table/list of transactions + delete dialog
│   ├── TransactionItem.jsx  One transaction row
│   ├── FilterBar.jsx        Category/type/sort controls (Transactions page)
│   ├── SpendingChart.jsx    Donut chart + legend, expenses by category
│   ├── BudgetCard.jsx       Budget figures, progress bar, edit form
│   ├── MonthlySummary.jsx   Month picker + that month's totals
│   ├── ConfirmDialog.jsx    Reusable "are you sure?" dialog
│   └── FormField.jsx        Label/hint/error wrapper shared by two forms
├── hooks/
│   └── useLocalStorage.js   Generic localStorage-synced state + loading flag
├── pages/
│   ├── Dashboard.jsx        "/" — composes the components above
│   └── Transactions.jsx     "/transactions" — filterable full history
├── utils/
│   ├── constants.js         Categories, storage keys, chart colors, budget default
│   ├── formatCurrency.js    Currency formatting (Rs, configurable)
│   ├── transactionUtils.js  IDs, validation, dates, totals, filter/sort
│   ├── chartUtils.js        Donut-chart percentage/gradient math
│   └── sampleData.js        Generates the optional demo dataset
├── App.jsx                  Routes + the app's lifted state and handlers
├── main.jsx                 Entry point (StrictMode + BrowserRouter)
└── index.css                Design tokens and every component's styles
```

This is a superset of the originally-specified component list (Layout,
SummaryCards, TransactionForm, TransactionList, TransactionItem, FilterBar,
SpendingChart, BudgetCard) — `MonthlySummary` and `ConfirmDialog` were split
out because the confirmation dialog is reused in two places (delete one
transaction, clear all) and the monthly browser is a distinct, self-contained
piece of UI; `FormField` was factored out because the transaction form and
the budget-edit form share the same label/hint/error markup. `chartUtils.js`
and `sampleData.js` keep `transactionUtils.js` focused on core transaction
logic rather than chart math or demo fixtures.

## How Data Is Stored

Everything lives in the browser's `localStorage`, under two keys:

- `expense_tracker_transactions` — a JSON array of transaction objects
  (`{ id, type, amount, category, description, date }`)
- `expense_tracker_budget` — a single JSON number, the monthly budget

The `useLocalStorage` hook (`src/hooks/useLocalStorage.js`) handles both. On
mount, it reads and `JSON.parse`s the stored value inside a `try/catch` —
if the key is missing, the JSON is malformed, or the parsed value doesn't
look like real transaction/budget data, it quietly falls back to an empty
list or the default budget instead of crashing. Both the Dashboard and
Transactions pages show a brief loading state while this initial read is in
flight, so the UI never flashes an "empty" state before real data has had a
chance to load. Every later change (adding, deleting, editing the budget) is
written back to `localStorage` automatically.

## React Concepts Demonstrated

- **`useState`** — form inputs, filters, the mobile menu, dialog state, and
  the two localStorage-backed values (transactions, budget)
- **`useEffect`** — reading from and writing to `localStorage`, the
  auto-dismissing form success message, closing the mobile menu on Escape,
  scrolling to top on route change, driving the native `<dialog>`'s
  `showModal()`/`close()` from React state, and focusing the budget input
  when its edit form opens
- **`useId`** — generating collision-safe ids to link labels to inputs
- **`useMemo`** — avoiding repeated work when computing recent
  transactions, this month's spending, and the list of months with data
- **Custom hooks** — `useLocalStorage`, shared by both persisted values
- **Props (parent → child)** — all app state and handlers are lifted to
  `App.jsx` and passed down through pages into components; nothing here
  uses Context or a state library
- **`.map()` with stable keys** — every list (transactions, categories,
  chart segments, months, nav links) is keyed by a real id or a unique
  value, never by array index
- **Controlled forms** — every input's value comes from state and every
  change goes through `onChange`; both forms validate on submit and show
  inline errors rather than relying on browser popups
- **Conditional rendering** — loading states, empty states (no data at all
  vs. "no results for this filter" are different messages), the
  over-budget warning, and the edit-vs-display mode of the budget card
- **React Router** — a shared `Layout` route with two child routes,
  `NavLink` for active-state nav highlighting, and `Link` for in-page
  navigation
