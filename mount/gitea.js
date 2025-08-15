const env = require('@/env');
const { delayTime } = require('@/global/function');
const runTerminal = require('@/terminal');

const mountGitea = async () => {

  // 如果gitea容器存在就删除
  const gitea_delete_container_cmd = `docker rm -f ${env.gitea.container_name}`;
  await runTerminal(gitea_delete_container_cmd,
    done => {
      console.log('\x1b[32m%s\x1b[0m', `已删除正在运行的${env.gitea.container_name}`);
      done();
    },
    done => {
      console.log('\x1b[33m%s\x1b[0m', `没有找到正在运行的${env.gitea.container_name}，导致删除失败，可以忽略此错误，不会影响后续执行`);
      done();
    }
  );

  // 如果drone容器存在就删除
  const drone_delete_container_cmd = `docker rm -f ${env.drone.container_name}`;
  await runTerminal(drone_delete_container_cmd,
    done => {
      console.log('\x1b[32m%s\x1b[0m', `已删除正在运行的${env.drone.container_name}`);
      done();
    },
    done => {
      console.log('\x1b[33m%s\x1b[0m', `没有找到正在运行的${env.drone.container_name}，导致删除失败，可以忽略此错误，不会影响后续执行`);
      done();
    }
  );

  // 如果drone_runner_docker容器存在就删除
  const drone_runner_docker_delete_container_cmd = `docker rm -f ${env.drone_runner_docker.container_name}`;
  await runTerminal(drone_runner_docker_delete_container_cmd,
    done => {
      console.log('\x1b[32m%s\x1b[0m', `已删除${env.drone_runner_docker.container_name}`);
      done();
    },
    done => {
      console.log('\x1b[33m%s\x1b[0m', `没有找到正在运行的${env.drone_runner_docker.container_name}，导致删除失败，可以忽略此错误，不会影响后续执行`);
      done();
    }
  );

  console.log('已经清除当前正在运行的gitea，drone，drone_runner_docker容器');

  // 运行gitea容器
  const gitea_port_map = env.gitea.host_port.map((port, index) => `-p ${port}:${env.gitea.container_port[index]}`).join(' ');
  const gitea_folder_mount = env.gitea.folder_mount.map(folder => `-v ${folder}`).join(' ');
  const gitea_install_cmd = `docker run -d --privileged=true --restart=always --name=${env.gitea.container_name} ${gitea_port_map} ${gitea_folder_mount} gitea/gitea:1.24.3`;
  await runTerminal(gitea_install_cmd,
    done => {
      console.log('\x1b[32m%s\x1b[0m', `${env.gitea.container_name}正在运行中`);
      done();
    },
    done => {
      console.log('\x1b[31m%s\x1b[0m', `${env.gitea.container_name}运行失败`);
      done();
    }
  );

  // 由于gitea运行之后，需要一定的反应时间，所以此处等待30s
  await delayTime(30);

  // 通过puppeteer访问gitea运行的url,并执行gitea-puppeteer.js对gitea进行初始化配置，主要是对gitea进行数据库和管理员账号信息进行配置
  const cmd = 'docker run --rm --network host -v /gitea-puppeteer:/downloads buildkite/puppeteer:latest node /downloads/gitea-puppeteer.js';
  console.log('正在使用puppeteer容器执行gitea-puppeteer.js脚本对gitea进行数据库和管理员账号信息进行初始化配置');
  await runTerminal(cmd,
    done => {
      console.log('\x1b[32m%s\x1b[0m', 'gitea数据库和管理员账号信息初始化成功');
      done();
    },
    done => {
      console.log('\x1b[31m%s\x1b[0m', 'gitea数据库和管理员账号信息初始化失败');
      done();
    }
  );

  // 通过puppeteer执行gitea-login.js，主要是对drone进行OAuth2授权
  const login_cmd = 'docker run --rm --network host -v /gitea-puppeteer:/downloads buildkite/puppeteer:latest node /downloads/gitea-login.js';
  console.log('正在使用puppeteer容器执行gitea-login.js脚本登录gitea,并且对drone进行OAuth2授权');
  await runTerminal(login_cmd,
    done => {
      done();
    },
    done => {
      console.log('\x1b[31m%s\x1b[0m', 'drone OAuth2授权失败');
      done();
    }
  );
};

module.exports = mountGitea;
