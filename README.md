# simple.http
> 🔥 简单的http服务器, 方便临时调试html。

[![Version](https://vsmarketplacebadge.apphb.com/version-short/yutent.simple-http.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.simple-http)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/yutent.simple-http.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.simple-http)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/yutent.simple-http.svg)](https://marketplace.visualstudio.com/items?itemName=yutent.simple-http)

## 插件说明
> 这插件只是因为`Live Server插件`有bug,应一个基友需求临时写的。如果你有其他的功能需求, 请在插件商店中`搜索其他插件`。


## 插件使用
> 在项目根目录中放置 `.httpserver`文件, 并配置好之后, 重启或重新加载窗口, 以启动服务。



## .httpserver 文件
> 使用`.httpserver`来配置web服务器信息, 该文件应为一个json格式的。

```json
{
  "port": 23333, // [可选]  默认使用 23333 端口, 如果被使用了, 会向上查找可用端口
  "root": ".", // [可选] web服务的根目录, 默认为当前项目的根目录, 可填写相对项目根目录的路径。
  "enabled": true  // 这里配置为 true 才会启动web服务
}
```
