const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 🔧 Путь к translations.json
const translationsPath = path.join(__dirname, 'src', 'script', 'translations.json');

// 🔍 Расширения файлов, где будем искать ключи
const filesToScan = glob.sync('src/**/*.{njk,html,js}', { nodir: true });

// 📦 Загружаем translations.json
let translations = {};
if (fs.existsSync(translationsPath)) {
  translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));
}

// 🗝 Сбор всех ключей data-i18n
const allKeys = new Set();

const i18nRegex = /data-i18n=["']([^"']+)["']/g;

filesToScan.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = i18nRegex.exec(content)) !== null) {
    allKeys.add(match[1]);
  }
});

// ✏️ Добавляем отсутствующие ключи в каждый язык
const updatedLanguages = {};

Object.keys(translations).forEach(lang => {
  updatedLanguages[lang] = translations[lang] || {};
  allKeys.forEach(key => {
    if (!(key in updatedLanguages[lang])) {
      updatedLanguages[lang][key] = lang === 'en' ? key.replace(/_/g, ' ') : '';
    }
  });
});

// 💾 Сохраняем обновлённый translations.json
fs.writeFileSync(translationsPath, JSON.stringify(updatedLanguages, null, 2), 'utf-8');

console.log('✅ Translations updated successfully!');
