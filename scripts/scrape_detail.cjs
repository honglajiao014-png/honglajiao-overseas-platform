const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  const pages = [
    '/cars/wuling-hongguang-s-20260524',
    '/blog/china-used-car-export-guide',
    '/blog/how-to-import-from-china-to-kazakhstan',
    '/en/china-used-car-export',
    '/en/used-cars-from-china-to-kazakhstan',
    '/en/china-used-car-export-to-africa',
    '/en/byd-ev-export-sourcing',
    '/en/china-ev-export-sourcing',
    '/en/china-heavy-truck-export',
    '/en/commercial-vehicles-from-china',
    '/en/used-cars-from-china-to-russia',
    '/en/used-cars-from-china-to-uzbekistan',
    '/en/used-cars-from-china-to-kyrgyzstan',
    '/en/used-cars-from-china-to-middle-east',
    '/es/coches-usados-de-china',
    '/ru/used-cars-from-china-to-kazakhstan',
  ];
  
  const results = {};

  for (const path of pages) {
    const url = `https://liangboss.com${path}`;
    console.log(`\n========== FETCHING: ${url} ==========`);
    
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const html = await page.content();
      const text = await page.evaluate(() => document.body.innerText);
      
      const sections = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="banner"], [class*="card"], [class*="grid"], [class*="container"], article, main')).slice(0, 20).map(el => ({
          tag: el.tagName,
          classes: el.className,
          textPreview: el.textContent?.trim().substring(0, 150),
        }));
      });

      results[path] = {
        html: html.substring(0, 60000),
        text: text.substring(0, 8000),
        sections,
      };

      console.log(`✓ Fetched ${path} - ${html.length} chars`);
      await page.close();
    } catch (e) {
      console.log(`✗ Error: ${e.message}`);
      results[path] = { error: e.message };
    }
  }

  const fs = require('fs');
  fs.writeFileSync('/tmp/liangboss_detail.json', JSON.stringify(results, null, 2));
  console.log('\nDone!');
  await browser.close();
})();
