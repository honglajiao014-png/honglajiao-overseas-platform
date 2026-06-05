const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });

  const pages = ['/', '/cars', '/inquiry', '/services', '/about', '/contact', '/blog'];
  const results = {};

  for (const path of pages) {
    const url = `https://liangboss.com${path}`;
    console.log(`\n========== FETCHING: ${url} ==========`);
    
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const html = await page.content();
      const text = await page.evaluate(() => document.body.innerText);
      
      const styles = await page.evaluate(() => {
        const getStyles = (selector) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const computed = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            classes: el.className,
            styles: {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight,
              padding: computed.padding,
              margin: computed.margin,
              display: computed.display,
              flexDirection: computed.flexDirection,
              maxWidth: computed.maxWidth,
              borderRadius: computed.borderRadius,
              fontFamily: computed.fontFamily,
            }
          };
        };
        
        return {
          header: getStyles('header'),
          nav: getStyles('nav'),
          footer: getStyles('footer'),
          main: getStyles('main'),
          h1: getStyles('h1'),
          h2: Array.from(document.querySelectorAll('h2')).map(h => ({ text: h.textContent?.substring(0, 80), classes: h.className })),
          buttons: Array.from(document.querySelectorAll('button, a[role="button"], a.btn, a.button')).slice(0, 10).map(b => ({
            text: b.textContent?.trim().substring(0, 50),
            tag: b.tagName,
            classes: b.className,
            href: b.getAttribute('href'),
          })),
        };
      });

      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: a.textContent?.trim().substring(0, 80),
          href: a.getAttribute('href'),
        })).filter(l => l.href && !l.href.startsWith('#') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:'));
      });

      const images = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
        }));
      });

      const sections = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="banner"], [class*="card"], [class*="grid"], [class*="container"]')).slice(0, 30).map(el => ({
          tag: el.tagName,
          classes: el.className,
          textPreview: el.textContent?.trim().substring(0, 100),
        }));
      });

      results[path] = {
        html: html.substring(0, 80000),
        text: text.substring(0, 10000),
        styles,
        links,
        images,
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
  fs.writeFileSync('/tmp/liangboss_scrape.json', JSON.stringify(results, null, 2));
  console.log('\nDone! Saved to /tmp/liangboss_scrape.json');
  await browser.close();
})();
