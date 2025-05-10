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
            city: document.getElementById('city')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
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
            }, 
            function (error) {
            console.error('FAILED...', error);
            alert('An error occurred. Please try again later..');
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