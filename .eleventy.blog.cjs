// Eleventy partial config focused only on /blog to avoid touching root index.html yet
module.exports = function(eleventyConfig) {
  // Passthrough copy for existing assets
  eleventyConfig.addPassthroughCopy({ 'assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'data': 'data' });

  eleventyConfig.addFilter('readTime', (content) => {
    if(!content) return 1;
    const words = content.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  // Date RFC822 for RSS
  eleventyConfig.addFilter('dateRFC822', dateObj => {
    return (dateObj instanceof Date ? dateObj : new Date(dateObj)).toUTCString();
  });

  // Generic date formatting filter used as: {{ someDate | date("%Y-%m-%d") }}
  // Supports minimal tokens: %Y (year), %m (zero-padded month), %d (zero-padded day)
  eleventyConfig.addFilter('date', (dateObj, pattern = '%Y-%m-%d') => {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    if (isNaN(d)) return '';
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return pattern
      .replace('%Y', yyyy)
      .replace('%m', mm)
      .replace('%d', dd);
  });

  // Basic XML escape
  eleventyConfig.addFilter('xmlEscape', str => {
    if(!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  });

  // Collection posts sin drafts
  eleventyConfig.addCollection('post', collectionApi => {
    return collectionApi.getFilteredByGlob('blog-src/posts/*.md').filter(item => !item.data.draft);
  });

  // Shortcode para imágenes responsivas simples
  eleventyConfig.addShortcode('img', (src, alt='', cls='') => {
    const escapedAlt = (alt||'').replace(/"/g,'&quot;');
    return `<figure class="${cls} img-wrapper"><img src="${src}" alt="${escapedAlt}" loading="lazy" decoding="async" /></figure>`;
  });

  // Layout por defecto para todo (posts, index, tags) salvo que se sobreescriba
  eleventyConfig.addGlobalData('layout', 'layout.njk');
  eleventyConfig.addGlobalData('blogBase', '/blog');

  // No generar salida para drafts: permalink false
  eleventyConfig.addGlobalData('eleventyComputed', {
    permalink: data => data.draft ? false : data.permalink
  });

  return {
    dir: {
      input: 'blog-src',
      includes: '_includes',
      data: '_data',
      output: 'blog'
    },
    templateFormats: ['md','njk','html'],
    markdownTemplateEngine: 'njk',
  htmlTemplateEngine: 'njk'
  };
};
