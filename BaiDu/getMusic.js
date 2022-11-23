const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const { fileExists, clearDir } = require('../utils/fs-operate');

const URL = 'https://music.91q.com/';
const DIST_URL = path.join(__dirname, './dist');

// 请求远程图片，存在本地，并返回本地地址
const getLocalAddr = (name, sourceAddr) => {
  return new Promise(async(resolve, reject) => {
    if (!sourceAddr) return '';
    const snippers = sourceAddr.split('.');
    const ext = snippers[snippers.length - 1];
    const targetPath = `${DIST_URL}/${name ? name + '.' + ext : sourceAddr}`;
    await fileExists(targetPath);
    axios.get(sourceAddr, {
      responseType: 'stream'
    }).then(async (response) => {
      await response.data.pipe(fs.createWriteStream(targetPath));
      resolve && resolve(targetPath);
      console.log(`图片【${sourceAddr}】下载成功`);
    }).catch((error) => {
      console.log('图片写入失败: ', error);
      reject && reject(error);
    });
  });
};

// 获取所有的热门歌单
const getAllHotSongs = ($, scriptList) => {
  // 查找有存全局变量的那个script
  global.__NUXT__ = {};
  scriptList.each((_, script) => {
    if ($(script).text().includes('window.__NUXT__=(function')) {
      const text = $(script).text().replace('window.__NUXT__', 'global.__NUXT__');
      try {
        // 解析执行后，global.__NUXT__上会有对应的数据
        eval(text);
      } catch (err) {
        console.log('eval方法解析函数字符串报错，', err);
      }
    }
  });
};

// 获取当前页面展示的热门歌单内容
const getCurrentHotSongs = ($, songWrapList) => {
  const names = [];
  songWrapList.each(async (_, el) => {
    const name = $($(el).find('.name')[0]).text();
    names.push(name);
  });
  return names;
};

// 下载所有热门歌单的封面
const downAllHotSongPic = (currentHotSongs) => {
  return new Promise(async (resolve) => {
    const { data = [] } = global.__NUXT__;
    if (data.length === 0) {
      console.log('热门歌单数据为空');
      return;
    }
    const { hotSongList = [] } = data[0];
    let result = [];
    const length = currentHotSongs.length;
    const allPromises = [];
    hotSongList.forEach((song = {}) => {
      const { title = '', pic = '' } = song;
      const show = currentHotSongs.includes(title);
      // const localAddr = await getLocalAddr(title, pic);
      allPromises.push(getLocalAddr(title, pic));
      result.push({
        show,
        title,
        sourceAddr: pic,
        localAddr: ''
      });
    });
    const promiseRes = await Promise.all(allPromises);
    result.forEach((item, index) => {
      item.localAddr = promiseRes[index];
    });

    // 将在页面展示的按顺序排列，未展示的排到后面
    const befores = [];
    for (let i = length - 1; i >= 0; i--) {
      const index = result.findIndex((item) => item.title === currentHotSongs[i]);
      befores.push({ ...result[index] });
      result.splice(index, 1);
    }
    result = [...befores, ...result];
    result.forEach((item) => {
      console.log(item.show ? '☆' + item.title : item.title, item.sourceAddr, item.localAddr);
    });
    resolve && resolve();
  });
};

// 获取热门歌单标题及封面
const getHotSongList = () => {
  try {
    axios.get(URL).then(async (response) => {
      const $ = cheerio.load(response.data);
      const scriptList = $('body script');
      const songWrapList = $('.tracklist-box .tracklist-item.fl');

      await clearDir(DIST_URL);
  
      getAllHotSongs($, scriptList);

      const currentHotSongs = getCurrentHotSongs($, songWrapList);

      downAllHotSongPic(currentHotSongs).then(process.exit);
    }).catch((error) => {
      console.log('获取热门歌单标题及封面接口失败：', error);
    });
  } catch(err) {
    console.log('获取热门歌单标题及封面失败：', err);
  }
};

getHotSongList();
