# gitea-drone CI/CD 镜像



## 项目简介

本项目基于 **Egg.js** 构建并打包了一个集成化的 **gitea-drone** 镜像，用于快速部署私有化的 CI/CD 平台。  
该镜像运行后，会在宿主机上自动拉起以下容器：  

- **gitea**：轻量级自建 Git 代码托管服务  
- **drone**：基于容器的持续集成与持续交付（CI/CD）系统  
- **drone-runner-docker**：Drone 的 Docker 执行器，负责构建与运行任务  



## 功能特点

- **一键部署**：启动镜像即可完成 gitea、drone 及 runner 的安装与初始化  
- **自动化流水线**：支持从代码提交到构建、测试、部署的全流程自动化  
- **容器化隔离**：各服务均以容器方式运行，方便升级与维护  
- **私有化可控**：数据与配置完全保存在宿主机，可安全自主管理  



## 适用场景

- 内网或私有云的自建 Git 仓库与 CI/CD 平台  
- 对外部依赖要求低、可独立运行的持续集成系统  
- 小团队敏捷开发与快速迭代  



## 创建配置文件

```javascript
// 	/gitea-env/index.js
// 	在根目录下创建gitea-env目录，/gitea-env目录下创建index.js

// 	folder_mount		容器挂载目录
// 	host_port		宿主机端口，可以修改
// 	container_port	容器暴露端口，不可以修改
// 	gitea_db_name 	存放gitea数据的数据库名称
// 	container_name 运行容器的名称

// 宿主机于容器内端口对应关系 -p host_port[index]:container_port[index]，按照索引一一对应

const env = {
  ip: '127.0.0.1', 	 // 宿主机ip
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
    gitea_db_name: 'gitea-drone', // 存放gitea数据的数据库名称
  },
};

module.exports = env;
```



## 部署方式

```shell
# 注意事项
#	1. gitea-drone容器运行时会删除容器名称为gitea，drone，drone_runner_docker这三个容器
#	2. gitea-drone容器运行时会先删除gitea绑定的数据库，然后再重新创建gitea绑定的数据库

# 拉取镜像
docker pull ccr.ccs.tencentyun.com/free-soul/gitea-drone:V1.0.0

# 运行容器 
# 注意: 宿主机的端口需要和配置文件gitea-env/index.js里面port一致，容器默认暴露端口8001
docker run -p 8001:8001 -d --name gitea-drone -v /gitea-env:/app/env -v /gitea-puppeteer:/app/puppeteer -v /var/run/docker.sock:/var/run/docker.sock ccr.ccs.tencentyun.com/free-soul/gitea-drone:V1.0.0

# 查看控制台日志，预计5分钟之内部署完成，看到控制台输出 gitea drone部署成功 说明部署成功
docker logs gitea-drone

# 删除
docker rm -f gitea-drone
docker rmi ccr.ccs.tencentyun.com/free-soul/gitea-drone:V1.0.0
```

