          
                        //скрол шапки//
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } 
            else {
                header.classList.remove('scrolled');
            }
        });

            function scrollToTop() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }  


  // Функция для получения данных GoatCounter
  async function fetchVisitorCount() {
    try {
      const response = await fetch('https://229988.goatcounter.com/api/v0/stats/total?start=2023-01-01');
      const data = await response.json();
      document.getElementById('visitor-count').innerText = data.total.visitors;
    } catch (error) {
      console.error('Ошибка при получении данных GoatCounter:', error);
    }
  }

  // Запускаем функцию при загрузке страницы
  fetchVisitorCount();        

function toggleMenu() {
    let nav = document.querySelector("nav");
    let burger = document.querySelector(".burger-menu");
    nav.classList.toggle("nav-active");
    burger.classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', () => {
    const mapScript = document.createElement('script');
    mapScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.body.appendChild(mapScript);
});