# Paash Reads — Todo & Roadmap

## Pending Features

### 1. Persistent Book Storage
**Goal:** Books added or removed should survive a page refresh.

**Plan:**
- Use `localStorage` to save the `library` object on every add/remove
- On page load in `main.js`, read from `localStorage` first; fall back to the defaults in `data.js` if nothing is stored
- Changes needed:
  - `data.js` — export a `loadLibrary()` function that merges stored data with defaults
  - `ui.js` — call a `saveLibrary()` helper after every `addBook()` and `removeBook()`
  - `main.js` — call `loadLibrary()` before `renderAll()`
- No backend or account needed for this step; data lives in the browser

---

### 2. Move a Book from To-Read → Read
**Goal:** Mark a to-read book as finished and have it appear on the Read shelf automatically.

**Plan:**
- Add a **"Mark as Read ✦"** button inside the description modal (visible only when the book is on the to-read shelf)
- On click:
  - Remove the book from `library["to-read"]`
  - Push it into `library["read"]`
  - Re-render both grids
  - Close the modal and show a toast: `"moved to Read ✦"`
- Changes needed:
  - `modal.js` — conditionally render the move button in the modal footer
  - `ui.js` — add a `moveToRead(book)` function
  - `render.js` — no changes needed (re-render handles it)

---

### 3. User Login
**Goal:** Each reader gets their own personalised shelf that persists across devices.

**Plan:**
- **Phase 1 — Auth:** Add Google OAuth login (simplest for a personal project, no password management)
  - Use Firebase Authentication (free tier) — drop-in SDK, handles tokens and sessions
  - Show a "Sign in with Google" button on first visit; gate the shelves behind it
  - Store the logged-in user's UID
- **Phase 2 — Cloud storage:** Replace `localStorage` with Firestore (Firebase free tier)
  - Document structure: `users/{uid}/library/{read|to-read}` → array of book objects
  - Sync on every add/remove/move so data is available on any device
- **Phase 3 — Multi-user (future):** Allow sharing a shelf via a public link (read-only view)
- Changes needed:
  - New `js/auth.js` — Firebase init, login/logout, auth state listener
  - New `js/storage.js` — Firestore read/write replacing `localStorage` calls
  - `index.html` — add Firebase SDK scripts and a login screen overlay
  - `main.js` — wait for auth state before calling `renderAll()`

---

## Way Forward

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| 🔴 High  | Persistent storage (localStorage) | Small | Quick win, no backend needed |
| 🟡 Medium | Move to-read → read | Small | Needs modal update + ui helper |
| 🟢 Low   | User login + Firestore | Large | Firebase free tier recommended |
| 🔵 Future | Public shareable shelf link | Medium | After auth is in place |
| 🔵 Future | Reading progress / notes per book | Medium | Could pair with modal expansion |
| 🔵 Future | Search and filter shelves | Small | Client-side, no backend needed |

### Recommended order
1. **localStorage persistence** — highest impact for the least effort; makes the app actually usable today
2. **Move to-read → read** — natural next interaction once books persist
3. **User login** — only needed when you want cross-device sync or sharing
