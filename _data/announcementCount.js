const fs = require("fs");
const path = require("path");

// Функция для подсчета файлов
function countFilesInDirectory(directoryPath, extension = ".md") {
    try {
        // Читаем содержимое папки
        const files = fs.readdirSync(directoryPath);
        // Фильтруем только файлы с нужным расширением
        const filteredFiles = files.filter(file => path.extname(file).toLowerCase() === extension);
        return filteredFiles.length;
    } catch (error) {
        console.error(`Ошибка при чтении директории: ${error}`);
        return 0;
    }
}

// Путь к папке _announcements
const announcementsDir = path.join(__dirname, "../src/_announcements");

// Подсчитываем количество файлов .md
const announcementCount = countFilesInDirectory(announcementsDir);

// Экспортируем данные для использования в Eleventy
module.exports = {
    count: announcementCount
};
console.log(`Количество объявлений: ${announcementCount}`);