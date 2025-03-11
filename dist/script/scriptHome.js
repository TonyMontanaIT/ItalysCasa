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


function addMarkersToMap(map, announcementsData) {
    announcementsData.forEach(function (announcement) {
        const { lat: latitude, lon: longitude, nomeAnunci, prezzo, rif: riferimento } = announcement;
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
        addMarkersToMap(mapSmall, announcementsData);
    }

    // Инициализация второй карты
    const mapBigElement = document.getElementById('mapMedia');
    if (mapBigElement) {
        var mapBig = L.map('mapMedia').setView([39.8060500, 15.7963500], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapBig);
        addMarkersToMap(mapBig, announcementsData);
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
    const service = new google.maps.places.PlacesService(document.createElement('div'));
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


document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const clearButton = document.getElementById('clearSearch');
  const contentBottom = document.querySelector('.content-bottom');
  const allBlocks = Array.from(document.querySelectorAll('.bottom-block'));
  const pagination = document.querySelector('.pagination');
  
  // Сохраняем исходные данные
  const originalHTML = contentBottom.innerHTML;

  // Фильтрация
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    clearButton.style.display = query ? 'block' : 'none';
    pagination.style.display = query ? 'none' : 'flex';

    if (!query) {
      contentBottom.innerHTML = originalHTML;
      initializeCarousels();
      return;
    }

    const filteredBlocks = allBlocks.filter(block => {
      const { riferimento, city, zona, tipo } = block.dataset;
      return [riferimento, city, zona, tipo].some(field => 
        String(field).toLowerCase().includes(query)
      );
    });

    // Очистка контейнера перед вставкой
    contentBottom.innerHTML = '';
    
    // Добавляем отфильтрованные блоки
    filteredBlocks.forEach(block => {
      contentBottom.appendChild(block.cloneNode(true));
    });

    initializeCarousels(); // Реинициализация каруселей
  });

  // Сброс
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    contentBottom.innerHTML = originalHTML;
    clearButton.style.display = 'none';
    pagination.style.display = 'flex';
    initializeCarousels();
  });
});