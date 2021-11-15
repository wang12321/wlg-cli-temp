/**
 * @author ff
 * @date 2021/7/29
 * @Description: 添加面包屑  需要添加组件Breadcrumb.vue 和修改navbar.vue 文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async (desc='') => {
    if(typeof(desc) !== 'string'){
        desc = ''
    }
    log('resolve   : ' + resolve('./') + '/'+ desc)
    let pathFile = resolve('./') + ((desc && desc.length !== 0 ) ? `/${desc}` : '')
    // 添加Breadcrumb/index.vue
    async function addBreadcrumb(){
        const filePath = `${pathFile}/src/components/Breadcrumb/index.vue`
        const dirFilePath = `${__dirname}/../PCFile/breadcrumb.txt`

        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  file =  await fscreateReadStream(dirFilePath)
            return Promise.resolve(file)
        }else {
            errorLog('已存在目标文件src/components/Breadcrumb/index.vue')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改navbar.vue
    async function updateNavbar(){
        const filePath = `${pathFile}/src/layout/components/Navbar.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('<div class="right-menu">') > -1 && file.indexOf('<breadcrumb class="breadcrumb-container"/>') === -1){
                file = newStr(file,file.indexOf(`<div class="right-menu">`),`<breadcrumb class="breadcrumb-container"/>
                        `)
                file = newStr(file,file.indexOf(`export default `),`import Breadcrumb from '@/components/Breadcrumb'
                        `)
                file = newStr(file,file.indexOf(`Hamburger,`),`Breadcrumb,
                        `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <div class="right-menu">
                2、是否已添加：<breadcrumb class="breadcrumb-container"/>
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const breadcrumbFile =  await addBreadcrumb()
        const navbarFile =  await updateNavbar()
        await fscreateWriteStream(`${pathFile}/src/components/Breadcrumb`,`index.vue`,breadcrumbFile)
        log('src/components/Breadcrumb/index.vue文件添加成功')
        await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,navbarFile)
        log('src/layout/components/Navbar.vue修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addBreadcrumb 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            console.log(123123)
            return Promise.reject(()=>{})
        }
    }
}



