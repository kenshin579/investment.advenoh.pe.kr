import { writeFile } from 'fs/promises';

async function generateRobots() {
  console.log('🤖 Generating robots.txt...');

  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: ${baseUrl}/sitemap.xml

# Investment Insights Blog
# Professional financial blog about stocks, ETFs, bonds, and funds`;

  await writeFile('public/robots.txt', robots, 'utf-8');
  console.log('✅ Generated: public/robots.txt');
}

generateRobots().catch(console.error);
