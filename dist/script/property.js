// Координаты статических маркеров (агентств)
const staticAgencies = [
    { lat: 39.808384, lng: 15.793641, name: "Agenzia immobiliare a Scalea", phone: "3791080060"},
    { lat: 53.479002, lng: -2.232827, name: "Agenzia immobiliare a Manchester", phone: "3791080060" },
    { lat: 41.896139, lng: 12.478197, name: "Agenzia immobiliare a Roma", phone: "3791080060" },
    { lat: 40.8518, lng: 14.2681, name: "Agenzia immobiliare a Napoli", phone: "3791080060" }
];

// Функция для добавления динамических маркеров
function addDynamicMarkers(map, announcementsData) {
    // Создаём стандартную синюю иконку для динамических маркеров
    const blueIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    announcementsData.forEach(function (announcement) {
        const { lat: latitude, lon: longitude, nomeAnunci, prezzo, rif: riferimento, fileSlug } = announcement;
        if (latitude && longitude) {
            // Используем `fileSlug`, если он есть, или `rif` как резервное значение
            const slug = fileSlug || riferimento;

            // Создаём HTML-содержимое для всплывающего окна
            const popupContent = `
                <strong>${nomeAnunci}</strong><br>
                Prezzo:€ ${prezzo}<br>
                RIF: ${riferimento}<br>
                <a href="/anunci/rif-${slug}/" style="text-decoration: none;">
                    <button style="margin-top: 10px; padding: 5px 10px; background: linear-gradient(270deg, rgba(0, 151, 178, 0.8), rgba(89, 142, 200, 0.8)); color: white; border: none; border-radius: 30px; cursor: pointer;">
                        Vedi Immobile
                    </button>
                </a>
            `;

            // Добавляем маркер на карту
            L.marker([latitude, longitude], { icon: blueIcon })
                .addTo(map)
                .bindPopup(popupContent); // Привязываем всплывающее окно с кнопкой
        } else {
            console.warn(`Координаты отсутствуют для объявления: ${riferimento}`);
        }
    });
}

// Функция для добавления статических маркеров
function addStaticMarkers(map, agencies) {
    // Создаём красную иконку для статических маркеров
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    agencies.forEach(agency => {
        // Создаём HTML-содержимое для всплывающего окна
        const popupContent = `
            <strong>${agency.name}</strong><br>
            <button style="margin-top: 10px; padding: 5px 10px; background: linear-gradient(270deg, rgba(0, 151, 178, 0.8), rgba(89, 142, 200, 0.8)); color: white; border: none; border-radius: 30px; cursor: pointer;">
                <a href="tel:+39${agency.phone}" style="color: white; text-decoration: none;">Chiamata</a>
            </button>
        `;

        // Добавляем маркер на карту
        L.marker([agency.lat, agency.lng], { icon: redIcon })
            .addTo(map)
            .bindPopup(popupContent); // Привязываем всплывающее окно с кнопкой
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const announcementsData = window.Announcements || [];

    // Инициализация первой карты
    const mapSmallElement = document.getElementById('map');
    if (mapSmallElement) {
        var map = L.map('map').setView([39.8060500, 15.7963500], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Добавляем динамические маркеры
        addDynamicMarkers(map, announcementsData);

        // Добавляем статические маркеры
        addStaticMarkers(map, staticAgencies);
    }

    // Инициализация второй карты
    const mapBigElement = document.getElementById('mapMedia');
    if (mapBigElement) {
        var mapMedia = L.map('mapMedia').setView([39.8060500, 15.7963500], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapMedia);

        // Добавляем динамические маркеры
        addDynamicMarkers(mapMedia, announcementsData);

        // Добавляем статические маркеры
        addStaticMarkers(mapMedia, staticAgencies);
    }
});




document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('mapModal');
    const openModalBtn = document.querySelector('.glass-button2'); // Кнопка открытия
    const closeModalBtn = document.querySelector('.close-btn1'); // Кнопка закрытия
    const carouselButtons = document.querySelectorAll('.carousel-btn'); // Кнопки карусели
    let mapPopup = null;

    openModalBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Чтобы не было перезагрузки страницы

        modal.style.display = 'flex'; // Показываем модальное окно

        // Скрываем кнопки карусели
        carouselButtons.forEach(button => {
            button.style.visibility = 'hidden';
        });

        // Проверяем, была ли карта уже создана
        if (!mapPopup) {
            setTimeout(() => {
                // Инициализация карты
                mapPopup = L.map('mapPopup').setView([39.8060500, 15.7963500], 13);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapPopup);

                // Добавляем динамические маркеры
                addDynamicMarkers(mapPopup, window.Announcements || []);

                // Добавляем статические маркеры
                addStaticMarkers(mapPopup, staticAgencies);
            }, 100); // Даем время модальному окну появиться
        } else {
            setTimeout(() => mapPopup.invalidateSize(), 300); // Фикс для корректного отображения карты
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';

        // Возвращаем видимость кнопкам карусели
        carouselButtons.forEach(button => {
            button.style.visibility = 'visible';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';

            // Возвращаем видимость кнопкам карусели
            carouselButtons.forEach(button => {
                button.style.visibility = 'visible';
            });
        }
    });
});


// Карусель изображений с поддержкой свайпов
document.addEventListener('DOMContentLoaded', function () {
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach((container) => {
        const images = container.querySelectorAll('.carousel-image');
        const prevButton = container.querySelector('.carousel-btn.prev');
        const nextButton = container.querySelector('.carousel-btn.next');

        if (!prevButton || !nextButton || images.length === 0) {
            console.warn('Карусель не настроена для контейнера:', container);
            return;
        }

        let currentIndex = 0;
        let startX = 0;
        let endX = 0;

        function updateCarousel(index) {
            images.forEach((image, i) => {
                image.classList.toggle('active', i === index);
            });
        }

        // Листаем влево
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel(currentIndex);
        });

        // Листаем вправо
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel(currentIndex);
        });

        // Добавляем обработку свайпов для мобильных устройств
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', () => {
            let swipeThreshold = 50; // Минимальная длина свайпа для срабатывания
            if (startX - endX > swipeThreshold) {
                // Свайп влево
                currentIndex = (currentIndex + 1) % images.length;
            } else if (endX - startX > swipeThreshold) {
                // Свайп вправо
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateCarousel(currentIndex);
        });

        // Инициализация первой картинки
        updateCarousel(0);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openModalBtns = [document.getElementById("openModal"), document.getElementById("saveSearch")];
    const closeModalBtn = document.querySelector(".close");

    // Открываем модальное окно по клику на любую из кнопок
    openModalBtns.forEach(button => {
        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                modal.style.display = "flex";
            });
        }
    });

    // Закрываем модальное окно
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Закрываем по клику вне формы
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Подключение EmailJS
    emailjs.init('S5yiwwzhcxkuEH6_j'); 

    const contactForm = document.getElementById('contactForm');
    const inputForm = document.getElementById('inputForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const submitButton = document.getElementById('submitButton');

    if (!contactForm || !inputForm || !thankYouMessage || !submitButton) {
        console.error('Non tutti gli elementi del modulo sono stati trovati!');
        return;
    }

    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); 

        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            surname: document.getElementById('surname')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            text: document.getElementById('text')?.value.trim() || '',
        };

        if (!formData.name || !formData.surname || !formData.phone) {
            alert('Si prega di compilare tutti i campi!');
            return;
        }

        emailjs.send('service_h3p48yr', 'template_kz3gxtp', formData)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            inputForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
        }, 
        function (error) {
            console.error('FAILED...', error);
            alert('Si è verificato un errore. Riprova più tardi.');
        });
    });
});
