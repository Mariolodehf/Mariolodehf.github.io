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

  // Basic XML escape
  eleventyConfig.addFilter('xmlEscape', str => {
    if(!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
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
