async function fetchBookMeta(title, author) {
  try {
    const q = encodeURIComponent(`intitle:${title}${author ? " inauthor:" + author : ""}`);
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    const info = data.items[0].volumeInfo;
    return {
      desc:     info.description || "",
      coverUrl: (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "")
                  .replace("http://", "https://")
                  .replace("zoom=1", "zoom=2"),
      author:   (info.authors || [])[0] || "",
      isbn:     (info.industryIdentifiers || []).find(i => i.type === "ISBN_13")?.identifier || "",
    };
  } catch {
    return null;
  }
}
