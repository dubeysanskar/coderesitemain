const fs = require('fs');
const path = require('path');

// Read services data
const servicesPath = path.join(__dirname, '../src/data/services.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8')).services;

// Static URLs
const staticUrls = [
  { url: '/', priority: '1.0' },
  { url: '/founders', priority: '0.6' },
  { url: '/validator', priority: '0.7' },
  { url: '/ppt-generator', priority: '0.9' },
  { url: '/resume-builder', priority: '0.9' },
  { url: '/report-generator', priority: '0.9' },
  { url: '/lead-generator', priority: '0.9' },
  { url: '/mail-merger', priority: '0.8' },
  { url: '/prompt-guide', priority: '0.7' },
  { url: '/learning-guide', priority: '0.7' },
  { url: '/website-builder', priority: '0.9' },
  { url: '/careers', priority: '0.5' }
];

// Generate sitemap
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

const today = new Date().toISOString().slice(0, 10);

// Add static URLs
staticUrls.forEach(({ url, priority }) => {
  lines.push(`  <url><loc>https://coderesite.com${url}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`);
});

// Add service URLs
services.forEach(service => {
  const lastmod = service.lastmod || today;
  lines.push(`  <url><loc>https://coderesite.com/services/${service.slug}</loc><lastmod>${lastmod}</lastmod><priority>0.6</priority></url>`);
});

lines.push('</urlset>');

// Write sitemap
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, lines.join('\n'));

console.log(`✅ sitemap.xml generated at ${outputPath}`);
console.log(`📊 Total URLs: ${staticUrls.length + services.length}`);
console.log(`🔗 Services included: ${services.map(s => s.slug).join(', ')}`);

// Generate sitemap index for future scalability
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  `  <sitemap><loc>https://coderesite.com/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>`,
  '</sitemapindex>'
];

const indexPath = path.join(__dirname, '../public/sitemap-index.xml');
fs.writeFileSync(indexPath, sitemapIndex.join('\n'));

console.log(`✅ sitemap-index.xml generated at ${indexPath}`);