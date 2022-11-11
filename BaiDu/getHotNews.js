const request = require('request');
const cheerio = require('cheerio');

const URL = 'http://news.baidu.com/';

const getHotNews = () => {
  request.get(URL, (err, response, body) => {
    if (!err && +response.statusCode === 200) {
      const $ = cheerio.load(body);
      const paneNews = $('#pane-news');
      const allLinks = paneNews.find('li a');
      allLinks.each((index, link) => {
        console.log(`第${index + 1}条热点：`, $(link).text(), '---', $(link).attr('href'));
      });
    }
  });
};

getHotNews();
