function openModal(book, type) {
  const isRose   = type === "read";
  const backdrop = document.getElementById("modal-backdrop");
  const modal    = document.getElementById("modal");
  const coverEl  = document.getElementById("modal-cover");

  const src = coverUrl(book);
  if (src) {
    coverEl.innerHTML = `<img src="${src}" alt="${escHtml(book.title)}"
      onerror="this.parentElement.innerHTML='<div class=modal-cover-placeholder><div class=ph-icon>📖</div><div class=ph-label>${escHtml(book.title)}</div></div>'"
      style="width:100%;height:100%;object-fit:cover;display:block;" />`;
  } else {
    coverEl.innerHTML = `<div class="modal-cover-placeholder">
      <div class="ph-icon">📖</div>
      <div class="ph-label">${escHtml(book.title)}</div>
    </div>`;
  }

  document.getElementById("modal-content").innerHTML = `
    <span class="modal-badge ${isRose ? "modal-badge-rose" : "modal-badge-gold"}">
      ${isRose ? "✦ read ✦" : "✦ to read ✦"}
    </span>
    <div class="modal-title">${escHtml(book.title)}</div>
    <div class="modal-author">— ${escHtml(book.author || "Unknown")}</div>
    <div class="modal-divider"></div>
    <p class="modal-desc">${escHtml(book.desc || "No description available for this title.")}</p>
  `;

  modal.className = `modal${isRose ? "" : " modal-gold"}`;
  modal.style.borderColor = isRose ? "rgba(212,104,138,0.4)" : "rgba(201,168,76,0.4)";

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-backdrop").classList.remove("open");
  document.body.style.overflow = "";
}

function closeModalOnBackdrop(e) {
  if (e.target === document.getElementById("modal-backdrop")) closeModal();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});
