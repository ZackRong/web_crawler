# web_crawler
爬虫demo

## 2022-11-11
### 解决403问题——添加相应头部
```
headers: {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  'referer': 'https://www.cftc.gov/'
}
```