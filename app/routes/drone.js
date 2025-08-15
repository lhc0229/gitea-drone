'use strict';

module.exports = app => {
  const { router, controller } = app;
  const { drone: { addSecret } } = controller;
  router.post('/add/secret', addSecret);
};
