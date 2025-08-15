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
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1512, height: 772 });
  await page.goto('{{url}}');
  await page.evaluate(() => {
    const database_selection_ele = document.getElementsByClassName('selection database')[0];
    database_selection_ele.click();

    const mysql_ele = Array.from(document.getElementsByClassName('visible transition')[0].getElementsByClassName('item')).find(item => item.textContent === 'MySQL');
    mysql_ele.click();

    const db_host = document.getElementById('db_host');
    db_host.value = '{{db_host}}';
    const db_user = document.getElementById('db_user');
    db_user.value = '{{db_user}}';
    const db_passwd = document.getElementById('db_passwd');
    db_passwd.value = '{{db_passwd}}';
    const db_name = document.getElementById('db_name');
    db_name.value = '{{db_name}}';

    const more_option_ele = document.getElementsByClassName('optional field')[2].getElementsByClassName('right-content')[0];
    more_option_ele.click();

    const admin_name = document.getElementById('admin_name');
    admin_name.value = '{{admin_name}}';
    const admin_email = document.getElementById('admin_email');
    admin_email.value = '{{admin_email}}';
    const admin_passwd = document.getElementById('admin_passwd');
    admin_passwd.value = '{{admin_passwd}}';
    const admin_confirm_passwd = document.getElementById('admin_confirm_passwd');
    admin_confirm_passwd.value = '{{admin_passwd}}';
  });

  await Promise.all([
    page.click('body > div > div > div > div > div > form > div:nth-child(21) > div.tw-mt-4.tw-mb-2.tw-text-center > button'),
    page.waitForResponse(response => {
      return response.status() === 200;
    }, { timeout: 1000 * 60 * 5 }),
  ]);
  setTimeout(async () => {
    await browser.close();
  }, 1000 * 60);
};

openGiteaConfigPage().then();
