 

document.addEventListener("DOMContentLoaded", () => {
  const domainLangMap = {
    "italyscasa.com": "en",
    "italyscasa.it": "it",
    "italyscasa.de": "de",
    "italyscasa.pl": "pl",
    "italyscasa.fr": "fr",
    "italyscasa.lv": "lv",
    "italyscasa.us": "en",
    "italyscasa.uk": "en"
  };

  const langs = {
    en: "italyscasa.com",
    it: "italyscasa.it",
    de: "italyscasa.de",
    pl: "italyscasa.pl",
    fr: "italyscasa.fr",
    lv: "italyscasa.lv",
    us: "italyscasa.us",
    uk: "italyscasa.uk"
  };

  const hostname = window.location.hostname;
  const currentLang = domainLangMap[hostname] || "en";

 if (!localStorage.getItem("lang")) {
  localStorage.setItem("lang", currentLang);
  window.dispatchEvent(new Event("languageChanged"));
}


  // hreflang + canonical
  const path = window.location.pathname;
  const head = document.querySelector("head");

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = `https://${langs["en"]}${path}`;
  head.appendChild(canonical);

  Object.entries(langs).forEach(([lang, domain]) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = lang;
    link.href = `https://${domain}${path}`;
    head.appendChild(link);
  });
});







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
    let nav = document.querySelector(".section-push nav");
    let burger = document.querySelector(".burger-menu");
    nav.classList.toggle("nav-active");
    burger.classList.toggle("active");
}




document.addEventListener("DOMContentLoaded", () => {
  const breadcrumbsContainer = document.getElementById("breadcrumbs");
  if (!breadcrumbsContainer) return;

  const pathParts = window.location.pathname.split("/").filter(Boolean);

  const crumbs = [{ name: "Home", url: "/" }];

  if (pathParts.length) {
    pathParts.forEach((part, index) => {
      let name = decodeURIComponent(part.replace(/-/g, " "));

      // Небольшой автоперевод некоторых путей
      if (name.toLowerCase() === "blog") name = "Blog";
      if (name.toLowerCase() === "anunci") name = "Annunci";
      if (name.toLowerCase() === "blogpage") name = "Articolo";
      if (name.toLowerCase() === "dynamic") name = "Annuncio";
      if (name.toLowerCase() === "property") name = "Immobili";

      const url = "/" + pathParts.slice(0, index + 1).join("/") + "/";
      crumbs.push({ name, url });
    });
  }

  breadcrumbsContainer.innerHTML = crumbs
    .map((crumb, index) => {
      if (index !== crumbs.length - 1) {
        return `<a href="${crumb.url}">${crumb.name}</a> <span class="separator">/</span>`;
      } else {
        return `<span>${crumb.name}</span>`;
      }
    })
    .join("");

  // ================= SEO STRUCTURED DATA =================
  const head = document.head;
  const existingSchema = document.getElementById("breadcrumbs-schema");
  if (existingSchema) existingSchema.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": window.location.origin.replace(/\/$/, "") + crumb.url
    }))
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "breadcrumbs-schema";
  script.textContent = JSON.stringify(schema, null, 2);
  head.appendChild(script);
});




let translations = {};
let currentLang = 'en';

async function loadTranslations() {
  try {
    const res = await fetch('/script/translations.json');
    translations = await res.json();

    const savedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.slice(0, 2).toLowerCase();

    if (savedLang && translations[savedLang]) {
      currentLang = savedLang;
    } else if (translations[browserLang]) {
      currentLang = browserLang;
    }

    applyTranslations();
  } catch (error) {
    console.error('Ошибка загрузки перевода:', error);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('placeholder', translations[currentLang][key]);
    }
  });

    document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    if (translations[currentLang]?.[key]) {
      el.dataset.i18nValueTranslated = translations[currentLang][key];
    }
  });


  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('alt', translations[currentLang][key]);
    }
  });
}

// Вызываем загрузку переводов после полной загрузки страницы
document.addEventListener('DOMContentLoaded', loadTranslations);


document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('lang-switcher');
  if (switcher) {
    switcher.value = currentLang;

switcher.addEventListener('change', () => {
  const selectedLang = switcher.value;
  if (translations[selectedLang]) {
    currentLang = selectedLang;
    localStorage.setItem('lang', selectedLang);
    applyTranslations();

    // Важное обновление динамического контента
    const langEvent = new CustomEvent("languageChanged");
    window.dispatchEvent(langEvent);
  }
});

  }
});
