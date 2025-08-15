module.exports = appInfo => {
  const config = exports = {};

  config.proxy = true;
  config.ipHeaders = 'X-Forwarded-For';

  config.keys = appInfo.name + '_1729553977604_1230';

  config.cluster = {
    listen: {
      port: 8001,
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
  };
};
