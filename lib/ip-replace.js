
/**
 * @author ff
 * @date 2022/8/1
 * @Description: ip替换
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))
const jsonObj = require('../PCFile/ipJson.json')

module.exports = async (path) => {
    if (typeof (path) !== 'string') {
        path = ''
    }
    log('resolve   : ' + resolve('./') + '/' + path)
    // 获取apiurl.js文件
    let pathFile = resolve('./') + ((path && path.length !== 0) ? `/${path}` : '')
    const isApiFile = await isFileExisted(pathFile)
    if(isApiFile) {
        let apiData = await fscreateReadStream(pathFile)
        Object.keys(jsonObj).forEach(item =>{
            if(apiData.indexOf(item)>-1){
                let regIp = new RegExp(item,  "g")
                apiData = apiData.replace(regIp,jsonObj[item])
            }
        })

      let arrPath = path.split('/')
        let lastPath =  arrPath[arrPath.length - 1]
        let filePath =  pathFile.substring(0,pathFile.indexOf(lastPath)-1)
        await fscreateWriteStream(`${filePath}`,lastPath,apiData)
        log(`${path} 测试替换域名更换成功` )
    }else {
        log(`${path} 找不到文件路径` )
    }
}
