async function PageSearch({params}) {
  const query = decodeURIComponent(params.query || "");
  const app = document.getElementById("app");
  
  if (!query) {
    app.innerHTML = `<div class="state"><h3>Masukkan kata kunci untuk mencari anime</h3></div>`;
    return;
  }

  app.innerHTML = `<div class="state"><div class="emoji">🔍</div><h3>Mencari "${query}"...</h3></div>`;

  try {
    const data = await LenzAPI.search(query);
    
    // Gunakan fungsi extractList untuk menormalisasi data
    // Kita cek key yang umum dipakai API (results, search, data, anime, dll)
    const results = LenzAPI.extractList(data, "results", "search", "anime", "data");

    if (results.length === 0) {
      app.innerHTML = `
        <div class="state">
          <h3>Tidak ditemukan</h3>
          <p>Anime "${query}" tidak ditemukan. Coba gunakan kata kunci lain.</p>
        </div>`;
      return;
    }

    // Rendering Hasil Pencarian
    app.innerHTML = `
      <section class="section">
        <div class="section-head"><h2>Hasil Pencarian: "${LenzUI.escapeHTML(query)}"</h2></div>
        <div class="anime-list">
          ${results.map(anime => `
            <a href="#/anime/${anime.slug || anime.endpoint}" class="anime-card">
              <div class="card-thumb">
                <img src="${anime.thumb || anime.poster || window.CONFIG.PLACEHOLDER_IMAGE}" loading="lazy" alt="${anime.title}">
              </div>
              <div class="card-body">
                <h3>${LenzUI.escapeHTML(anime.title)}</h3>
                ${anime.genre ? `<span class="chip-genre">${anime.genre}</span>` : ""}
              </div>
            </a>
          `).join("")}
        </div>
      </section>
    `;

  } catch (err) {
    console.error("Search Error:", err);
    app.innerHTML = `
      <div class="state">
        <h3>Terjadi Kesalahan</h3>
        <p>Gagal menghubungi server pencarian. Pastikan koneksi internet stabil.</p>
      </div>`;
  }
}
