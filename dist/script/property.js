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


document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('mapModal');
    const openModalBtn = document.querySelector('.glass-button2'); // Кнопка
    const closeModalBtn = document.querySelector('.close-btn1'); // Кнопка закрытия
    let mapPopup = null;

    openModalBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Чтобы не было перезагрузки страницы

        modal.style.display = 'flex'; // Показываем модальное окно

        // Проверяем, была ли карта уже создана
        if (!mapPopup) {
            setTimeout(() => {
                mapPopup = L.map('mapPopup').setView([39.8060500, 15.7963500], 13);
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapPopup);
                addMarkersToMap(mapPopup, window.Announcements || []);
            }, 100); // Даем время модальному окну появиться
        } else {
            setTimeout(() => mapPopup.invalidateSize(), 300); // Фикс для корректного отображения карты
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
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
