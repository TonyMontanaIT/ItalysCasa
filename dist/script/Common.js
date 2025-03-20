          
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