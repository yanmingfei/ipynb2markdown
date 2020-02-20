const fs = require('fs')
const isArray = Array.isArray

const parse = function (res) {
    const obj = JSON.parse(res);

    let str = ''
    obj.cells.forEach((item, index) => {

        // str += item.source+'\n'
        if (isArray(item.source)) {
            if (item.cell_type === 'code') {
                str += '\n```python\n'
                item.source.forEach((it, id) => {
                    if (/(<pre>|<\/pre)/.test(it)) {
                        str += '```\n'
                    } else {
                        str += it;
                    }
                })
                str += '\n```\n'
            } else {
                item.source.forEach((it, id) => {
                    if (/(<pre>|<\/pre)/.test(it)) {
                        str += '```\n'
                    } else {
                        str += it;
                    }
                })
            }
            str+='\n'
        } else {
            str += item.source + '\n'
        }

        if(isArray(item.outputs)){
            item.outputs.forEach(it=>{
                str += '\n'
                if(it.output_type==='execute_result'){
                    if(it.data['text/html']&&it.data['text/plain']){
                        it.data['text/html'].forEach(myitem=>{
                            str+= myitem
                        })
                    }else if(it.data['text/plain']){
                        str+='```\n'
                        it.data['text/plain'].forEach(myitem=>{
                            str+= myitem
                        })
                        str+='\n```\n'
                    }
                }
                if(it.output_type==='stream'){
                    str+='```\n'
                    it.text.forEach(myitem=>{
                        str+= myitem
                    })
                    str+='\n```\n'
                }
                if(it.output_type==='display_data'||(it.data&&it.data['image/png'])) {
                    str += '\n'
                    str += '![](data:image/png;base64,' + it.data['image/png'].replace(/\n/gi, '') + ')';
                    str += '\n'
                }
                str += '\n'
            })
        }



    })
    return str;
}

module.exports = parse;

