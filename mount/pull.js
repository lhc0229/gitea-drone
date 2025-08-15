const runTerminal = require('@/terminal');

const mountPullImages = async () => {
  const pull_gitea_cmd = 'docker pull gitea/gitea:1.24.3';
  const pull_drone_cmd = 'docker pull drone/drone:2';
  const pull_drone_runner_docker = 'docker pull drone/drone-runner-docker:1';
  const pull_puppeteer_cmd = 'docker pull buildkite/puppeteer:latest';

  await runTerminal(pull_gitea_cmd, done => { done(); }, () => {});
  console.log('\x1b[32m%s\x1b[0m', 'pull gitea complete');

  await runTerminal(pull_drone_cmd, done => { done(); }, () => {});
  console.log('\x1b[32m%s\x1b[0m', 'pull drone complete');

  await runTerminal(pull_drone_runner_docker, done => { done(); }, () => {});
  console.log('\x1b[32m%s\x1b[0m', 'pull drone-runner-docker complete');

  await runTerminal(pull_puppeteer_cmd, done => { done(); }, () => {});
  console.log('\x1b[32m%s\x1b[0m', 'pull puppeteer complete');

  console.log('已经成功拉取全部必须镜像');
};

module.exports = mountPullImages;
