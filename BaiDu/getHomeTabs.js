// const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

// const url = 'http://www.baidu.com';
const url = 'https://www.baidu.com';

const getData = (url, cb) => {
  https.get(url, cb);
};

// 获取左上角tab
const getTopLeft = () => {
  const cb = (res) => {
    let html = '';
    // 接收数据
    res.on('data', (chunk) => {
      html += chunk;
    });

    // 数据接收完成
    res.on('end', () => {
      const $ = cheerio.load(html);
      const topLeftTabs = $('#s-top-left').children('.mnav');
      topLeftTabs.each((_, element) => {
        const text = $(element).text();
        const href = $(element).attr('href');
        console.log(text + ' --------- ' + href);
      });
    });
  };
  getData(url, cb);
};

getTopLeft();