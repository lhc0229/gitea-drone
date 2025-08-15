const puppeteer = require('puppeteer');

const openGiteaConfigPage = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--enable-features=NetworkService',
      '--window-size=1512,772',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1512, height: 772 });
  await page.goto('{{login_url}}');

  await page.evaluate(() => {
    const user_name = document.getElementById('user_name');
    user_name.value = '{{user_name}}';
    const password = document.getElementById('password');
    password.value = '{{password}}';
  });

  await Promise.all([
    page.click('body > div > div > div > div > div:nth-child(1) > div > form > div:nth-child(5) > button'),
    page.waitForResponse(response => {
      return response.status() === 200;
    }, { timeout: 1000 * 60 * 5 }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 1000 * 60 * 5 }),
  ]);

  await page.goto('{{applications_url}}');

  await page.evaluate(() => {
    document.getElementsByClassName('ui bottom attached segment')[1].getElementsByTagName('summary')[0].click();

    const application_name = document.getElementById('application-name');
    application_name.value = 'drone';

    const redirect = document.getElementById('redirect-uris');
    redirect.value = '{{drone_login_url}}';
  });

  await Promise.all([
    page.click('body > div > div > div > div.flex-container-main > div.user-setting-content > div:nth-child(8) > details > form > button'),
    page.waitForResponse(response => {
      return response.status() === 200;
    }, { timeout: 1000 * 60 * 5 }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 1000 * 60 * 5 }),
  ]);

  await page.evaluate(() => {
    const client_id = document.getElementById('client-id').value;
    const client_secret = document.getElementById('client-secret').value;
    const data = {
      id: client_id,
      secret: client_secret,
    };
    const url = '{{add_secret}}';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  });
  setTimeout(async () => {
    await browser.close();
  }, 1000 * 60);
};

openGiteaConfigPage().then();
