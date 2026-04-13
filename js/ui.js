let toastTimer;

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function toggleForm(type) {
  const form   = document.getElementById(`form-${type}`);
  const isOpen = form.classList.toggle("open");
  if (isOpen) document.getElementById(`input-${type}-title`).focus();
}

async function addBook(type) {
  const titleEl  = document.getElementById(`input-${type}-title`);
  const authorEl = document.getElementById(`input-${type}-author`);
  const title    = titleEl.value.trim();
  const author   = authorEl.value.trim();
  if (!title) { titleEl.focus(); return; }

  const okBtn    = document.querySelector(`#form-${type} .btn-ok`);
  const origText = okBtn.textContent;
  okBtn.textContent = "searching… ✦";
  okBtn.disabled    = true;

  const meta = await fetchBookMeta(title, author);

  okBtn.textContent = origText;
  okBtn.disabled    = false;

  const book = {
    title,
    author:   meta?.author   || author || "Unknown",
    isbn:     meta?.isbn     || "",
    coverUrl: meta?.coverUrl || "",
    desc:     meta?.desc     || "",
  };

  library[type].push(book);
  titleEl.value = "";
  authorEl.value = "";
  toggleForm(type);

  const grid = document.getElementById(`grid-${type}`);
  grid.appendChild(makeCard(book, type, 0));

  showToast(meta?.desc ? `"${title}" added ✦` : `"${title}" added — no description found`);
}

function removeBook(type, card, title) {
  library[type] = library[type].filter(b => b.title !== title);
  card.style.transition = "all 0.3s ease";
  card.style.opacity    = "0";
  card.style.transform  = "scale(0.85) translateY(10px)";
  setTimeout(() => card.remove(), 300);
  showToast(`"${title}" removed`);
}

// Keyboard shortcuts for both forms
["read", "to-read"].forEach(type => {
  ["title", "author"].forEach(field => {
    document.getElementById(`input-${type}-${field}`)
      .addEventListener("keydown", e => {
        if (e.key === "Enter")  addBook(type);
        if (e.key === "Escape") toggleForm(type);
      });
  });
});
