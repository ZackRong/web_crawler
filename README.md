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
## 2022-11-23
### 解决存在页面script下window中的变量数据
```
[1] 获取页面script标签
[2] 过滤目标script
[3] 字符串替换，将window替换为global
[4] eval()执行字符串函数，将数据挂载到global下
```