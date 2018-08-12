var fs = require('fs-extra');
const PATH = "../log/log.txt";

function write(e){

    fs.appendFile(PATH,e,'utf-8',function(err){

        if(err) throw err;
    });
}

module.exports = write;