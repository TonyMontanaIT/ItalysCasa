const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Копируем статические файлы
    eleventyConfig.addPassthroughCopy('src/styles'); // Стили
    eleventyConfig.addPassthroughCopy('src/script'); // Скрипты
    eleventyConfig.addPassthroughCopy('src/Foto'); // Изображения

    // Фильтр для преобразования пути в slug (чистый URL)
    eleventyConfig.addFilter("slugify", function (value) {
        return value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    });

    // Фильтр для JSON
    eleventyConfig.addFilter("json", function(value) {
        return JSON.stringify(value, null, 2);
    });

    // Фильтр для Markdown → HTML  
    let markdownLibrary = markdownIt({ html: true });
    eleventyConfig.setLibrary("md", markdownLibrary);

    eleventyConfig.addFilter("markdown", (content) => {
        return markdownLibrary.render(content);
    });

    // Коллекции
    eleventyConfig.addCollection('announcements', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements/*.md')
            .sort((a, b) => {
                let priceA = parseFloat(a.data.prezzo.replace(/\D/g, "")) || 0;
                let priceB = parseFloat(b.data.prezzo.replace(/\D/g, "")) || 0;
                return priceB - priceA; // Сортировка от самого дорогого к дешевому
            });
    });


    eleventyConfig.addCollection('blog', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements3/*.md')
            .sort((a, b) => b.data.blogcol - a.data.blogcol);
    });

    eleventyConfig.addCollection('affitii', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements5/*.md')
            .sort((a, b) => b.data.blogcol - a.data.blogcol);
    });

    eleventyConfig.addCollection('random', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements/*.md');
    });

    eleventyConfig.addCollection('services', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements2/*.md');
    });

    eleventyConfig.addCollection('agenzia', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements4/*.md');
    });

    eleventyConfig.addCollection("mapData", function (collectionApi) {
        return collectionApi.getFilteredByGlob("./src/_announcements/*.md").map(item => ({
            lat: item.data.latitude,
            lon: item.data.longitude,
            nomeAnunci: item.data.nomeAnunci,
            prezzo: item.data.prezzo,
            rif: item.data.riferimento,
            slug: item.fileSlug // Динамическая ссылка на объявление
        }));
    });

    // Пропускаем файлы
    eleventyConfig.addPassthroughCopy('src/admin');
    eleventyConfig.addPassthroughCopy('src/_announcements');
    eleventyConfig.addPassthroughCopy('src/Foto');

    return {
        dir: {
            input: 'src',
            output: 'dist',
        },
        templateFormats: ['njk', 'md', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    };
};



