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
    const mapSmallElement = document.getElementById('map-small');
    if (mapSmallElement) {
        var mapSmall = L.map('map-small').setView([39.8060500, 15.7963500], 13);
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
    const mapBigElement = document.getElementById('map-big');
    if (mapBigElement) {
        var mapBig = L.map('map-big').setView([39.8060500, 15.7963500], 13);
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


document.addEventListener('DOMContentLoaded', function () {
    const fullScreenLinks = document.querySelectorAll('.carousel-image');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalThumbnails = document.querySelectorAll('.modal-thumbnail');
    const closeModalButton = document.getElementById('closeModal');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    let currentIndex = 0;

    // Функция для показа изображения в модальном окне
    function updateModalImage() {
        modalImage.src = fullScreenLinks[currentIndex].src;

        modalThumbnails.forEach((thumbnail, index) => {
            if (index === currentIndex) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
            }
        });
    }



        // Добавляем обработчики свайпов
    let touchStartX = 0;
    let touchEndX = 0;

    modalImage.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    modalImage.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Минимальное расстояние для свайпа
        if (touchEndX < touchStartX - swipeThreshold) {
            // Свайп влево → следующее изображение
            currentIndex = (currentIndex < fullScreenLinks.length - 1) ? currentIndex + 1 : 0;
            updateModalImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Свайп вправо → предыдущее изображение
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : fullScreenLinks.length - 1;
            updateModalImage();
        }
    }

    

    // Функция для открытия модального окна
    function openModal(index) {
        currentIndex = index;
        updateModalImage();
        modal.style.display = 'block';
        document.body.classList.add('modal-open'); // Размытие фона
    }

    // Открытие модального окна при клике на главное изображение
    fullScreenLinks.forEach((image, index) => {
        image.addEventListener('click', () => {
            openModal(index);
        });
    });

    // Открытие модального окна при клике на иконку камеры
    document.querySelector('.open-modal').addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем переход по ссылке
        openModal(0); // Открываем первое изображение
    });

    // Закрытие модального окна при клике на крестик
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Убираем размытие фона
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); // Убираем размытие фона
        }
    });

    // Переключение изображений по стрелкам
    modalPrev.addEventListener('click', (event) => {
        event.stopPropagation(); // Предотвращаем распространение события
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : fullScreenLinks.length - 1;
        updateModalImage();
    });

    modalNext.addEventListener('click', (event) => {
        event.stopPropagation(); // Предотвращаем распространение события
        currentIndex = (currentIndex < fullScreenLinks.length - 1) ? currentIndex + 1 : 0;
        updateModalImage();
    });

    // Переключение изображений по превью
    modalThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (event) => {
            event.stopPropagation(); // Предотвращаем распространение события
            const index = parseInt(thumbnail.dataset.index, 10);
            if (!isNaN(index)) {
                currentIndex = index;
                updateModalImage();
            }
        });
    });
});
                    // Подключение EmailJS
            emailjs.init('S5yiwwzhcxkuEH6_j'); // Твой Public Key

                 // Функция для управления формой обратной связи
            document.addEventListener('DOMContentLoaded', function () {
                const contactForm = document.getElementById('contactForm');
                const inputForm = document.getElementById('inputForm');
                const thankYouMessage = document.getElementById('thankYouMessage');
                const submitButton = document.getElementById('submitButton');

                 // Если элементы формы не найдены, выводим ошибку в консоль
                if (!contactForm || !inputForm || !thankYouMessage || !submitButton) {
            console.error('Non tutti gli elementi del modulo sono stati trovati!');
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
            alert('Si prega di compilare tutti i campi!');
                return;
            }

                 // Отправляем данные через EmailJS
            emailjs.send('service_h3p48yr', 'template_kz3gxtp', formData)
            .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);

                 // После успешной отправки скрываем форму и показываем блок благодарности
            inputForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
            }, 
            function (error) {
            console.error('FAILED...', error);
            alert('Si è verificato un errore. Riprova più tardi.');
            });
    });
});


 document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('phone');

    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "it", // Устанавливаем Италию по умолчанию
        separateDialCode: true, // Отображает код страны отдельно
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    // Если нужно, можно получить полный номер (код + номер)
    phoneInput.addEventListener("blur", function () {
        console.log("Полный номер: ", iti.getNumber());
    });
});           


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
