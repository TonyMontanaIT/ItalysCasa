async function fetchAnnouncementsData() {
  const res = await fetch("https://tonymontanait.github.io/italyscasa-content/anunci/index2_translated.json");
  return await res.json();
}




window.addEventListener('load', function () { // Ждём полной загрузки страницы
    const heroSection = document.querySelector('.hero-section');

    const desktopImages = [
        '/Foto/HomeFoto/Home1.webp',
        '/Foto/HomeFoto/Home2.webp',
        '/Foto/HomeFoto/Home3.webp',
        '/Foto/HomeFoto/Home4.webp',
        '/Foto/HomeFoto/Home5.webp',
        '/Foto/HomeFoto/Home6.webp',
        '/Foto/HomeFoto/Home7.webp',
        '/Foto/HomeFoto/Home8.webp',
        '/Foto/HomeFoto/Home9.webp',
        '/Foto/HomeFoto/Home10.webp'
    ];

    const mediaImages = [
        '/Foto/HomeFoto/Home1med.webp',
        '/Foto/HomeFoto/Home2med.webp',
        '/Foto/HomeFoto/Home3med.webp',
        '/Foto/HomeFoto/Home4med.webp',
        '/Foto/HomeFoto/Home5med.webp'
    ];

    function getCurrentImages() {
        return window.matchMedia("(max-width: 768px)").matches ? mediaImages : desktopImages;
    }

    let images = getCurrentImages();
    let currentIndex = 0;

    function changeBackgroundImage() {
        const nextIndex = (currentIndex + 1) % images.length;

        heroSection.style.setProperty('--next-image', `url('${images[nextIndex]}')`);
        heroSection.classList.add('switch');

        setTimeout(() => {
            heroSection.style.setProperty('--current-image', `url('${images[nextIndex]}')`);
            heroSection.classList.remove('switch');
            currentIndex = nextIndex;
        }, 2000);
    }

    // После полной загрузки меняем фон через JS
    heroSection.style.setProperty('--current-image', `url('${images[0]}')`);
    heroSection.style.setProperty('--next-image', `url('${images[1]}')`);

    // Убираем фоновое изображение
    setTimeout(() => {
        heroSection.style.backgroundImage = 'none';
    }, 100); // Через 100мс после загрузки, можно увеличить

    // Запускаем смену фона через 4 секунды
    setTimeout(changeBackgroundImage, 4000);
    setInterval(changeBackgroundImage, 4000);

    // Следим за изменением ширины экрана и обновляем массив изображений
    window.addEventListener("resize", () => {
        const newImages = getCurrentImages();
        if (newImages !== images) {
            images = newImages;
            currentIndex = 0;
            heroSection.style.setProperty('--current-image', `url('${images[0]}')`);
            heroSection.style.setProperty('--next-image', `url('${images[1]}')`);
        }
    });
});



const staticAgencies = [
  { lat: 39.808384, lng: 15.793641, name: "Real Estate Agency in Scalea", phone: "3791080060"},
  { lat: 53.479002, lng: -2.232827, name: "Real Estate Agency in Manchester", phone: "3791080060" },
  { lat: 41.896139, lng: 12.478197, name: "Real Estate Agency in Rome", phone: "3791080060" },
  { lat: 40.8518, lng: 14.2681, name: "Real Estate Agency in Naples", phone: "3791080060" }
];

async function addDynamicMarkers(map) {
  try {
    const data = await fetchAnnouncementsData();

    const blueIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    data.forEach(announcement => {
      const latitude = parseFloat(announcement.latitude);
      const longitude = parseFloat(announcement.longitude);
      const nomeAnunci = announcement.nomeAnunci;
      const prezzo = announcement.prezzo;
      const riferimento = announcement.rif1 || announcement.riferimento;

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const popupContent = `
          <strong>${nomeAnunci}</strong><br>
          Price:€ ${prezzo}<br>
          RIF: ${riferimento}<br>
          <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}" class="glass-link">
              <button style="margin-top: 10px; padding: 5px 10px; background: linear-gradient(270deg, rgba(0, 151, 178, 0.8), rgba(89, 142, 200, 0.8)); color: white; border: none; border-radius: 30px; cursor: pointer;">
                  See Property
              </button>
          </a>
        `;

        L.marker([latitude, longitude], { icon: blueIcon })
          .addTo(map)
          .bindPopup(popupContent);
      } else {
        console.warn(`No coordinates for the ad: ${riferimento}`);
      }
    });
  } catch (error) {
    console.error("Error loading data for markers:", error);
  }
}

function addStaticMarkers(map, agencies) {
  const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  agencies.forEach(agency => {
    const popupContent = `
      <strong>${agency.name}</strong><br>
      <button style="margin-top: 10px; padding: 5px 10px; background: linear-gradient(270deg, rgba(0, 151, 178, 0.8), rgba(89, 142, 200, 0.8)); color: white; border: none; border-radius: 30px; cursor: pointer;">
        <a href="tel:+39${agency.phone}" style="color: white; text-decoration: none;">Call</a>
      </button>
    `;

    L.marker([agency.lat, agency.lng], { icon: redIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });
}

function initMapById(id) {
  const element = document.getElementById(id);
  if (!element || typeof L === 'undefined') return;

  const map = L.map(id).setView([39.8060500, 15.7963500], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  addDynamicMarkers(map);
  addStaticMarkers(map, staticAgencies);
}

function lazyLoadMaps() {
  const targets = ['map', 'mapMedia'];
  targets.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        initMapById(id);
        observer.unobserve(el);
      }
    }, { threshold: 0.1 });

    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof L === 'undefined') {
    const checkLeaflet = setInterval(() => {
      if (typeof L !== 'undefined') {
        clearInterval(checkLeaflet);
        lazyLoadMaps();
      }
    }, 100);
  } else {
    lazyLoadMaps();
  }
});




// Глобальные переменные
let data = [];
let currentIndex = 0;
const perPage = 10;
const container = document.getElementById("announcementsContainer");

// Загрузка и старт
document.addEventListener("DOMContentLoaded", async () => {
  if (!container) return;

try {
  const res = await fetch("https://tonymontanait.github.io/italyscasa-content/anunci/index2_translated.json");
  const fetched = await res.json();
  data = [...fetched];
  console.log("✅ Данные загружены, примеры:", data.slice(0, 2));


    data.sort((a, b) => {
      const prezzoA = parseInt((a.prezzo || "0").replace(/\D/g, ""), 10);
      const prezzoB = parseInt((b.prezzo || "0").replace(/\D/g, ""), 10);
      return prezzoB - prezzoA;
    });

    const initialLang = localStorage.getItem("lang") || "it";
    console.log("🔰 Инициализация с языком:", initialLang);
    renderPage(initialLang);
  } catch (err) {
    console.error("❌ Ошибка загрузки объявлений:", err);
  }
});

// Основной рендер
function renderPage(lang = "it") {
  console.log("🔁 renderPage запускается с языком:", lang);
  console.log("📦 Всего объявлений:", data.length);

  const items = data.slice(0, currentIndex + perPage);
  container.innerHTML = "";
  currentIndex = items.length;

  items.forEach((announcement, idx) => {
    const translated = announcement.translations?.[lang] || {};
    const nomeAnunci = translated.nomeAnunci || announcement.nomeAnunci;
    const tipo = translated.tipo || announcement.tipo;

    console.log(`📄 [${idx}] Название:`, nomeAnunci);

    const block = document.createElement("div");
    block.className = "bottom-block";
    block.dataset.id = announcement.riferimento;
    block.dataset.riferimento = announcement.riferimento;
    block.dataset.city = announcement.city1;
    block.dataset.zona = announcement.nomeZona;
    block.dataset.tipo = tipo;
    block.dataset.prezzo = announcement.prezzo;
    block.dataset.city1 = announcement.city1;

    const carousel = document.createElement("div");
    carousel.className = "carousel-container";

    const images = (announcement.images || []).slice(0, 3);
    images.forEach((imgObj, index) => {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = `https://tonymontanait.github.io/italyscasa-content/${imgObj.src}`;
      img.alt = imgObj.alt || "Foto dell'immobile";
      img.className = "carousel-image";
      if (index === 0) img.classList.add("active");
      carousel.appendChild(img);
    });

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.innerHTML = "&#10094;";
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.innerHTML = "&#10095;";
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    const info = `
      <a class="info-block1" href="/anunci/dynamic/index.html?rif=${announcement.riferimento}">
        <div class="info-anunci" data-riferimento="${announcement.riferimento}">${nomeAnunci}</div>
      </a>
      <div class="price">
        <a class="euro" href="/anunci/dynamic/index.html?rif=${announcement.riferimento}">${announcement.prezzo} €</a>
        <a class="rif" href="/anunci/dynamic/index.html?rif=${announcement.riferimento}">RIF ${announcement.riferimento}</a>
      </div>
      <div class="details">
        <span><img src="/Foto/Icon/mq.svg" alt="metri quadrati">${announcement.zonam2}</span>
        <span><img src="/Foto/Icon/locale.svg" alt="locale">${announcement.rooms}</span>
        <span><img src="/Foto/Icon/lift.svg" alt="ascensore">${announcement.elevator}</span>
        <span><img src="/Foto/Icon/terazza.svg" alt="balcone">${announcement.terrazzo}</span>
        <span><img src="/Foto/Icon/bagno.svg" alt="bagno">${announcement.bagni}</span>
        <span><img src="/Foto/Icon/piano.svg" alt="piano">${announcement.floor}</span>
      </div>
      <div class="cta">
        <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}" class="glass-link">
          <button class="glass-button" id="contatButton" data-i18n="see_property">
            ${translations[lang]?.see_property || "See Property"}
          </button>
        </a>
      </div>
    `;

    block.appendChild(carousel);
    block.insertAdjacentHTML("beforeend", info);
    container.appendChild(block);
  });

  addLoadMoreButton(lang);
  initializeCarousels();
}

// Кнопка "Показать ещё"
function addLoadMoreButton(lang) {
  const existing = document.getElementById("loadMoreContainer");
  if (existing) existing.remove();

  if (currentIndex < data.length) {
    const loadMoreContainer = document.createElement("div");
    loadMoreContainer.className = "button-anunci";
    loadMoreContainer.id = "loadMoreContainer";

    const loadMoreButton = document.createElement("button");
    loadMoreButton.id = "loadMoreButton";
    loadMoreButton.setAttribute("data-i18n", "search_continue");
    loadMoreButton.textContent = translations[lang]?.search_continue || "Continue your search";
    loadMoreButton.addEventListener("click", () => renderPage(lang));

    loadMoreContainer.appendChild(loadMoreButton);
    container.appendChild(loadMoreContainer);
  }
}

// Карусель
function initializeCarousels() {
  document.querySelectorAll('.carousel-container').forEach(container => {
    const images = container.querySelectorAll('.carousel-image');
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');
    if (images.length === 0) return;

    let index = 0;

    function showImage(newIndex) {
      images[index].classList.remove('active');
      images[newIndex].classList.add('active');
      index = newIndex;
    }

    prevBtn.addEventListener("click", () => {
      showImage((index - 1 + images.length) % images.length);
    });
    nextBtn.addEventListener("click", () => {
      showImage((index + 1) % images.length);
    });

    let startX = 0;
    container.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
    container.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) showImage((index + 1) % images.length);
      else if (endX - startX > 50) showImage((index - 1 + images.length) % images.length);
    });
  });
}

// Перерисовка при смене языка
document.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "it";
  console.log("🌐 Событие languageChanged, выбран язык:", lang);
  currentIndex = 0;
  renderPage(lang);
});



 
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const clearButton = document.getElementById('clearSearch');
  const searchIcon = document.querySelector('.search-bar .icon:last-of-type');
  const container = document.getElementById('announcementsContainer');
  let allBlocks = [];
  let suggestions = [];

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/[€,\s]/g, '').trim();
  }

  function filterBlocks(query) {
    query = normalize(query);
    let found = false;

    allBlocks.forEach(block => {
      const rif = normalize(block.dataset.riferimento);
      const prezzo = normalize(block.dataset.prezzo);
      const city1 = normalize(block.dataset.city1);

      const match =
        rif.includes(query) ||
        prezzo.includes(query) ||
        city1.includes(query);

      block.style.display = match ? 'block' : 'none';
      if (match) found = true;
    });

    clearButton.style.display = query ? 'block' : 'none';
    return found;
  }

  // 🎯 Автокомплит
  const autocompleteBox = document.createElement('div');
  autocompleteBox.className = 'autocomplete-box';
  autocompleteBox.style.display = 'none';
  searchInput.parentNode.appendChild(autocompleteBox);

  function showSuggestions(matches) {
    autocompleteBox.innerHTML = '';
    if (!matches.length) {
      autocompleteBox.style.display = 'none';
      return;
    }
    matches.forEach(item => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = item;
      div.addEventListener('click', () => {
        searchInput.value = item;
        filterBlocks(item);
        autocompleteBox.style.display = 'none';
        window.scrollBy({ top: 450, behavior: 'smooth' });
      });
      autocompleteBox.appendChild(div);
    });
    autocompleteBox.style.display = 'block';
  }

  function getSuggestions(query) {
    const normalizedQuery = normalize(query);
    const cities = [...new Set(allBlocks.map(block => normalize(block.dataset.city1)).filter(Boolean))];
    return cities.filter(city => city.startsWith(normalizedQuery)).slice(0, 5);
  }

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterBlocks(query);
      const matches = getSuggestions(query);
      showSuggestions(matches);
    }, 300);
  });

  // При нажатии на Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const found = filterBlocks(searchInput.value);
      autocompleteBox.style.display = 'none';
      if (found) {
        window.scrollBy({ top: 450, behavior: 'smooth' });
      }
    }
  });

  // При клике на иконку поиска
  searchIcon.addEventListener('click', () => {
    const found = filterBlocks(searchInput.value);
    autocompleteBox.style.display = 'none';
    if (found) {
      window.scrollBy({ top: 450, behavior: 'smooth' });
    }
  });

  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    allBlocks.forEach((block, index) => {
      block.style.display = index < 10 ? 'block' : 'none';
    });
    clearButton.style.display = 'none';
    autocompleteBox.style.display = 'none';
  });

  // Обновляем список блоков после загрузки
  const observer = new MutationObserver(() => {
    allBlocks = Array.from(document.querySelectorAll('.bottom-block'));
  });
  observer.observe(container, { childList: true, subtree: true });
});





document.addEventListener("scroll", function () {
  const icons = document.querySelector(".icons1");
  if (!icons) return; // ← 💥 вот защита от ошибки

  const stopPosition = 200; // Высота от низа страницы, где кнопки должны остановиться

  const scrollPosition = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollPosition >= pageHeight - stopPosition) {
    icons.style.position = "absolute";
    icons.style.bottom = `${stopPosition}px`;
  } else {
    icons.style.position = "fixed";
    icons.style.bottom = "10px";
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const reviews = [
        { name: "Luca Bianchi", stars: 5, date: "03 Aprile 2025", text: "Servizio eccellente, ho trovato casa in pochissimo tempo. Agenzia molto professionale!" },
        { name: "Giulia Rossi", stars: 5, date: "12 Marzo 2025", text: "Tony e il suo team sono stati incredibili! Consigliatissimi!" },
        { name: "Marco Verdi", stars: 4, date: "22 Febbraio 2025", text: "Buona esperienza, personale gentile e preparato. Alcuni ritardi iniziali ma poi tutto ok." },
        { name: "Elena Neri", stars: 5, date: "10 Gennaio 2025", text: "Professionisti seri e disponibili, mi hanno aiutato a comprare la casa dei miei sogni!" },
        { name: "Davide Russo", stars: 5, date: "02 Dicembre 2024", text: "Agenzia molto affidabile, tutto è andato liscio e senza intoppi." },
        { name: "Francesca Gallo", stars: 4, date: "15 Novembre 2024", text: "Tutto bene, ottima comunicazione. Avrei voluto più foto degli immobili." }
    ];

    const container = document.querySelector(".block-recens");
    const carousel = document.createElement("div");
    carousel.className = "recens-carousel";

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "recens-card";
        const stars = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);
        card.innerHTML = `
            <div class="recens-stars">${stars}</div>
            <div class="recens-name">${review.name}</div>
            <div class="recens-date">${review.date}</div>
            <div class="recens-text">${review.text}</div>
        `;
        carousel.appendChild(card);
    });

    // Дублируем отзывы для бесконечной прокрутки
    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "recens-card";
        const stars = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);
        card.innerHTML = `
            <div class="recens-stars">${stars}</div>
            <div class="recens-name">${review.name}</div>
            <div class="recens-date">${review.date}</div>
            <div class="recens-text">${review.text}</div>
        `;
        carousel.appendChild(card);
    });

    container.appendChild(carousel);
});

async function injectStructuredDataForHomePage() {
  const head = document.head;
  const existing = document.getElementById("structured-annunci-json");
  if (existing) existing.remove();

  try {
    const res = await fetch("https://tonymontanait.github.io/italyscasa-content/anunci/structured-annunci.json");
    const fullStructured = await res.json();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "structured-annunci-json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": fullStructured
    }, null, 2);

    head.appendChild(script);

    // 🧠 Обновляем <meta name="description"> — берём keywords из всех объявлений
    const combinedKeywords = (fullStructured || [])
      .map(item => item.keywords)
      .filter(Boolean)
      .join(", ");

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", combinedKeywords.slice(0, 160));
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = combinedKeywords.slice(0, 160);
      head.appendChild(meta);
    }

  } catch (err) {
    console.error("Ошибка загрузки structured-annunci.json:", err);
  }
}

// Вызовем после загрузки DOM
document.addEventListener("DOMContentLoaded", injectStructuredDataForHomePage);


window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "it";
  currentIndex = 0;
  renderPage(lang);
});


