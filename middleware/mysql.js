const env = require('@/env');
const mysql = require('mysql2/promise');

// 创建数据库连接
const createConnection = async () => {
  const option = {
    host: env.mysql.ip,
    user: env.mysql.username,
    password: env.mysql.password,
    port: Number(env.mysql.port),
  };
  return await mysql.createConnection(option);
};

// 创建数据库
const findOrCreate = async () => {
  const connection = await createConnection();
  const db_name = env.mysql.gitea_db_name;
  const [ result ] = await connection.query(`show databases like '${db_name}'`);
  if (result[0]) {
    await connection.query(`drop database \`${db_name}\``); // 如果数据库存在就删除
  }
  await connection.query(`create database \`${db_name}\``); // 创建数据库
  console.log('\x1b[32m%s\x1b[0m', 'create gitea database complete');
};

module.exports = {
  findOrCreate,
  createConnection,
};
