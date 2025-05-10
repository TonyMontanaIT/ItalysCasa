// 1. Подгружаем JSON
async function fetchAnnouncementsData() {
    if (!window.cachedAnnouncementsData) {
        const res = await fetch("https://tonymontanait.github.io/italyscasa-content/anunci/index2_translated.json");
        if (!res.ok) throw new Error("Failed to load ad data");
        window.cachedAnnouncementsData = await res.json();
    }
    return window.cachedAnnouncementsData;
}

let globalAnnouncement = null;
let globalData = null;

function renderAnnouncement(announcement, lang) {
    const translated = announcement.translations?.[lang] || {};
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    };

    setText("upNomeAnunci", translated.nomeAnunci || announcement.nomeAnunci);
    setText("upNomeZona", translated.nomeZona || announcement.nomeZona);
    setText("upCitta", translated.city1 || announcement.city1);
    setText("upVia", translated.street1 || announcement.street1);
    setText("upRif", announcement.riferimento);
    setText("upPrezzo", announcement.prezzo);
    setText("rifInfo", announcement.riferimento);
    setText("tipoInfo", translated.tipo || announcement.tipo);
    setText("roomsInfo", announcement.rooms);
    setText("totalRoomsInfo", announcement.totalrooms);
    setText("bagniInfo", announcement.bagni);
    setText("zonam2Info", announcement.zonam2);
    setText("floorInfo", announcement.floor);
    setText("elevatorInfo", announcement.elevator);
    setText("terrazzoInfo", announcement.terrazzo);
    setText("giardinoInfo", announcement.giardino);
    setText("garageInfo", announcement.garage);
    setText("prezzoInfo", announcement.prezzo);
    setText("descrizioneTitle", translated.descrizione || announcement.descrizione);
    setText("h2t1", translated.h2t1 || announcement.h2t1);
    setText("text1", translated.text1 || announcement.text1);
    setText("h2t2", translated.h2t2 || announcement.h2t2);
    setText("text2", translated.text2 || announcement.text2);
    setText("h2t3", translated.h2t3 || announcement.h2t3);
    setText("text3", translated.text3 || announcement.text3);
    setText("h2t4", translated.h2t4 || announcement.h2t4);
    setText("text4", translated.text4 || announcement.text4);
    setText("h2t5", translated.h2t5 || announcement.h2t5);
    setText("text5", translated.text5 || announcement.text5);
    setText("h2t6", translated.h2t6 || announcement.h2t6);
    setText("text6", translated.text6 || announcement.text6);
    setText("prezzoDescrizione", announcement.prezzo);

    setText("modalRif", announcement.riferimento);
    setText("modalTipo", translated.tipo || announcement.tipo);
    setText("modalRooms", announcement.rooms);
    setText("modalTotalRooms", announcement.totalrooms);
    setText("modalBagni", announcement.bagni);
    setText("modalMq", announcement.zonam2);
    setText("modalFloor", announcement.floor);
    setText("modalElevator", announcement.elevator);
    setText("modalTerrazzo", announcement.terrazzo);
    setText("modalPrezzo", announcement.prezzo);
    setText("modalCity", translated.city1 || announcement.city1);
    setText("modalNome", translated.nomeAnunci || announcement.nomeAnunci);
    setText("modalZona", translated.nomeZona || announcement.nomeZona);
    setText("modalStreet", translated.street1 || announcement.street1);
    setText("modalArredi", translated.arredamenti || announcement.arredamenti);
    setText("modalGarage", announcement.garage);
    setText("modalGiardino", announcement.giardino);
    setText("modalPatio", announcement.patio);
    setText("modalCorte", announcement.corte);
}

document.addEventListener("DOMContentLoaded", async () => {
    const lang = localStorage.getItem("lang") || "it";

    const slugMatch = window.location.search.match(/[?&]rif=([a-zA-Z0-9_-]+)/);
    if (!slugMatch) return alert("RIF not found in URL!");
    const rif = slugMatch[1];

    const data = await fetchAnnouncementsData();
    const announcement = data.find(item => item.riferimento === rif || item.slug === rif);
    if (!announcement) return alert("Ad not found!");

    globalData = data;
    globalAnnouncement = announcement;

    renderAnnouncement(announcement, lang);

    // 🖼️ Вставка изображений в карусель и модалку
const carousel = document.getElementById("carouselImagesContainer");
const modalThumbs = document.getElementById("modalThumbnails");

if (carousel && modalThumbs && announcement.images?.length) {
  const imagesHtml = announcement.images.map((img, i) =>
    `<img src="https://tonymontanait.github.io/italyscasa-content/${encodeURIComponent(img.src)}" alt="${img.alt || 'Immagine dell\'annuncio'}" class="carousel-image ${i === 0 ? 'active' : ''}" loading="lazy">`
  ).join("");

  const thumbsHtml = announcement.images.map((img, i) =>
    `<img src="https://tonymontanait.github.io/italyscasa-content/${encodeURIComponent(img.src)}" alt="${img.alt || 'Miniatura'}" class="modal-thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}">`
  ).join("");

  carousel.innerHTML = imagesHtml;
  modalThumbs.innerHTML = thumbsHtml;
  

        // 🔄 Карусельная логика со стрелками
        const carouselImages = document.querySelectorAll('.carousel-image');
        const prevArrow = document.getElementById('carouselPrev');
        const nextArrow = document.getElementById('carouselNext');
        let currentSlide = 0;

        function updateCarouselSlide(index) {
            carouselImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
        }

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
                updateCarouselSlide(currentSlide);
            });

            nextArrow.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % carouselImages.length;
                updateCarouselSlide(currentSlide);
            });

            // 📱 Свайп (по желанию)
            const container = document.querySelector('.carousel-container');
            let startX = 0;
            let endX = 0;

            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            container.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            });

            container.addEventListener('touchend', () => {
                const swipeThreshold = 50;
                if (startX - endX > swipeThreshold) {
                    currentSlide = (currentSlide + 1) % carouselImages.length;
                    updateCarouselSlide(currentSlide);
                } else if (endX - startX > swipeThreshold) {
                    currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
                    updateCarouselSlide(currentSlide);
                }
            });
        }

        updateCarouselSlide(currentSlide);

        // 🖼️ Логика модального окна
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const closeModalButton = document.getElementById('closeModal');
        const modalPrev = document.getElementById('modalPrev');
        const modalNext = document.getElementById('modalNext');
        const modalThumbnails = document.querySelectorAll('.modal-thumbnail');
        const fullScreenLinks = document.querySelectorAll('.carousel-image');
        let currentIndex = 0;

        function updateModalImage() {
            modalImage.src = fullScreenLinks[currentIndex].src;
            modalThumbnails.forEach((thumbnail, index) => {
                thumbnail.classList.toggle('active', index === currentIndex);
            });
        }

        function openModal(index) {
            currentIndex = index;
            updateModalImage();
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        }

        fullScreenLinks.forEach((image, index) => {
            image.addEventListener('click', () => openModal(index));
        });

        const openModalBtn = document.querySelector('.open-modal');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(0);
            });
        }

        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });

        modalPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : fullScreenLinks.length - 1;
            updateModalImage();
        });

        modalNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % fullScreenLinks.length;
            updateModalImage();
        });

        modalThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(thumbnail.dataset.index, 10);
                if (!isNaN(index)) {
                    currentIndex = index;
                    updateModalImage();
                }
            });
        });

        // 📱 Свайп в модалке
        let touchStartX = 0;
        let touchEndX = 0;

        modalImage.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
        });

        modalImage.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].clientX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                currentIndex = (currentIndex + 1) % fullScreenLinks.length;
            } else if (touchEndX > touchStartX + swipeThreshold) {
                currentIndex = (currentIndex - 1 + fullScreenLinks.length) % fullScreenLinks.length;
            }
            updateModalImage();
        });
    }

    // 🎥 Видео кнопки
    if (announcement.video) {
        const videoBtn = document.getElementById("videoButton");
        if (videoBtn) {
            videoBtn.href = announcement.video;
            videoBtn.style.display = "inline-block";
        }
        const vidIcon = document.getElementById("carouselVideoLink");
        if (vidIcon) vidIcon.href = announcement.video;
    }

    if (announcement.video360) {
        const video360Btn = document.getElementById("video360Button");
        if (video360Btn) {
            video360Btn.href = announcement.video360;
            video360Btn.style.display = "inline-block";
        }
        const vid360Icon = document.getElementById("carousel360Link");
        if (vid360Icon) vid360Icon.href = announcement.video360;
    }

    // 🎲 Рандомные карточки
    const randomIndexes = [];
    while (randomIndexes.length < 3) {
        const rand = Math.floor(Math.random() * data.length);
        if (!randomIndexes.includes(rand) && data[rand].slug !== rif) {
            randomIndexes.push(rand);
        }
    }

randomIndexes.forEach((idx, i) => {
  const r = data[idx];
  const n = i + 1;

  const imageObj = r.images && r.images.length ? r.images[0] : { src: "Foto/default.jpg", alt: "Default" };
  const imgSrc = `https://tonymontanait.github.io/italyscasa-content/${encodeURIComponent(imageObj.src)}`;
  const imgAlt = imageObj.alt || `Anteprima immobile RIF ${r.riferimento}`;

  document.getElementById(`randomImg${n}`).src = imgSrc;
  document.getElementById(`randomImg${n}`).alt = imgAlt;
  document.getElementById(`randomNome${n}`).textContent = r.nomeAnunci;
  document.getElementById(`randomPrezzoLink${n}`).textContent = `€ ${r.prezzo}`;
  document.getElementById(`randomPrezzoLink${n}`).href = `/anunci/dynamic/?rif=${r.riferimento}`;
  document.getElementById(`randomRIF${n}`).textContent = `RIF: ${r.riferimento}`;
  document.getElementById(`randomBagni${n}`).textContent = r.bagni;
  document.getElementById(`randomMq${n}`).textContent = r.zonam2;
  document.getElementById(`randomRooms${n}`).textContent = r.rooms;
  document.getElementById(`randomTerrazzo${n}`).textContent = r.terrazzo;
  document.getElementById(`randomButtonLink${n}`).href = `/anunci/dynamic/?rif=${r.riferimento}`;
});


    // 🗺️ Инициализация карты
    if (announcement.latitude && announcement.longitude) {
        const lat = parseFloat(announcement.latitude);
        const lon = parseFloat(announcement.longitude);

        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        const blueIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        const agencies = [
            { lat: 39.808384, lng: 15.793641, name: "Real estate agency in Scalea" },
            { lat: 53.479002, lng: -2.232827, name: "Real estate agency in Manchester" },
            { lat: 41.896139, lng: 12.478197, name: "Real estate agency in Rome" },
            { lat: 40.8518, lng: 14.2681, name: "Real estate agency in Naples" },
        ];

        const initMap = (id) => {
            const mapEl = document.getElementById(id);
            if (!mapEl) return;

            const map = L.map(id).setView([lat, lon], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

  agencies.forEach(agency => {
    const popupContent = `
      <strong>${agency.name}</strong><br>
      <button style="margin-top: 10px; padding: 5px 10px; background: linear-gradient(270deg, rgba(0, 151, 178, 0.8), rgba(89, 142, 200, 0.8)); color: white; border: none; border-radius: 30px; cursor: pointer;">
        <a href="tel:+39${agency.phone}" style="color: white; text-decoration: none;">Call</a>
      </button>
    `;
    L.marker([agency.lat, agency.lng], { icon: redIcon }).addTo(map).bindPopup(popupContent);
  });

            L.marker([lat, lon], { icon: blueIcon })
                .addTo(map)
                .bindPopup(`<strong>${announcement.nomeAnunci}</strong><br>Price: €${announcement.prezzo}<br>RIF: ${announcement.riferimento}`);
        };

        initMap("map-small");
        initMap("map-big");
    }
});

window.addEventListener("languageChanged", () => {
    const newLang = localStorage.getItem("lang") || "it";
    if (globalAnnouncement) {
        renderAnnouncement(globalAnnouncement, newLang);
    }
});

// 📧 Подключение EmailJS
emailjs.init('S5yiwwzhcxkuEH6_j'); // Твой Public Key

// Функция для управления формой обратной связи
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const inputForm = document.getElementById('inputForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const submitButton = document.getElementById('submitButton');

    // Если элементы формы не найдены, выводим ошибку в консоль
    if (!contactForm || !inputForm || !thankYouMessage || !submitButton) {
        console.error('Not all form elements were found!');
        return;
    }

    // Обработка отправки формы
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение

        // Собираем данные из формы
        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            surname: document.getElementById('surname')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            text: document.getElementById('text')?.value.trim() || '',
        };

        // Проверяем, что все поля заполнены
        if (!formData.name || !formData.surname || !formData.phone) {
            alert('Please fill in all fields!');
            return;
        }

        // Отправляем данные через EmailJS
        emailjs.send('service_h3p48yr', 'template_kz3gxtp', formData)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                // После успешной отправки скрываем форму и показываем блок благодарности
                inputForm.style.display = 'none';
                thankYouMessage.style.display = 'block';
            }, function (error) {
                console.error('FAILED...', error);
                alert('An error occurred. Please try again later.');
            });
    });
});

// 📞 Телефонный ввод
document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "it", // Устанавливаем Италию по умолчанию
        separateDialCode: true, // Отображает код страны отдельно
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    // Если нужно, можно получить полный номер (код + номер)
    phoneInput.addEventListener("blur", function () {
        console.log("Full number: ", iti.getNumber());
    });
});

// 🖼️ Модальное окно
document.addEventListener('DOMContentLoaded', function () {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalButton = document.getElementById('closeModalButton');

    // Открытие модального окна
    openModalButton.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение
        modalOverlay.style.display = 'flex'; // Показываем модальное окно
    });

    // Закрытие модального окна
    closeModalButton.addEventListener('click', function () {
        modalOverlay.style.display = 'none'; // Скрываем модальное окно
    });

    // Закрытие окна при клике на затемнённый фон
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none'; // Скрываем модальное окно, если кликнули на фон
        }
    });
});

// 📋 Копирование ссылки
document.addEventListener('DOMContentLoaded', function () {
    const copyLinkButton = document.getElementById('copyLinkButton');

    // Добавляем обработчик события на кнопку
    copyLinkButton.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение ссылки

        // Получаем текущий URL
        const currentUrl = window.location.href;

        // Копируем URL в буфер обмена
        navigator.clipboard.writeText(currentUrl).then(() => {
            // Показываем уведомление о успешном копировании
            alert('link copied: ' + currentUrl);
        }).catch(err => {
            // Обработка ошибок (если буфер обмена недоступен)
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link. Try again.');
        });
    });
});

// 📍 Прокрутка к карте
document.addEventListener('DOMContentLoaded', function () {
    const scrollToMapButton = document.getElementById('scrollToMapButton');
    const mapBigSection = document.getElementById('mapBig');

    // Обработчик события для кнопки
    scrollToMapButton.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем стандартное поведение ссылки

        // Плавная прокрутка до блока .map-big с учетом смещения
        mapBigSection.scrollIntoView({
            behavior: 'smooth', // Плавная анимация
            block: 'start'      // Выравнивание по верхней части экрана
        });

        // Добавляем смещение вручную
        const offset = 100; // Высота шапки или другой отступ
        const elementPosition = mapBigSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", async () => {
  const head = document.head;
  const existingStructured = document.getElementById("structured-detail-annuncio");
  if (existingStructured) existingStructured.remove();

  const slugMatch = window.location.search.match(/[?&]rif=([a-zA-Z0-9_-]+)/);
  if (!slugMatch) return console.error("RIF not found in URL!");
  const rif = slugMatch[1];

  try {
    const data = await fetchAnnouncementsData();
    const announcement = data.find(item => item.riferimento === rif || item.slug === rif);
    if (!announcement) return console.error("Ad not found!");

    const generateKeywords = (ann) => {
      const textPool = [
        ann.nomeAnunci, ann.city1, ann.tipo, ann.descrizione,
        ann.text1, ann.text2, ann.text3, ann.text4
      ].join(" ").toLowerCase();
      const matches = textPool.match(/[a-zà-ú]{4,}/gi) || [];
      const freq = {};
      matches.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
      });
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word)
        .join(", ");
    };

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": announcement.nomeAnunci || "",
          "description": announcement.text1 || announcement.descrizione || "",
          "image": announcement.images?.[0]?.src
            ? `https://tonymontanait.github.io/italyscasa-content/${announcement.images[0].src}`
            : "https://tonymontanait.github.io/italyscasa-content/uploads/default.jpg",
          "offers": {
            "@type": "Offer",
            "url": `https://italyscasa.com/anunci/dynamic/?rif=${announcement.riferimento}`,
            "price": parseInt((announcement.prezzo || announcement.prezzo1 || "").replace(/\D/g, ""), 10) || "",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "inLanguage": "it",
          "isAccessibleForFree": true,
          "wordCount": (announcement.text1 || announcement.descrizione || "").split(/\s+/).length,
          "keywords": generateKeywords(announcement),
          "address": {
            "@type": "PostalAddress",
            "addressLocality": announcement.city1 || "",
            "streetAddress": announcement.indirizzo || ""
          },
          "geo": announcement.latitudine && announcement.longitudine ? {
            "@type": "GeoCoordinates",
            "latitude": announcement.latitudine,
            "longitude": announcement.longitudine
          } : undefined,
          "publisher": {
            "@type": "Organization",
            "name": "ItalysCasa",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tonymontanait.github.io/italyscasa-content/uploads/logo.webp"
            }
          },
          "sameAs": [
            "https://www.instagram.com/italyscasa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
            "https://www.facebook.com/profile.php?id=61551668563870",
            "https://www.tiktok.com/@italyscasa1?is_from_webapp=1&sender_device=pc"
          ]
        }
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "structured-detail-annuncio";
    script.textContent = JSON.stringify(structuredData, null, 2);
    head.appendChild(script);

    // 🧠 Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", (announcement.descrizione || announcement.text1 || "").slice(0, 160));
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = (announcement.descrizione || announcement.text1 || "").slice(0, 160);
      head.appendChild(meta);
    }

  } catch (err) {
    console.error("Error loading or generating structured data ad:", err);
  }
});
