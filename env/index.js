const env = {
  ip: '127.0.0.1', // 宿主机ip
  port: 8001, 				// 当前后端服务运行端口，也就是gitea-drone容器的宿主机端口
  hex_value: '456159a8fb584cab1c4ffddd29946a1e', // 不可以修改
  gitea: {
    admin_email: 'admin@qq.com',
    admin_username: 'admin',
    admin_password: 'admin',
    host_port: [ 7070, 7060 ],
    container_port: [ 3000, 22 ], // 不可以修改
    container_name: 'gitea',
    folder_mount: [ '/gitea-drone/gitea:/data' ],
  },
  drone: {
    host_port: [ 9010, 9020 ],
    container_port: [ 80, 443 ], // 不可以修改
    container_name: 'drone',
    folder_mount: [ '/gitea-drone/drone:/data' ],
  },
  drone_runner_docker: {
    host_port: [ 9040 ],
    container_port: [ 3000 ], // 不可以修改
    container_name: 'drone_runner_docker',
    folder_mount: [ '/var/run/docker.sock:/var/run/docker.sock' ], // 不可以修改
  },
  mysql: {
    ip: '127.0.0.1',
    port: '3306',
    username: 'username',
    password: 'password',
    gitea_db_name: 'gitea-drone',
  },
};

module.exports = env;
