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

### 4. Mini Dictionary Feature
**Goal:** Let the reader look up any word without leaving the page — useful while reading descriptions or notes.

**Plan:**
- Add a **highlight-to-lookup** interaction: when the user selects/highlights any word anywhere on the page, a small floating popover appears with the definition
- Use the [Free Dictionary API](https://dictionaryapi.dev/) (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`) — no key needed
- Popover shows: word, phonetic, part of speech, and the first definition
- Dismiss on click-outside or Escape
- Changes needed:
  - New `js/dictionary.js` — listens for `mouseup`/`selectionchange`, fetches definition, renders popover
  - `css/styles.css` — popover styles (dark, gold-accented, matches existing theme)
  - `main.js` — call `initDictionary()`
- Edge cases: ignore selections shorter than 2 chars or longer than 30 chars; show "no definition found" gracefully

---

### 5. Reader Personality
**Goal:** Based on the books on the Read shelf, generate a short personality summary that captures the reader's taste and character.

**Plan:**
- **Phase 1 — Tag-based (no API):** Assign genre/mood tags to each book in `data.js` (e.g. `["literary fiction", "dark", "philosophical"]`). Aggregate tags across all read books and map common clusters to a personality archetype (e.g. heavy Dostoevsky + Yanagihara → *"The Melancholic Romantic"*)
  - Archetypes defined as a local map in a new `js/personality.js`
  - Show a personality card at the top of the Read section — title, short description, a matching aesthetic emoji set
  - Updates live whenever a book is added or removed from the Read shelf
- **Phase 2 — AI-generated (with backend):** Send the list of read book titles to Claude API and get back a bespoke, witty personality blurb
  - Needs a small server (e.g. Cloudflare Worker or Vercel Edge Function) to keep the API key secret
  - Triggered by a **"Analyse my taste ✦"** button so it's opt-in and not called on every render
- Changes needed:
  - New `js/personality.js` — tag aggregation logic + archetype map (Phase 1), API call (Phase 2)
  - `render.js` — render personality card above the Read grid
  - `data.js` — add `tags` array to each book object

---

## Way Forward

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| 🔴 High  | Persistent storage (localStorage) | Small | Quick win, no backend needed |
| 🟡 Medium | Move to-read → read | Small | Needs modal update + ui helper |
| 🟢 Low   | User login + Firestore | Large | Firebase free tier recommended |
| 🔵 Future | Mini dictionary (highlight to define) | Small | Free Dictionary API, no key needed |
| 🔵 Future | Reader personality card | Medium–Large | Phase 1 tag-based, Phase 2 Claude API |
| 🔵 Future | Public shareable shelf link | Medium | After auth is in place |
| 🔵 Future | Reading progress / notes per book | Medium | Could pair with modal expansion |
| 🔵 Future | Search and filter shelves | Small | Client-side, no backend needed |

### Recommended order
1. **localStorage persistence** — highest impact for the least effort; makes the app actually usable today
2. **Move to-read → read** — natural next interaction once books persist
3. **Mini dictionary** — small, self-contained, no backend; fun to use while browsing descriptions
4. **Reader personality (tag-based)** — works with existing data, no API key needed for Phase 1
5. **User login** — only needed when you want cross-device sync or sharing
6. **Reader personality (AI-generated)** — best saved for after login so results can be stored per user
