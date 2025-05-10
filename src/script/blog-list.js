document.addEventListener("DOMContentLoaded", async () => {
  const blogContainer = document.getElementById("blog-container");
  const paginationContainer = document.getElementById("pagination-container");

  if (!blogContainer || !paginationContainer) {
    console.error("Контейнеры blog-container или pagination-container не найдены в HTML!");
    return;
  }

  let blogs = [];
  let currentPage = 1;
  const blogsPerPage = 6;

  try {
    const res = await fetch("https://tonymontanait.github.io/italyscasa-content/blog/index_translated.json");
    const allBlogs = await res.json();
    blogs = allBlogs;
    renderPage(currentPage);
    renderPagination();
  } catch (error) {
    console.error("Ошибка при загрузке блога:", error);
  }

  function renderPage(page) {
    blogContainer.innerHTML = "";
    const start = (page - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    const currentBlogs = blogs.slice(start, end);

    currentBlogs.forEach(blog => {
      const translated = blog.translations?.[currentLang] || blog;

      const blogElement = document.createElement("div");
      blogElement.classList.add("serv-block-1");

      const imageObj = blog.images?.[0] || { src: "uploads/default.jpg", alt: "Immagine del blog" };
      const imgSrc = `https://tonymontanait.github.io/italyscasa-content/${imageObj.src}`;
      const imgAlt = imageObj.alt || "Immagine del blog";

      blogElement.innerHTML = `
        <span class="circle-image">
          <img src="${imgSrc}" alt="${imgAlt}">
        </span>
        <div class="serv-content">
          <h1 class="serv-h1">${translated.tipo}</h1>
          <h3 class="serv-h3">${translated.h1}</h3>
        </div>
        <div class="cta1">
          <a href="/blogpage/?slug=${blog.slug}" class="glass-link1">
            <button class="glass-button1" data-i18n="blog_butt">
              ${translations?.[currentLang]?.blog_butt || "Find out more"}
            </button>
          </a>
        </div>
      `;

      blogContainer.appendChild(blogElement);
    });

    injectStructuredDataForCurrentPage(page);
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage(currentPage);
      });
      paginationContainer.appendChild(btn);
    }
  }

  // Подгрузка JSON-LD и meta description
  async function injectStructuredDataForCurrentPage(page) {
    const head = document.head;
    const existing = document.getElementById("structured-blog-json");
    if (existing) existing.remove();

    try {
      const res = await fetch("https://tonymontanait.github.io/italyscasa-content/blog/structured-blog.json");
      const fullStructured = await res.json();
      const start = (page - 1) * blogsPerPage;
      const end = start + blogsPerPage;
      const slicedGraph = fullStructured["@graph"].slice(start, end);

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "structured-blog-json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": slicedGraph
      }, null, 2);

      head.appendChild(script);

      const combinedKeywords = slicedGraph.map(item => item.keywords).filter(Boolean).join(", ");
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", combinedKeywords);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = combinedKeywords;
        head.appendChild(meta);
      }
    } catch (err) {
      console.error("Ошибка при подгрузке structured-blog.json:", err);
    }
  }

  // Ререндер при смене языка
  window.addEventListener("languageChanged", () => {
    renderPage(currentPage);
  });
});
