const {promisify} = require('util')
const fs = require('fs')
const {resolve} = require('path')
const path = require('path')

/**
 * 读取文件信息
 * @param path 文件路径
 * @returns {Promise<unknown>}
 */
function fscreateReadStream(path) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(path,{encoding:"utf-8"})
        stream.on("data",chunk=>{
            resolve(chunk)
        })
    })
}

/**
 * 写入文件信息
 * @param path 文件路径
 * @param fileName  文件名
 * @param chunk  写入文件
 * @returns {Promise<unknown>}
 */
async function fscreateWriteStream(path,fileName,chunk) {
    await dirExists(path);
    return new Promise((resolve, reject) => {
        let ws=fs.createWriteStream(path+'/'+fileName,{
        });
        ws.write(chunk,err=>{
            resolve(err)
        });
    })
}

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}

/**
 * 删除文件
 * @param {string} dir 路径
 */
function unlink(path){
    return new Promise(async (resolve, reject) => {
        let files = [];
        if(fs.existsSync(path)){
            if(fs.statSync(path).isDirectory()){
                files = fs.readdirSync(path);
                files.forEach((file, index) => {
                    let curPath = path + "/" + file;
                    if(fs.statSync(curPath).isDirectory()){
                        unlink(curPath); //递归删除文件夹
                    } else {
                        fs.unlinkSync(curPath); //删除文件
                    }
                });
                fs.rmdirSync(path);
            }else {
                fs.unlinkSync(path); //删除文件
            }
        }
        resolve(true);
    })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir){
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir){
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if(status){
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}

function isFileExisted(file) {
    return new Promise(function(resolve, reject) {
        fs.access(file, (err) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}
function newStr(str, n, crstr) {
    n = n === -1 ? 0 : n
    var newStr = str.slice(0, n) + crstr + str.slice(n,str.length)
    return newStr
}

function format(date,format) {
    var args = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter

        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];

        if (new RegExp("(" + i + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}

module.exports = {
    fscreateReadStream,
    fscreateWriteStream,
    isFileExisted,
    newStr,
    format,
    unlink
}
