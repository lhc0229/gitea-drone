const env = require('@/env');
const chalk = require('chalk');
const { Controller } = require('egg');
const { getDronePort, getGiteaPort } = require('@/generator/gitea');
const runTerminal = require('@/terminal');

class DroneController extends Controller {
  async addSecret() {
    const { ctx } = this;
    const { id, secret } = ctx.request.body;
    ctx.body = {};

    // 运行drone容器
    const drone_port = getDronePort();
    const gitea_port = getGiteaPort();
    const drone_port_map = env.drone.host_port.map((port, index) => `--publish=${port}:${env.drone.container_port[index]}`).join(' ');
    const drone_folder_mount = env.drone.folder_mount.map(folder => `-v ${folder}`).join(' ');
    const drone_cmd = `docker  run  ${drone_folder_mount} --name=${env.drone.container_name} --env=DRONE_USER_CREATE=username:${env.gitea.admin_username},machine:false,admin:true --env=DRONE_GITEA_SERVER=http://${env.ip}:${gitea_port}  --env=DRONE_GITEA_CLIENT_ID=${id}  --env=DRONE_GITEA_CLIENT_SECRET=${secret} --env=DRONE_RPC_SECRET=${env.hex_value} --env=DRONE_SERVER_HOST=${env.ip}:${drone_port}  --env=DRONE_SERVER_PROTO=http  ${drone_port_map} --restart=always --detach=true drone/drone:2`;
    await runTerminal(drone_cmd,
      done => {
        console.log('\x1b[32m%s\x1b[0m', `${env.drone.container_name}正在运行中`);
        done();
      },
      done => {
        console.log('\x1b[31m%s\x1b[0m', `${env.drone.container_name}运行失败`);
        done();
      }
    );

    // 运行drone-runner-docker
    const drone_runner_docker_port_map = env.drone_runner_docker.host_port.map((port, index) => `-p ${port}:${env.drone_runner_docker.container_port[index]}`).join(' ');
    const drone_runner_docker_folder_mount = env.drone_runner_docker.folder_mount.map(folder => `-v ${folder}`).join(' ');
    const drone_runner_docker_cmd = `docker run -d --name=${env.drone_runner_docker.container_name}  -e DRONE_RPC_PROTO=http  -e DRONE_RPC_HOST=${env.ip}:${drone_port}  ${drone_runner_docker_folder_mount} -e DRONE_RPC_SECRET=${env.hex_value} -e DRONE_RUNNER_CAPACITY=2  -e DRONE_RUNNER_NAME=drone-runner ${drone_runner_docker_port_map} --restart=always --link=drone:drone drone/drone-runner-docker:1`;
    await runTerminal(drone_runner_docker_cmd,
      done => {
        console.log('\x1b[32m%s\x1b[0m', `${env.drone_runner_docker.container_name}正在运行中`);
        done();
      },
      done => {
        console.log('\x1b[31m%s\x1b[0m', `${env.drone_runner_docker.container_name}运行失败`);
        done();
      }
    );

    console.log('\x1b[32m%s\x1b[0m', 'drone OAuth2授权成功');

    console.log('\x1b[32m%s\x1b[0m', 'gitea drone部署成功，运行地址如下：');
    console.log(`${chalk.green('➜')}  gitea:   ${chalk.blue(`http://${env.ip}:${env.gitea.host_port[0]}`)}`);
    console.log(`${chalk.green('➜')}  drone:   ${chalk.blue(`http://${env.ip}:${env.drone.host_port[0]}`)}`);
  }
}

module.exports = DroneController;
