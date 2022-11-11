const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/HistoricalCompressed/index.htm';

const getDisaggregatedReports = () => {
  const options = {
    url: URL,
    // 解决403问题
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'referer': 'https://www.cftc.gov/'
    }
  };
  request.get(options, (err, response, body) => {
    if (!err && +response.statusCode === 200) {
      const $ = cheerio.load(body);
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
                console.log(`${year}-${text}: https://www.cftc.gov/${href}`);
              });
            });
          }
        }
      });
    }
  });
};

getDisaggregatedReports();
