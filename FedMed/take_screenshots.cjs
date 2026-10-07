const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'images');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser via Chrome at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,920'],
    defaultViewport: {
      width: 1440,
      height: 920,
      deviceScaleFactor: 1.5,
    },
  });

  const page = await browser.newPage();

  try {
    console.log('1. Capturing Landing Page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_landing_page.png') });
    console.log('✓ Captured: 01_landing_page.png');

    console.log('2. Opening Login Page...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const signIn = btns.find(b => b.textContent.includes('Sign In'));
      if (signIn) signIn.click();
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_login_page.png') });
    console.log('✓ Captured: 02_login_page.png');

    console.log('3. Opening Sign Up Page...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const signUp = btns.find(b => b.textContent.includes('Sign up'));
      if (signUp) signUp.click();
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_signup_page.png') });
    console.log('✓ Captured: 03_signup_page.png');

    console.log('4. Logging In as testadmin@fedmed.ai...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const signIn = btns.find(b => b.textContent.includes('Sign in'));
      if (signIn) signIn.click();
    });
    await sleep(500);

    await page.type('input[type="email"]', 'testadmin@fedmed.ai');
    await page.type('input[type="password"]', 'Password123!');
    
    await page.evaluate(() => {
      const submit = document.querySelector('button[type="submit"]');
      if (submit) submit.click();
    });
    await sleep(2500);

    console.log('5. Capturing Dashboard Overview...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_dashboard_overview.png') });
    console.log('✓ Captured: 04_dashboard_overview.png');

    console.log('6. Switching to Hospital Nodes...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('Hospital Nodes'));
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_hospital_nodes.png') });
    console.log('✓ Captured: 05_hospital_nodes.png');

    console.log('7. Switching to Model Registry (FL Training Engine)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('Model Registry'));
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_fl_training_engine.png') });
    console.log('✓ Captured: 06_fl_training_engine.png');

    console.log('8. Switching to Privacy Engine...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('Privacy Engine'));
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_privacy_encryption.png') });
    console.log('✓ Captured: 07_privacy_encryption.png');

    console.log('9. Switching to 3D Medical Viewer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('3D Medical Viewer'));
      if (btn) btn.click();
    });
    await sleep(1800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_mri_viewer.png') });
    console.log('✓ Captured: 08_mri_viewer.png');

    console.log('10. Switching to Audit Vault...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('Audit Vault'));
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_audit_logs.png') });
    console.log('✓ Captured: 09_audit_logs.png');

    console.log('11. Switching to System Settings...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('aside button'));
      const btn = btns.find(b => b.textContent.includes('System Settings'));
      if (btn) btn.click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_settings.png') });
    console.log('✓ Captured: 10_settings.png');

    console.log('12. Opening AI Assessment Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const btn = btns.find(b => b.textContent.includes('AI Assessment'));
      if (btn) btn.click();
    });
    await sleep(1000);

    // Click "Generate AI Assessment"
    await page.evaluate(() => {
      const modalBtns = Array.from(document.querySelectorAll('button'));
      const genBtn = modalBtns.find(b => b.textContent.includes('Generate AI Assessment'));
      if (genBtn) genBtn.click();
    });
    await sleep(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_ai_insights_modal.png') });
    console.log('✓ Captured: 11_ai_insights_modal.png');

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

run();
