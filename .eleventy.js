const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Копируем статические файлы
    eleventyConfig.addPassthroughCopy('src/styles'); // Стили
    eleventyConfig.addPassthroughCopy('src/script'); // Скрипты
    eleventyConfig.addPassthroughCopy('src/Foto'); // Фото
    eleventyConfig.addPassthroughCopy('src/admin');
    eleventyConfig.addPassthroughCopy({ 
        "src/robots.txt": "robots.txt",
        "src/4422ff404fd54a40afc4d0ddca7a3596.txt": "4422ff404fd54a40afc4d0ddca7a3596.txt",
        "src/sitemap-new.xml": "sitemap-new.xml" });    

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



