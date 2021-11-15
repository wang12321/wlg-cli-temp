/**
 * @author ff
 * @date 2021/7/29
 * @Description: 添加环境  需要修改package.json 文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async (name) => {
    log('resolve   : ' + resolve('./'))
    let pathFile = resolve('./')
    // 新增.env.development
    async function addENV(){
        const filePath = `${pathFile}/.env.${name}`
        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  file = ''
            if(name.indexOf('development')>-1){
                file =  `NODE_ENV = development

# just a flag
ENV = ${name}

# base api
VUE_APP_BASE_API = '${name}'
`
            }else if(name.indexOf('production')>-1){
                file =  `NODE_ENV = production

# just a flag
ENV = ${name}

# base api
VUE_APP_BASE_API = '${name}'
`
            }else {
                log(`${name}不符合规范，前缀需要是development和production`)
            }

            return Promise.resolve(file)
        }else {
            errorLog(`${filePath}文件存在!`)
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改package.json
    async function updatePackage(){
        const filePath = `${pathFile}/package.json`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('"scripts": {') > -1){

                if(name.indexOf('development')>-1){

                    file = newStr(file,file.indexOf(`"scripts": {`)+`"scripts": {`.length,`
    "dev:${name.substring(11,name.length)}": "vue-cli-service serve --mode ${name}",`)
                }else if(name.indexOf('production')>-1){
                    file = newStr(file,file.indexOf(`"scripts": {`)+`"scripts": {`.length,`
    "build:${name.substring(10,name.length)}": "vue-cli-service build --mode ${name}",`)
                }
                return Promise.resolve(file)
            }else {
                errorLog(`package.json文件修改失败!
                请检查代码:
                1、是否有: "scripts": {
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到package.json目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改apiURL.js
    async function updateapiURL(){
        const filePath = `${pathFile}/src/services/apiURL.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('module.exports = {') > -1){
                file = newStr(file,file.indexOf(`module.exports = {`),`
                const ${name} = {

                }
                `)
                file = newStr(file,file.indexOf(`module.exports = {`)+`module.exports = {`.length,`
                ${name},`)
                return Promise.resolve(file)
            }else {
                errorLog(`apiURL.js文件修改失败!
                请检查代码:
                1、是否有: module.exports = {
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到apiURL.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const ENVFile =  await addENV()
        const PackageFile =  await updatePackage()
        const apiURLFile =  await updateapiURL()


        await fscreateWriteStream(`${pathFile}`,`.env.${name}`,ENVFile)
        log(`.env.${name}文件修改成功`)
        await fscreateWriteStream(`${pathFile}`,`package.json`,PackageFile)
        log('package.json文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/services`,`apiURL.js`,apiURLFile)
        log('src/services/apiURL.js文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addNew 目标代码出错，请按上述报错信息检查代码')
    }
}



