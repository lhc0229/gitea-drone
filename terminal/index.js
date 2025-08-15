const { exec } = require('child_process');

const runTerminal = (cmd, successCallback, errorCallback, skip_warn) => {
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (skip_warn) {
        successCallback(() => resolve());
        return;
      }
      if (error || stderr) {
        console.log('\x1b[31m%s\x1b[0m', `执行${cmd}错误: ${(error || stderr).toString().trim()}`);
        errorCallback(() => resolve());
        return;
      }
      successCallback(() => resolve());
    });
  });
};

module.exports = runTerminal;
