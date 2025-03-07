module.exports = function (eleventyConfig) {
    // Копируем статические файлы
    eleventyConfig.addPassthroughCopy('src/styles'); // Стили
    eleventyConfig.addPassthroughCopy('src/script'); // Скрипты
    eleventyConfig.addPassthroughCopy('src/Foto'); // Изображения

    // Фильтр для преобразования пути в slug (чистый URL)
    eleventyConfig.addFilter("slugify", function (value) {
        return value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    });

    // Создаём коллекцию для объявлений
    eleventyConfig.addCollection('announcements', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements/*.md')
            .sort((a, b) => b.data.riferimento - a.data.riferimento);
    });

        // Создаём коллекцию для блога
    eleventyConfig.addCollection('blog', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements3/*.md')
            .sort((a, b) => b.data.blogcol - a.data.blogcol);
    });

            // Создаём коллекцию для аренды
    eleventyConfig.addCollection('affitii', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements5/*.md')
            .sort((a, b) => b.data.blogcol - a.data.blogcol);
    });

        // Новая коллекция для announcementsRandom
    eleventyConfig.addCollection('random', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements/*.md');
    });

    // Новая коллекция для serv-block
    eleventyConfig.addCollection('services', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements2/*.md');
    });

            // Новая коллекция для agenzia
    eleventyConfig.addCollection('agenzia', function (collection) {
        return collection.getFilteredByGlob('./src/_announcements4/*.md');
    });

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

