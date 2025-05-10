let currentBlogSlug = null;
let allBlogsData = null;

async function renderBlogDetail(lang) {
  const blog = allBlogsData.find(item => item.slug === currentBlogSlug);
  if (!blog) return;

  const langData = blog.translations?.[lang] || blog;
  const images = blog.images || [];

  const blogDetail = document.getElementById("blog-detail");
  blogDetail.innerHTML = `
    <div class="content-foto">
      <div class="foto-big">
        <img src="https://tonymontanait.github.io/italyscasa-content/${images[0]?.src || 'uploads/default.jpg'}" 
             alt="${images[0]?.alt || 'Immagine principale del blog'}" class="clickable">
      </div>
      <div class="foto-smal">
        <div class="smal-1">
          <img src="https://tonymontanait.github.io/italyscasa-content/${images[1]?.src || 'uploads/default.jpg'}" 
               alt="${images[1]?.alt || 'Immagine secondaria 1'}" class="clickable">
        </div>
        <div class="smal-2">
          <img src="https://tonymontanait.github.io/italyscasa-content/${images[2]?.src || 'uploads/default.jpg'}" 
               alt="${images[2]?.alt || 'Immagine secondaria 2'}" class="clickable">
        </div>
      </div>
    </div>
    <div class="info-prev">
      <h1>${langData.tipo}</h1>
      <h2>${langData.h1}</h2>
    </div>
    <div class="content-info">
      ${langData.h2t1 ? `<p class="pclassH2">${langData.h2t1}</p>` : ""}
      ${langData.text1 ? `<p class="pclassText">${langData.text1}</p>` : ""}
      ${langData.h2t2 ? `<p class="pclassH2">${langData.h2t2}</p>` : ""}
      ${langData.text2 ? `<p class="pclassText">${langData.text2}</p>` : ""}
      ${langData.h2t3 ? `<p class="pclassH2">${langData.h2t3}</p>` : ""}
      ${langData.text3 ? `<p class="pclassText">${langData.text3}</p>` : ""}
      ${langData.h2t4 ? `<p class="pclassH2">${langData.h2t4}</p>` : ""}
      ${langData.text4 ? `<p class="pclassText">${langData.text4}</p>` : ""}
      ${langData.h2t5 ? `<p class="pclassH2">${langData.h2t5}</p>` : ""}
      ${langData.text5 ? `<p class="pclassText">${langData.text5}</p>` : ""}
      ${langData.h2t6 ? `<p class="pclassH2">${langData.h2t6}</p>` : ""}
      ${langData.text6 ? `<p class="pclassText">${langData.text6}</p>` : ""}
      ${langData.phone ? `<p class="phoneblog">${langData.phone}</p>` : ""}
    </div>
  `;

  initModal(images);
  injectStructuredData(blog, langData, lang);
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  currentBlogSlug = urlParams.get("slug");
  if (!currentBlogSlug) return;

  const response = await fetch("https://tonymontanait.github.io/italyscasa-content/blog/index_translated.json");
  allBlogsData = await response.json();

  await renderBlogDetail(currentLang);
}

// === МОДАЛКА ===
function initModal(images) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const thumbnailsContainer = document.getElementById('modalThumbnails');
  const closeModalBtn = document.getElementById('closeModal');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentImageIndex = 0;

  function openModal(index) {
    currentImageIndex = index;
    const current = images[index];
    modalImage.src = `https://tonymontanait.github.io/italyscasa-content/${current.src}`;
    modalImage.alt = current.alt || "Immagine del blog";
    updateThumbnails();
    modal.style.display = 'block';
    document.body.classList.add("modal-open");
  }

  function updateThumbnails() {
    thumbnailsContainer.innerHTML = '';
    images.forEach((img, i) => {
      const thumb = document.createElement('img');
      thumb.src = `https://tonymontanait.github.io/italyscasa-content/${img.src}`;
      thumb.alt = img.alt || `Miniatura ${i + 1}`;
      thumb.className = 'modal-thumbnail';
      if (i === currentImageIndex) thumb.classList.add('active');
      thumb.addEventListener('click', () => openModal(i));
      thumbnailsContainer.appendChild(thumb);
    });
  }

  modalPrev.onclick = () => openModal((currentImageIndex - 1 + images.length) % images.length);
  modalNext.onclick = () => openModal((currentImageIndex + 1) % images.length);
  closeModalBtn.onclick = () => {
    modal.style.display = 'none';
    document.body.classList.remove("modal-open");
  };
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.classList.remove("modal-open");
    }
  });

  document.querySelectorAll('.clickable').forEach((img, i) =>
    img.addEventListener('click', () => openModal(i))
  );
}

// === STRUCTURED DATA ===
function injectStructuredData(blog, langData, lang) {
  document.getElementById("structured-detail-json")?.remove();
  document.querySelector('meta[name="description"]')?.remove();

  const head = document.head;
  const script = document.createElement("script");
  script.id = "structured-detail-json";
  script.type = "application/ld+json";

  const keywordsPool = [
    langData.title, langData.tipo, blog.slug,
    langData.h1, langData.h2t1, langData.h2t2,
    langData.h2t3, langData.h2t4, langData.h2t5, langData.text1, langData.text2
  ].join(" ").toLowerCase();

  const matches = keywordsPool.match(/[a-zà-ú]+/gi) || [];
  const freq = {};
  matches.filter(w => w.length > 3).forEach(w => freq[w] = (freq[w] || 0) + 1);
  const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w).join(", ");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href },
    "headline": langData.title || langData.h1 || "",
    "datePublished": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Antonio Montano",
      "url": "https://www.instagram.com/italyscasa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ItalysCasa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tonymontanait.github.io/italyscasa-content/uploads/logo.webp"
      }
    },
    "image": blog.images?.[0]
      ? `https://tonymontanait.github.io/italyscasa-content/${blog.images[0].src}`
      : "https://tonymontanait.github.io/italyscasa-content/uploads/default.jpg",
    "description": langData.text1 || "",
    "articleBody": [
      langData.text1, langData.text2, langData.text3,
      langData.text4, langData.text5, langData.text6
    ].filter(Boolean).join("\n\n"),
    "inLanguage": lang,
    "isAccessibleForFree": true,
    "wordCount": (langData.text1 + langData.text2 + langData.text3 + langData.text4 + langData.text5 + langData.text6 || "").split(/\s+/).length,
    "keywords": keywords,
    "sameAs": [
      "https://www.instagram.com/italyscasa",
      "https://www.facebook.com/profile.php?id=61551668563870",
      "https://www.tiktok.com/@italyscasa1"
    ]
  };

  script.textContent = JSON.stringify(structuredData, null, 2);
  head.appendChild(script);

  const meta = document.createElement("meta");
  meta.name = "description";
  meta.content = keywords;
  head.appendChild(meta);
}

// === РЕАКЦИЯ НА СМЕНУ ЯЗЫКА ===
document.addEventListener("DOMContentLoaded", async () => {
  await init();

  const switcher = document.getElementById("lang-switcher");
  if (switcher) {
    switcher.addEventListener("change", async () => {
      const selectedLang = switcher.value;
      if (translations[selectedLang]) {
        currentLang = selectedLang;
        localStorage.setItem("lang", selectedLang);
        applyTranslations();
        await renderBlogDetail(currentLang); // перерисовка
      }
    });
  }
});
