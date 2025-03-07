

document.addEventListener('DOMContentLoaded', function () {
    // Находим все изображения на странице
    const fullScreenLinks = document.querySelectorAll('.content-foto img');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalThumbnailsContainer = document.getElementById('modalThumbnails');
    const closeModalButton = document.getElementById('closeModal');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    let currentIndex = 0;

    // Функция для обновления изображения в модальном окне
    function updateModalImage() {
        modalImage.src = fullScreenLinks[currentIndex].src;

        // Обновляем активные миниатюры
        const thumbnails = modalThumbnailsContainer.querySelectorAll('.modal-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
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

    // Открытие модального окна при клике на изображение
    fullScreenLinks.forEach((image, index) => {
        image.addEventListener('click', () => {
            openModal(index);
        });
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

    // Добавление миниатюр в модальное окно
    fullScreenLinks.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image.src;
        thumbnail.alt = image.alt;
        thumbnail.classList.add('modal-thumbnail');
        thumbnail.dataset.index = index;

        thumbnail.addEventListener('click', (event) => {
            event.stopPropagation(); // Предотвращаем распространение события
            currentIndex = parseInt(thumbnail.dataset.index, 10);
            updateModalImage();
        });

        modalThumbnailsContainer.appendChild(thumbnail);
    });
});