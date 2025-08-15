const env = require('@/env');
const path = require('path');
const { promises: fs } = require('fs');

const getGiteaPort = () => {
  const container_port = env.gitea.container_port;
  const index = container_port.findIndex(item => item === 3000);
  return env.gitea.host_port[index];
};

const getDronePort = () => {
  const container_port = env.drone.container_port;
  const index = container_port.findIndex(item => item === 80);
  return env.drone.host_port[index];
};

const giteaPuppeteer = async app => {
  const gitea_port = getGiteaPort();
  const gitea_puppeteer_path = path.join(app.baseDir, 'generator/template/gitea-puppeteer.js');
  const content = await fs.readFile(gitea_puppeteer_path, 'utf8');
  const target_content = content.replaceAll('{{url}}', `http://${env.ip}:${gitea_port}`)
    .replaceAll('{{db_host}}', `${env.mysql.ip}:${env.mysql.port}`)
    .replaceAll('{{db_user}}', env.mysql.username)
    .replaceAll('{{db_passwd}}', env.mysql.password)
    .replaceAll('{{db_name}}', env.mysql.gitea_db_name)
    .replaceAll('{{admin_name}}', env.gitea.admin_username)
    .replaceAll('{{admin_email}}', env.gitea.admin_email)
    .replaceAll('{{admin_passwd}}', env.gitea.admin_password);
  const file_path = path.join(app.baseDir, 'puppeteer/gitea-puppeteer.js');
  await fs.writeFile(file_path, target_content, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', 'generate gitea initialization script complete');
};

const giteaLoginPuppeteer = async app => {
  const gitea_port = getGiteaPort();
  const drone_port = getDronePort();
  const gitea_puppeteer_path = path.join(app.baseDir, 'generator/template/gitea-login.js');
  const content = await fs.readFile(gitea_puppeteer_path, 'utf8');
  const target_content = content.replaceAll('{{login_url}}', `http://${env.ip}:${gitea_port}/user/login`)
    .replaceAll('{{user_name}}', env.gitea.admin_username)
    .replaceAll('{{password}}', env.gitea.admin_password)
    .replaceAll('{{applications_url}}', `http://${env.ip}:${gitea_port}/user/settings/applications`)
    .replaceAll('{{drone_login_url}}', `http://${env.ip}:${drone_port}/login`)
    .replaceAll('{{add_secret}}', `http://${env.ip}:${env.port}/add/secret`);
  const file_path = path.join(app.baseDir, 'puppeteer/gitea-login.js');
  await fs.writeFile(file_path, target_content, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', 'generate drone OAuth2 authorization script complete');
  console.log('要执行的puppeteer脚本都已经准备完毕');
};

module.exports = {
  getGiteaPort,
  getDronePort,
  giteaPuppeteer,
  giteaLoginPuppeteer,
};
