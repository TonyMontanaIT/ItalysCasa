// Смена фонового изображения
document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.querySelector('.hero-section');
    let currentImage = 1;

    function changeBackgroundImage() {
        currentImage = (currentImage % 10) + 1;
        heroSection.classList.remove(`bg${(currentImage - 1 === 0) ? 10 : currentImage - 1}`);
        heroSection.classList.add(`bg${currentImage}`);
    }

    // Запускаем функцию сразу при загрузке страницы
    changeBackgroundImage();
    // Время смены картинки
    setInterval(changeBackgroundImage, 4000);
});


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
        var mapSmall = L.map('map').setView([39.8060500, 15.7963500], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapSmall);

        // Добавляем динамические маркеры
        addDynamicMarkers(mapSmall, announcementsData);

        // Добавляем статические маркеры
        addStaticMarkers(mapSmall, staticAgencies);
    }

    // Инициализация второй карты
    const mapBigElement = document.getElementById('mapMedia');
    if (mapBigElement) {
        var mapBig = L.map('mapMedia').setView([39.8060500, 15.7963500], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapBig);

        // Добавляем динамические маркеры
        addDynamicMarkers(mapBig, announcementsData);

        // Добавляем статические маркеры
        addStaticMarkers(mapBig, staticAgencies);
    }
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
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

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



document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const allBlocks = Array.from(document.querySelectorAll('.bottom-block'));

    // Функция для фильтрации блоков
    function filterBlocks(query) {
        query = query.trim().toLowerCase();

        if (!query) {
            // Если поле поиска пустое, восстанавливаем исходное состояние
            allBlocks.forEach((block, index) => {
                block.style.display = index < 10 ? 'block' : 'none';
            });
            clearButton.style.display = 'none';
            return;
        }

        // Скрываем все блоки
        allBlocks.forEach(block => {
            block.style.display = 'none';
        });

        // Фильтруем блоки по данным
        const filteredBlocks = allBlocks.filter(block => {
            const { riferimento, city, zona, tipo } = block.dataset;
            return [riferimento, city, zona, tipo].some(field =>
                String(field).toLowerCase().includes(query)
            );
        });

        // Показываем только отфильтрованные блоки
        filteredBlocks.forEach(block => {
            block.style.display = 'block';
        });

        // Если результатов нет, показываем сообщение
        if (filteredBlocks.length === 0) {
            alert('Nessun risultato trovato.');
        }
    }

    // Обработчик ввода текста
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        filterBlocks(query);
        clearButton.style.display = query ? 'block' : 'none';
    });

    // Обработчик сброса поиска
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        allBlocks.forEach((block, index) => {
            block.style.display = index < 10 ? 'block' : 'none';
        });
        clearButton.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const allBlocks = Array.from(document.querySelectorAll('.bottom-block'));
    const loadMoreButton = document.getElementById('loadMoreButton');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    let displayedCount = 0; // Счётчик отображённых объявлений

    // Функция для отображения следующих 10 объявлений
    function showNextBatch() {
        const start = displayedCount;
        const end = displayedCount + 10;

        // Показываем следующие 10 объявлений
        allBlocks.slice(start, end).forEach(block => {
            block.style.display = 'block';
        });

        // Обновляем счётчик
        displayedCount += 10;

        // Если все объявления показаны, скрываем кнопку
        if (displayedCount >= allBlocks.length) {
            loadMoreButton.style.display = 'none';
            loadMoreContainer.textContent = 'Все объявления показаны!';
        }
    }

    // Инициализация: показываем первые 10 объявлений
    showNextBatch();

    // Обработчик для кнопки "Показать ещё"
    loadMoreButton.addEventListener('click', showNextBatch);
});


document.addEventListener("scroll", function () {
    const icons = document.querySelector(".icons1");
    const stopPosition = 200; // Высота от низа страницы, где кнопки должны остановиться

    // Получаем текущую позицию скролла
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    // Если достигнута заданная высота от низа страницы
    if (scrollPosition >= pageHeight - stopPosition) {
        icons.style.position = "absolute";
        icons.style.bottom = `${stopPosition}px`;
    } else {
        icons.style.position = "fixed";
        icons.style.bottom = "10px"; // Возвращаем исходное положение
    }
});