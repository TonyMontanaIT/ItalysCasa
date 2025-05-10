async function fetchAnnouncementsData() {
  if (!window.cachedAnnouncementsData) {
    const res = await fetch("https://tonymontanait.github.io/italyscasa-content/anunci/index2_translated.json");
    const rawData = await res.json();

    // 🔥 Сортировка по цене (от самой высокой к самой низкой)
    rawData.sort((a, b) => {
      const priceA = parseFloat((a.prezzo || "").replace(/[^\d.]/g, "")) || 0;
      const priceB = parseFloat((b.prezzo || "").replace(/[^\d.]/g, "")) || 0;
      return priceB - priceA;
    });

    window.cachedAnnouncementsData = rawData;
  }

  return window.cachedAnnouncementsData;
}


const staticAgencies = [
  { lat: 39.808384, lng: 15.793641, name: "Real Estate Agency in Scalea", phone: "3791080060" },
  { lat: 53.479002, lng: -2.232827, name: "Real Estate Agency in Manchester", phone: "3791080060" },
  { lat: 41.896139, lng: 12.478197, name: "Real Estate Agency in Rome", phone: "3791080060" },
  { lat: 40.8518, lng: 14.2681, name: "Real Estate Agency in Naples", phone: "3791080060" }
];

function addDynamicMarkers(map, announcementsData) {
  const blueIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  announcementsData.forEach(announcement => {
    const { latitude, longitude, nomeAnunci, prezzo, riferimento, fileSlug } = announcement;
    const lat = parseFloat(latitude || announcement.lat);
    const lng = parseFloat(longitude || announcement.lon);
    const slug = fileSlug || riferimento;

    if (!isNaN(lat) && !isNaN(lng)) {
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
      L.marker([lat, lng], { icon: blueIcon }).addTo(map).bindPopup(popupContent);
    }
  });
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
    L.marker([agency.lat, agency.lng], { icon: redIcon }).addTo(map).bindPopup(popupContent);
  });
}

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

    container.addEventListener("touchstart", e => (startX = e.touches[0].clientX), { passive: true });
    container.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) showImage((index + 1) % images.length);
      else if (endX - startX > 50) showImage((index - 1 + images.length) % images.length);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("announcementsContainer");
  if (!container) return;

  const perPage = 10;
  let currentIndex = 0;
  let data = await fetchAnnouncementsData();

  const loadMoreContainer = document.createElement("div");
  loadMoreContainer.className = "button-anunci";
  loadMoreContainer.id = "loadMoreContainer";

  const loadMoreButton = document.createElement("button");
  loadMoreButton.id = "loadMoreButton";
  loadMoreButton.setAttribute("data-i18n", "search_continue");
  loadMoreContainer.appendChild(loadMoreButton);

  function renderPage(lang = "it") {
    const items = data.slice(0, currentIndex + perPage);
    container.innerHTML = "";
    currentIndex = items.length;

    items.forEach(announcement => {
      const translated = announcement.translations?.[lang] || {};
      const nomeAnunci = translated.nomeAnunci || announcement.nomeAnunci;
      const text1 = translated.text1 || announcement.text1;

      const block = document.createElement("div");
      block.className = "bottom-block";

      const carousel = document.createElement("div");
      carousel.className = "carousel-container";

      const images = (announcement.images || []).slice(0, 3);
      images.forEach((imgObj, index) => {
        const img = document.createElement("img");
        const src = typeof imgObj === "string" ? imgObj : imgObj.src;
        const alt = typeof imgObj === "string" ? "Foto dell'annuncio" : (imgObj.alt || "Foto dell'annuncio");

        img.src = `https://tonymontanait.github.io/italyscasa-content/${src}`;
        img.alt = alt;
        img.className = "carousel-image";
        if (index === 0) img.classList.add("active");
        carousel.appendChild(img);
      });

      const prev = document.createElement("button");
      prev.className = "carousel-btn prev";
      prev.innerHTML = "&#10094;";
      const next = document.createElement("button");
      next.className = "carousel-btn next";
      next.innerHTML = "&#10095;";
      carousel.appendChild(prev);
      carousel.appendChild(next);

      const infoBlock = document.createElement("div");
      infoBlock.className = "ven-info";
      infoBlock.innerHTML = `
        <div class="ven-1">
          <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}">${nomeAnunci}</a>
        </div>
        <div class="ven-2">
          <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}" class="ven-price">${announcement.prezzo} €</a>
          <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}" class="ven-rif">RIF ${announcement.riferimento}</a>
        </div>
        <div class="moreinfo1"><p>${(text1 || '').slice(0, 300)}</p></div>
        <div class="ven-icon">
          <span><img src="/Foto/Icon/mq.svg" alt="metri quadrati">${announcement.zonam2}</span>
          <span><img src="/Foto/Icon/locale.svg" alt="locale">${announcement.rooms}</span>
          <span><img src="/Foto/Icon/lift.svg" alt="ascensore">${announcement.elevator}</span>
          <span><img src="/Foto/Icon/terazza.svg" alt="balcone">${announcement.terrazzo}</span>
          <span><img src="/Foto/Icon/bagno.svg" alt="bagno">${announcement.bagni}</span>
          <span><img src="/Foto/Icon/piano.svg" alt="piano">${announcement.floor}</span>
        </div>
        <div class="cta-container">
          <div class="cta">
            <a href="/anunci/dynamic/index.html?rif=${announcement.riferimento}" class="glass-link">
              <button class="glass-button" id="contatButton" data-i18n="see_property">
                ${translations[lang]?.see_property || "See Property"}
              </button>
            </a>
          </div>
          <div class="cta-icon">
            <a href="https://api.whatsapp.com/send?phone=393791080060&text=Salve%20Da%20Sito" target="_blank">
              <img src="/Foto/Icon/whats.svg" alt="WhatsApp" class="waicon">
            </a>
            <a href="tel:+393791080060">
              <img src="/Foto/Icon/tel.svg" alt="Phone" class="pfoneicon">
            </a>
          </div>
        </div>
      `;

      block.appendChild(carousel);
      block.appendChild(infoBlock);
      container.appendChild(block);
    });

    const existing = document.getElementById("loadMoreContainer");
    if (existing) existing.remove();
    if (currentIndex < data.length) {
      container.appendChild(loadMoreContainer);
    } else {
      const msg = document.createElement("div");
      msg.textContent = "All ads are shown!";
      msg.style.marginTop = "20px";
      msg.style.fontWeight = "bold";
      msg.style.textAlign = "center";
      container.appendChild(msg);
    }

    initializeCarousels();
  }

  const lang = localStorage.getItem("lang") || "it";
  renderPage(lang);

  window.addEventListener("languageChanged", () => {
    const newLang = localStorage.getItem("lang") || "it";
    currentIndex = 0;
    renderPage(newLang);
  });

  loadMoreButton.addEventListener("click", () => renderPage(localStorage.getItem("lang") || "it"));

  const mapElement = document.getElementById('map');
  if (mapElement) {
    const map = L.map('map').setView([39.80605, 15.79635], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    addDynamicMarkers(map, data);
    addStaticMarkers(map, staticAgencies);
  }

  const mapMedia = document.getElementById('mapMedia');
  if (mapMedia) {
    const map = L.map('mapMedia').setView([39.80605, 15.79635], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    addDynamicMarkers(map, data);
    addStaticMarkers(map, staticAgencies);
  }
});


// --- Модалка с картой ---
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("mapModal");
  const openModalBtn = document.querySelector(".glass-button2");
  const closeModalBtn = document.querySelector(".close-btn1");
  let mapPopup = null;

  openModalBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";

    if (!mapPopup) {
      setTimeout(async () => {
        const data = await fetchAnnouncementsData();
        mapPopup = L.map("mapPopup").setView([39.80605, 15.79635], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(mapPopup);
        addDynamicMarkers(mapPopup, data);
        addStaticMarkers(mapPopup, staticAgencies);
      }, 100);
    } else {
      setTimeout(() => mapPopup.invalidateSize(), 300);
    }
  });

  closeModalBtn?.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// --- EmailJS отправка формы ---
document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("S5yiwwzhcxkuEH6_j");

  const contactForm = document.getElementById("contactForm");
  const inputForm = document.getElementById("inputForm");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const submitButton = document.getElementById("submitButton");

  if (!contactForm || !inputForm || !thankYouMessage || !submitButton) return;

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name")?.value.trim() || "",
      surname: document.getElementById("surname")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || "",
      text: document.getElementById("text")?.value.trim() || ""
    };

    if (!formData.name || !formData.surname || !formData.phone) {
      alert("Please fill in all fields!");
      return;
    }

    emailjs.send("service_h3p48yr", "template_kz3gxtp", formData)
      .then(() => {
        inputForm.style.display = "none";
        thankYouMessage.style.display = "block";
      })
      .catch((error) => {
        console.error("Email sending failed", error);
        alert("Error. Try again later.");
      });
  });

  // Открытие/закрытие формы
  const modal = document.getElementById("modal");
  const openModalBtns = [document.getElementById("openModal"), document.getElementById("saveSearch")];
  const closeModalBtn = document.querySelector(".close");

  openModalBtns.forEach(btn => {
    btn?.addEventListener("click", e => {
      e.preventDefault();
      modal.style.display = "flex";
    });
  });

  closeModalBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });
});


async function injectStructuredDataForPropertyPage() {
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

    // 🧠 Meta description для SEO — берём keywords из всех объявлений
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
    console.error("Error loading structured-annunci.json on Property page:", err);
  }
}

// Вызовем после загрузки DOM
document.addEventListener("DOMContentLoaded", injectStructuredDataForPropertyPage);


