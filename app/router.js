'use strict';

const registerDroneRoutes = require('@/app/routes/drone');

module.exports = app => {
  registerDroneRoutes(app);
};
