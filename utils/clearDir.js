const fs = require('fs');

// 递归清空文件夹
exports.clearDir = (path) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      const filePath = `${path}/${file}`;
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        clearDir(filePath);
      } else {
        fs.unlinkSync(filePath);
        console.log(`删除文件${filePath}成功`);
      }
    });
    resolve();
  });
};
