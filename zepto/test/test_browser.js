import { chromium } from 'playwright';

async function testPlaywright() {
  console.log('Testing Playwright chromium launch...');
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Navigating to https://www.zeptonow.com/...');
    const resp = await page.goto('https://www.zeptonow.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('Status code:', resp?.status());
    const title = await page.title();
    console.log('Page title:', title);
    const cookies = await page.context().cookies();
    console.log('Cookies retrieved:', cookies.map(c => c.name));
    await browser.close();
    console.log('Playwright test successful.');
  } catch (err) {
    console.error('Playwright test error:', err);
  }
}

testPlaywright();
