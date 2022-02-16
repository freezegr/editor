const exportsTitles = (data) => {
    let str = '';
    data.forEach(x => {
        str += `[${x.section}]\n`
        x.body.forEach((l, count) => {
            if(l.type == "comment"){
                str += "; " + l.value + "\n"
            } else if(l.key){
                if(l.key != 'count'){
                    if(typeof l.value == "string"){
                        str += `${l.key}: ${l.value}\n`
                    } else if(typeof l.value == "object"){
                        let val = Object.values(l.value).join()
                        str += `${l.key}: ${val}\n`
                    }
                }
            }
            if(x.body.length == count+1) str += '\n'
        })
    });
    return str
}

module.exports.exportsTitles = exportsTitles;