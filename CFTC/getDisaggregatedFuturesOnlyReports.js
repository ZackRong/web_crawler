const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { clearDir } = require('../utils/clearDir');

const URL = 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/index.htm';

// 文件写入硬盘
const writeToDisk = async (url) => {
  if (!url) return;

  const basePath = path.join(__dirname, './dist');
  await clearDir(basePath);
  // 获取文件名
  const snippers = url.split('/');
  const name = snippers[snippers.length - 1];
  if (name) {
    const file = path.join(basePath, name);
    axios.get(url, {
      responseType: 'stream'
    }).then((response) => {
      response.data.pipe(fs.createWriteStream(file));
    }).catch((error) => {
      console.log('error: ', error);
    });
    // try {
    //   const file = path.join(basePath, name);
    //   // 301问题 https://segmentfault.com/q/1010000018760426
    //   request(url).pipe(fs.createWriteStream(file))
    // } catch (err) {
    //   console.log(`文件${url}写入失败，err：`, err);
    // }
  }
};

const getDisaggregatedReports = () => {
  // const options = {
  //   url: URL,
  //   // 解决403问题
  //   headers: {
  //     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  //     'referer': 'https://www.cftc.gov/'
  //   }
  // };
  // request.get(options, (err, response, body) => {
  //   if (!err && +response.statusCode === 200) {
  //     const $ = cheerio.load(body);
  //     const fieldDiv = $('.region-content article .field');
  //     // 查找特定的p标签，通过p标签找其相邻的table
  //     const p = fieldDiv.find('p');
  //     p.each((_p, ele) => {
  //       const html = $(ele).html();
  //       if (html.includes('Disaggregated Futures Only Reports')) {
  //         const siblingTable = $($(p).next()[0]);
  //         if (siblingTable.is('table')) {
  //           const allTableCell = siblingTable.find('tbody tr td');
  //           allTableCell.each((_td, td) => {
  //             const text = $(td).text();
  //             const year = text.split(' (')[0].trim();
  //             const allLinks = $(td).find('a');
  //             allLinks.each((_a, link) => {
  //               const href = $(link).attr('href');
  //               const text = $(link).text();
  //               // console.log(`${year}_${text}: https://www.cftc.gov/${href}`);
  //               if (href) {
  //                 writeToDisk(`https://www.cftc.gov${href}`);
  //               }
  //             });
  //           });
  //         }
  //       }
  //     });
  //   }
  // });

  axios.get(URL, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'referer': 'https://www.cftc.gov/'
    }
  }).then((response) => {
    // 状态码为200响应
    const $ = cheerio.load(response.data);
    const fieldDiv = $('.region-content article .field');
    // 查找特定的p标签，通过p标签找其相邻的table
    const p = fieldDiv.find('p');
    p.each((_p, ele) => {
      const html = $(ele).html();
      if (html.includes('Disaggregated Futures Only Reports')) {
        const siblingTable = $($(p).next()[0]);
        if (siblingTable.is('table')) {
          const allTableCell = siblingTable.find('tbody tr td');
          allTableCell.each((_td, td) => {
            const text = $(td).text();
            const year = text.split(' (')[0].trim();
            const allLinks = $(td).find('a');
            allLinks.each((_a, link) => {
              const href = $(link).attr('href');
              const text = $(link).text();
              // console.log(`${year}_${text}: https://www.cftc.gov/${href}`);
              if (href) {
                writeToDisk(`https://www.cftc.gov${href}`);
              }
            });
          });
        }
      }
    });
  }).catch((error) => {
    // 状态码不为200响应
    console.log(error);
  });
};

getDisaggregatedReports();
