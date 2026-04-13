function escHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initials(title) {
  return title
    .split(" ")
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join("");
}

function placeholderHtml(title) {
  const ini = initials(title);
  return `<div class='cover-placeholder'><div class='ph-initials'>${ini}</div></div>`;
}

function coverUrl(book) {
  if (book.coverUrl) return book.coverUrl;
  if (book.isbn)     return `${COVER_BASE}${book.isbn}-M.jpg`;
  return "";
}

function makeCard(book, type, delay = 0) {
  const isRose = type === "read";
  const card = document.createElement("div");
  card.className = `book-card ${isRose ? "card-rose" : "card-gold"}`;
  card.dataset.type  = type;
  card.dataset.title = book.title;
  card.style.animationDelay = `${delay}s`;

  card.addEventListener("click", e => {
    if (e.target.closest(".remove-btn")) return;
    openModal(book, type);
  });

  const src = coverUrl(book);
  const coverHtml = src
    ? `<img src="${src}" alt="${escHtml(book.title)}"
           onerror="this.parentElement.innerHTML='${placeholderHtml(book.title)}'"
           loading="lazy" />`
    : placeholderHtml(book.title);

  card.innerHTML = `
    <button class="remove-btn" title="remove">×</button>
    <div class="book-cover-wrap">
      ${coverHtml}
      <div class="cover-overlay">
        <span class="overlay-hint">tap to read more</span>
      </div>
    </div>
    <div class="book-footer">
      <div class="book-title">${escHtml(book.title)}</div>
      <div class="book-author">${escHtml(book.author || "")}</div>
    </div>
  `;

  card.querySelector(".remove-btn").addEventListener("click", e => {
    e.stopPropagation();
    removeBook(type, card, book.title);
  });

  return card;
}

function renderSection(type) {
  const grid = document.getElementById(`grid-${type}`);
  grid.innerHTML = "";
  library[type].forEach((book, i) => {
    grid.appendChild(makeCard(book, type, i * 0.07));
  });
}

function renderAll() {
  renderSection("read");
  renderSection("to-read");
}
