# Paash Reads ✦

A dramatic, pookie-aesthetic personal reading tracker built for an enthusiastic reader — tracking books read and books waiting to be read.

## Features

- **Read shelf** — books already devoured
- **To-Read shelf** — the ever-growing waiting list
- **Auto-fetch on add** — type a title and author, hit add; the app calls the Google Books API and pulls in the real cover image and description automatically
- **Click for description** — clicking any book card opens a modal with the full cover and a short blurb
- **Add & remove** — temporarily add or remove books from either shelf; Enter to submit, Escape to cancel
- **Dramatic UI** — twinkling starfield, floating petals, glowing gold title, rose/gold card themes

## Project Structure

```
paash-reads/
├── index.html          # HTML skeleton
├── css/
│   └── styles.css      # All styles
└── js/
    ├── data.js         # Book data + Open Library base URL
    ├── api.js          # Google Books API fetch (auto description + cover)
    ├── render.js       # Card and grid rendering
    ├── modal.js        # Description modal open/close
    ├── ui.js           # Add, remove, toast notifications, form keyboard shortcuts
    ├── effects.js      # Starfield canvas animation + floating petals
    └── main.js         # Entry point
```

## Usage

Open `index.html` directly in a browser — no build step, no dependencies, no server needed.

## How adding a book works

1. Click **✦ add a book** (or **✦ add to wishlist** for the to-read shelf)
2. Enter the title and optionally the author
3. Hit Enter or click **add it ✦**
4. The button shows **"searching… ✦"** while it fetches metadata from Google Books
5. The card appears with the real cover image and description ready in the modal

If no match is found, the book is still added with a placeholder cover and a toast notification.

## Tech

Plain HTML, CSS, and vanilla JavaScript — no frameworks, no bundler, no Node.js.

- [Google Books API](https://developers.google.com/books) — cover images and descriptions (no API key required)
- [Open Library Covers](https://openlibrary.org/dev/docs/api#anchor_covers) — fallback cover source for pre-seeded books
- [Google Fonts](https://fonts.google.com) — Great Vibes, Playfair Display, Cormorant Garamond
