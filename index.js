const fs = require('fs')
const isArray = Array.isArray

const parse = function (res) {
    const obj = JSON.parse(res);

    let str = ''

    const cells = obj.cells;


    cells.forEach(cell=>{
        //cell type判断

        if(cell.cell_type==='markdown'){
            str+= transformStr(cell.source)
        }
        else if(cell.cell_type==='code'){
            str += transfromCode(cell.source,'python')
            if(cell.outputs.length>0){
                cell.outputs.forEach(output=>{
                    if(output.data){
                        let keys = Object.keys(output.data);
                        if(keys.indexOf('text/html')!==-1 && keys.indexOf('text/plain')!==-1){
                            keys.splice(keys.indexOf('text/plain'),1)
                        }
                        keys.forEach(key=>{
                            if(key==='text/html'){
                                str+= transformStr(output.data['text/html'])
                            }else if(key==='text/plain'){
                                str+= transfromCode(output.data['text/plain'])
                            }else if(key==='image/png'){
                                str += '\n![](data:image/png;base64,' + output.data['image/png'].replace(/\n/gi, '') + ')\n';
                            }else if(key==='text/latex'){
                                str += transformStr(output.data['text/latex'],'latex')
                            }
                        })
                    }else if(output.output_type){
                        if(output.output_type==='stream'){
                            if(output.text){
                                str+=transfromCode(output.text)
                            }
                        }
                    }

                })
            }
        }else if(cell.cell_type === 'raw'){
            str+= transformStr(cell.source)
        }
    })
    return str;
}
function transformStr(data){
    let str = ''
    if(isArray(data)){
        str+='\n'+data.join('')+'\n'

    }else{
        str+='\n'+data+'\n'
    }
    return str;
}

function transfromCode(data,language='',sign){
    let str = ''
    if(isArray(data)){
        if(/%%latex/gi.test(data[0])){
            str+='\n```latex\n'+data.join('')+'\n```\n'
        }else if(/^<matplotlib\.figure\.Figure/.test(data[0])){
            str+='\n\n'
        }
        else if(/^<IPython/gi.test(data[0])){
            str+='\n\n'
        }
        else {
            str+='\n```'+language+'\n'+data.join('')+'\n```\n'
        }
    }else{
        if(/%%latex/.test(data)){
            str+='\n```latex\n'+ data +'\n```\n'
        }else if(/^<matplotlib\.figure\.Figure/.test(data)){
            str+='\n\n'
        }else if(/^<IPython/gi.test(data)){
            str+='\n\n'
        }else{
            str+='\n```'+language+'\n'+ data +'\n```\n'
        }
    }
    return str;
}

module.exports = parse;

