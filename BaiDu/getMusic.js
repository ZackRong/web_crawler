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
    }).catch((error) => {
      console.log('图片写入失败: ', error);
      reject && reject(error);
    });
  });
};

// 获取热门歌单标题及封面
const getHotSongList = () => {
  try {
    axios.get(URL).then(async (response) => {
      const $ = cheerio.load(response.data);
      const songWrapList = $('.tracklist-box .tracklist-item.fl');
      await clearDir(DIST_URL);
      songWrapList.each(async (_, el) => {
        const name = $($(el).find('.name')[0]).text();
        const sourceAddr = $($(el).find('.el-image img')[0]).attr('src');
        const localAddr = await getLocalAddr(name, sourceAddr);
        console.log(name, sourceAddr, localAddr);
      });
    }).catch((error) => {
      console.log('获取热门歌单标题及封面接口失败：', error);
    });
  } catch(err) {
    console.log('获取热门歌单标题及封面失败：', err);
  }
};

getHotSongList();
