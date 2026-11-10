import { chromium } from 'playwright';

async function testWaf() {
  console.log('Testing Playwright WAF bypass/resolution...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
  });

  const page = await context.newPage();
  
  // Intercept all requests to see what is sent and received
  page.on('response', resp => {
    if (resp.url().includes('zepto') && resp.status() !== 200) {
      console.log(`[RESP] ${resp.status()} ${resp.url()}`);
    }
  });

  try {
    console.log('Navigating to https://www.zeptonow.com/ with networkidle...');
    const resp = await page.goto('https://www.zeptonow.com/', { waitUntil: 'load', timeout: 30000 });
    console.log('Initial load status:', resp?.status());

    // Wait 5 seconds to observe if client-side challenge executes
    console.log('Waiting for challenge execution...');
    await page.waitForTimeout(6000);

    const title = await page.title();
    console.log('Page title after wait:', title);

    const content = await page.content();
    console.log('Page content length:', content.length);
    console.log('Snippet:', content.substring(0, 300));

    const cookies = await context.cookies();
    console.log('Cookies retrieved:', cookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));

  } catch (err) {
    console.error('Error during WAF test:', err);
  } finally {
    await browser.close();
  }
}

testWaf();
