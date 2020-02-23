## 使用方式
```node
npm install ipynb2markdown 
```


```javascript
var ipynb2markdown = require('ipynb2markdown')
ipynb2markdown(ipynbstr)
```
> 这里的`ipynbstr`参数必须填写，并且要保证其正确。否则会报错，可以查看test.js中的代码

### v1.0.3
之前source字符只支持array中cell_type是code类型。source也可以是字符串，cell_type是code。已修复

### v1.0.4
修复ipynb转markdown，内容为字符串解析失败。

### v1.0.5
添加github地址