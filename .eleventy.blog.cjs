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

  // Colecciones: artículos en español (por defecto) y su versión en inglés, sin borradores
  eleventyConfig.addCollection('post', collectionApi => {
    return collectionApi.getFilteredByGlob('blog-src/posts/*.md').filter(item => !item.data.draft);
  });
  eleventyConfig.addCollection('postEn', collectionApi => {
    return collectionApi.getFilteredByGlob('blog-src/en/posts/*.md').filter(item => !item.data.draft);
  });

  // Etiquetas por idioma: [{ tag, posts }], para generar /blog/tag/x/ y /blog/en/tag/x/
  const tagsDe = (api, glob) => {
    const m = new Map();
    api.getFilteredByGlob(glob).filter(i => !i.data.draft).forEach(i => {
      (i.data.tags || []).forEach(t => { if (!m.has(t)) m.set(t, []); m.get(t).push(i); });
    });
    return Array.from(m, ([tag, posts]) => ({ tag, posts })).sort((a, b) => a.tag.localeCompare(b.tag));
  };
  eleventyConfig.addCollection('tagsEs', api => tagsDe(api, 'blog-src/posts/*.md'));
  eleventyConfig.addCollection('tagsEn', api => tagsDe(api, 'blog-src/en/posts/*.md'));

  // URL de la misma página en el otro idioma. Si el artículo no tiene traducción,
  // lleva al índice del blog en ese idioma.
  //   español: /posts/x/   inglés: /en/posts/x/
  eleventyConfig.addFilter('altUrl', (url, lang, postsEs, postsEn) => {
    const toEn = lang !== 'en';
    const target = toEn ? '/en' + url : url.replace(/^\/en(?=\/)/, '');
    const pool = toEn ? (postsEn || []) : (postsEs || []);
    const isIndex = url === '/' || url === '/en/';
    if (isIndex || pool.some(p => p.url === target)) return target;
    return toEn ? '/en/' : '/';
  });

  // Shortcode para imágenes responsivas simples
  eleventyConfig.addShortcode('img', (src, alt='', cls='') => {
    const escapedAlt = (alt||'').replace(/"/g,'&quot;');
    return `<figure class="${cls} img-wrapper"><img src="${src}" alt="${escapedAlt}" loading="lazy" decoding="async" /></figure>`;
  });

  // Layout por defecto para todo (posts, index, tags) salvo que se sobreescriba
  eleventyConfig.addGlobalData('layout', 'layout.njk');
  eleventyConfig.addGlobalData('blogBase', '/blog');
  // Idioma por defecto del blog; la carpeta en/ lo cambia a inglés (blog-src/en/en.json)
  eleventyConfig.addGlobalData('lang', 'es');

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
