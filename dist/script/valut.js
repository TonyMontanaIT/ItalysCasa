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
            city: document.getElementById('city')?.value.trim() || '',
            street: document.getElementById('street')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            calltime: document.getElementById('call-time')?.value.trim() || '',
            propertytype: document.getElementById('property-type')?.value.trim() || '',
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