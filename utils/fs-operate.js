const fs = require('fs');
const { promises } = require('fs');

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

// 文件是否存在
exports.fileExists = async (path, deleteWhenExist = false) => {
  await promises.access(path).then(async () => {
    if (deleteWhenExist) {
      await promises.unlinkSync(path);
    }
    return true
  }).catch(() => {
    return false;
  });
};

