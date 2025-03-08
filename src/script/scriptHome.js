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
    setInterval(changeBackgroundImage, 10000);
});


// Инициализация карты
// Добавление меток на карту
document.addEventListener('DOMContentLoaded', function () {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Элемент #map не найден!');
        return;
    }

    var map = L.map('map').setView([39.8060500, 15.7963500], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Получаем данные объявлений
    const announcementsData = window.Announcements || [];
    console.log('Данные объявлений:', announcementsData);

    announcementsData.forEach(function (announcement) {
        const { latitude, longitude, nomeAnunci, prezzo, riferimento } = announcement.data;

        if (latitude && longitude) {
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(`
                    <strong>${nomeAnunci}</strong><br>
                    Цена: ${prezzo} €<br>
                    RIF: ${riferimento}
                `);
        } else {
            console.warn(`Координаты отсутствуют для объявления: ${riferimento}`);
        }
    });
});


// Инициализация карты
// Добавление меток на карту
document.addEventListener('DOMContentLoaded', function () {
    const mapElement = document.getElementById('mapMedia');
    if (!mapElement) {
        console.error('Элемент #map не найден!');
        return;
    }

    var map = L.map('mapMedia').setView([39.8060500, 15.7963500], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Получаем данные объявлений
    const announcementsData = window.Announcements || [];
    console.log('Данные объявлений:', announcementsData);

    announcementsData.forEach(function (announcement) {
        const { latitude, longitude, nomeAnunci, prezzo, riferimento } = announcement.data;

        if (latitude && longitude) {
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(`
                    <strong>${nomeAnunci}</strong><br>
                    Цена: ${prezzo} €<br>
                    RIF: ${riferimento}
                `);
        } else {
            console.warn(`Координаты отсутствуют для объявления: ${riferimento}`);
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

// Google Places API для рейтинга
function initMap() {
    const placeId = 'ChIJIdDb8nYfPxMRpHYqAa3wyz4'; // Замени на свой ID места
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
       } else {
    console.error("Google Maps API не загружен!");
        }
    service.getDetails({ placeId: placeId }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            document.getElementById('rating').textContent = place.rating || 'Нет данных';
        } else {
            console.error('Ошибка при получении данных рейтинга:', status);
        }
    });
}

// Вызов функции получения рейтинга
document.addEventListener('DOMContentLoaded', function () {
    initMap();
});


        function updateSearchQuery(query, button) {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = ''; 
            searchInput.value = query;

            const activeUnderline = document.querySelector('.active-underline');
            const options = document.querySelectorAll('.search-bar-options span');

            options.forEach((option, index) => {
                if (button === option.textContent.trim()) {
                    const rect = option.getBoundingClientRect();
                    const containerRect = document.querySelector('.search-bar-options').getBoundingClientRect();

                    // Позиционируем активную линию под выбранной кнопкой
                    activeUnderline.style.width = '24%'; 
                    activeUnderline.style.left = `${rect.left - containerRect.left}px`;
                    activeUnderline.style.backgroundColor = '#FFFFFF';
                }
            });
        }

        window.onload = function() {
            const defaultButton = document.querySelector('.search-bar-options span:first-child');
            updateSearchQuery('Vendita Provincia, Comune, Zona, Riferimento', defaultButton.textContent.trim());
        };
