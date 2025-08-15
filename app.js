require('module-alias/register');

const { findOrCreate } = require('@/middleware/mysql');
const mountGitea = require('@/mount/gitea');
const mountPullImages = require('@/mount/pull');
const { giteaPuppeteer, giteaLoginPuppeteer } = require('@/generator/gitea');

module.exports = async app => {
  app.ready(async () => {
    await mountPullImages(); // 拉取所需的docker镜像
    await giteaPuppeteer(app); // 生成对gitea进行初始化的gitea-puppeteer.js文件，后续通过puppeteer无头浏览器执行，进行gitea初始化
    await giteaLoginPuppeteer(app); // 生成对gitea进行授权drone的gitea-login.js文件，后续通过puppeteer无头浏览器执行，对drone进行OAuth2授权
    await findOrCreate(); // 创建gitea存储数据库
    await mountGitea(app); // 执行安装
  });
};
