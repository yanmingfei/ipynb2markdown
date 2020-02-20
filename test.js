const fs = require('fs')

const res = fs.readFileSync('../4.ipynb', 'utf8')

const ipynb2markdown = require('./index');

const str = ipynb2markdown(res)

fs.writeFile('1.md', str, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('写入成功')
});
