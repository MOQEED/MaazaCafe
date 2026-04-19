# Maaza Cafe — Web Application

A single-page React application for a small cafe: menu ordering, cash-style billing, sales reports, menu administration, owner-only areas, and a simple **Hisaab** (ledger) for miscellaneous entries. Data is stored in the browser **localStorage** (no backend server).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19 |
| Routing | React Router DOM 7 |
| Build tool | Vite 8 |
| PDF / print helpers | jsPDF (via utils) |
| Spreadsheets | SheetJS (`xlsx`) |

---

## Getting started

```bash
cd MaazaCafe
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

Other scripts:

- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint

---

## Application structure

```
src/
  App.jsx              # Routes, auth bootstrap, navbar when logged in
  main.jsx             # React root
  utils/
    authDefaults.js    # Default logins + migration; bill day key helper
    storage.js         # localStorage JSON helpers
    pdf.js             # Print / PDF utilities
  components/
    Login/             # Main app login
    Navbar/            # Navigation + logout
    Menu/              # Menu items, quantities, save bill
    Cash/              # Cash register–style view
    Admin/             # Menu CRUD, credential settings
    Reports/           # Sales by date, Excel export, print, delete by date
    Hisaab/            # Name/amount ledger with timestamps
    OwnerGate/         # Extra gate for owner-only pages
```

---

## Authentication model

### 1. Main app login (home screen)

- Unlocks **Menu**, **Cash**, and navigation.
- Credentials: `localStorage` keys `adminUser` and `adminPass`.
- Defaults (applied if missing): **`Moqeed`** / **`Moqeed@786`**.
- Can be changed from **Admin** → “Main app login”.

### 2. Owner’s area (Admin, Reports, Hisaab)

- Separate from the main login. Wrapped by **`OwnerGate`** (formerly “StaffGate”).
- After main login, visiting **Admin**, **Reports**, or **Hisaab** shows an **Owner’s area** unlock screen until valid owner credentials are entered.
- Credentials: `ownerUser`, `ownerPass`; session flag: `ownerAuth`.
- Defaults (if no values): **`maaza_staff`** / **`Staff@786`**.
- Configurable under **Admin** → “Owner’s login”.
- **Logout** clears both `isAuth` and `ownerAuth`, so the owner must unlock again next time.

**Migration:** If older `staffUser` / `staffPass` / `staffAuth` exist, they are read once so existing browsers keep working; new code uses `owner*` keys.

---

## Features (by page)

### Login (`/`)

- Validates against `adminUser` / `adminPass`.
- On success sets `isAuth` and navigates to `/menu`.

### Menu (`/menu`)

- Loads menu from `localStorage` key `menu` (managed in Admin).
- Search, quantity selection, bill total, print flow; persists bills to `bills` and increments `billNo`.

### Cash (`/cash`)

- Cash-oriented view of bill data (grouping logic in component).

### Admin (`/admin`) — behind OwnerGate

- **Main app login:** set user ID and password for the home screen.
- **Owner’s login:** set owner user ID and password for Admin / Reports / Hisaab.
- Add menu items (name, price, optional image as data URL), edit, delete.

### Reports (`/reports`) — behind OwnerGate

- Groups saved bills by **calendar day** (date part of `bill.date`, same rules as `billDayKey()` in `authDefaults.js`).
- Search by date string, summary cards, Excel download, print per day.
- **Delete this date:** removes **all bills** for that day from `bills` after confirmation (irreversible).

### Hisaab (`/hisaab`) — behind OwnerGate

- Ledger entries: name, amount, `createdAt` / `updatedAt` (ISO timestamps, displayed in Indian locale).
- Stored under `maazaHisaab` in `localStorage`.

---

## Local storage keys (reference)

| Key | Purpose |
|-----|---------|
| `isAuth` | Main session (`"true"` when logged in) |
| `adminUser`, `adminPass` | Main login |
| `ownerAuth` | Owner area unlocked this session |
| `ownerUser`, `ownerPass` | Owner login |
| `menu` | Menu items JSON |
| `bills` | Array of bill objects |
| `billNo` | Next bill number |
| `maazaHisaab` | Hisaab entries |

Legacy keys `staffUser`, `staffPass`, `staffAuth` may still exist until cleared; `ensureAuthDefaults` migrates where needed.

---

## How this app was created (high level)

1. **Scaffold:** Vite + React template (`npm create vite@latest` style) with React Router for multiple views.
2. **Layout:** `App.jsx` defines routes; **Navbar** renders only when `isAuth` is set.
3. **Persistence:** No database—all state that must survive refresh uses `localStorage` via `storage.js` (`getData`, `saveData`).
4. **Reports:** Bills saved from Menu include `date: new Date().toLocaleString()`; reports split on the first comma to get the **day** segment for grouping and deletion.
5. **Owner-only UI:** `OwnerGate` renders children only after `ownerUser` / `ownerPass` match; otherwise shows the unlock form.
6. **Hisaab:** Independent list CRUD with timestamps, keyed separately from bills.
7. **Exports:** Excel via `xlsx`; printing via shared `printContent` in `utils/pdf.js`.

---

## Security note

Credentials and data live **only in the browser**. Anyone with device access can read or change `localStorage`. This is suitable for a trusted, single-device kiosk-style use case, not for protecting secrets against technical users.

---

## License

Private project (`package.json`: `"private": true`). Adjust as needed for your deployment.
