const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { clearDir } = require('../utils/fs-operate');

const URL = 'https://www.sec.gov/Archives/edgar/data/1067983/000095012323002585/xslForm13F_X02/20651.xml';

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
  const headers = {
    // 'authority': 'www.sec.gov',
    // 'pragma': 'no-cache',
    'cache-control': 'no-cache',
    // 'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
    // 'sec-ch-ua-mobile': '?0',
    // 'upgrade-insecure-requests': '1',
    // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    // 'sec-fetch-site': 'none',
    // 'sec-fetch-mode': 'navigate',
    // 'sec-fetch-user': '?1',
    // 'sec-fetch-dest': 'document',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    // 'cookie': '_ga=GA1.2.99882464.1625747600; _gid=GA1.2.47105549.1625747600; __utma=27389246.99882464.1625747600.1625750552.1625750552.1; __utmc=27389246; __utmz=27389246.1625750552.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _4c_=jVNRa9swEP4rQw95ihLJlmU5EEbpYJTRh0H3HGTpbIu6tpGVuF3pf98pcZKtHWN%2BENKn7z7dfXd%2BJVMDHdlwmWR5xpkopOJL8ggvI9m8EjPE9RCXvW%2FJhjQhDONmvZ6maTWCWdX9YQ221n49gvamobqzVBsD40iWxPQWMIgXK85XHIHwE49CMdwOvrd7E3bhZYicCcpPo33ECwsHZ2A3ORuaY3DCrmgDrm5ChNlRxQ4%2BHnA3uc720%2FuwGb2EyTxyS99PI8TI28b3T%2FCpiGiPJZN7bXDroQLvj4y%2FVWxqR0vXrU869GjAZ22C67ttDcH0T4PuXha3d9%2B2Nze33xexxu3C6gDldtFPHfit60y7t7Aw%2Fb4LW87Y4mTgLsBz2GIKowvRl%2FnJGcC%2BnDB6wgZsDUlw0%2FZGt5GPzVySrze7H3df8FQUSiVCitWxvyKXLJry4F1dg7%2BH0PQWWQ9eWxeT1220FMcB7a70vg3xGG0zrR5HZyyMj6EfyNuSPJ9mRqW5EDlODvY24IAoKVj8kOGdnYeHKChUVihBKy0sFZXGGeFlTvO8ylhS2qxMBZk10zRLpMhVoTiKHNxZo8hlAlwnNGMGNSSTtBBQUS4qaVRWGcUTcskrzxKFeYl0zourc1pDOyvyK1kKhQ8W8kwWlyKGw8xOfitZFpzxNPtY8jwPsT%2FQ%2FSNUfgxFw69u6VRUuaScgaIiFwnF4lPKSgkqF5YZrsl%2FaXZnyWs7rx7j385F9NgN4WzJ0TmGN0k04w8uIpF7UXyvFe%2Ff3n4B'
  };
  axios.get(URL, {
    headers
  }).then((response) => {
    console.log(response.data);
    // 状态码为200响应
    // const $ = cheerio.load(response.data);
    // const fieldDiv = $('.region-content article .field');
    // // 查找特定的p标签，通过p标签找其相邻的table
    // const p = fieldDiv.find('p');
    // p.each((_p, ele) => {
    //   const html = $(ele).html();
    //   if (html.includes('Disaggregated Futures Only Reports')) {
    //     const siblingTable = $($(p).next()[0]);
    //     if (siblingTable.is('table')) {
    //       const allTableCell = siblingTable.find('tbody tr td');
    //       allTableCell.each((_td, td) => {
    //         const text = $(td).text();
    //         const year = text.split(' (')[0].trim();
    //         const allLinks = $(td).find('a');
    //         allLinks.each((_a, link) => {
    //           const href = $(link).attr('href');
    //           const text = $(link).text();
    //           // console.log(`${year}_${text}: https://www.cftc.gov/${href}`);
    //           if (href) {
    //             writeToDisk(`https://www.cftc.gov${href}`);
    //           }
    //         });
    //       });
    //     }
    //   }
    // });
  }).catch((error) => {
    // 状态码不为200响应
    console.log('error: ', error.response.status);
  });
};

getDisaggregatedReports();
