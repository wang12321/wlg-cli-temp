/**
 * @author ff
 * @date 2021/7/29
 * @Description: 添加搜索菜单  需要添加组件HeaderSearch.vue 和修改navbar.vue 文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async (desc) => {
    if(typeof(desc) !== 'string'){
        desc = ''
    }
    log('resolve   : ' + resolve('./') + '/'+ desc)
    let pathFile = resolve('./') + ((desc && desc.length !== 0) ? `/${desc}` : '')

    // 添加HeaderSearch/index.vue
    async function addHeaderSearch(){
        const filePath = `${pathFile}/src/components/HeaderSearch/index.vue`
        const dirFilePath = `${__dirname}/../PCFile/headerSearch.txt`

        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  file =  await fscreateReadStream(dirFilePath)
            return Promise.resolve(file)
        }else {
            errorLog('已存在目标文件src/components/HeaderSearch/index.vue')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改navbar.vue
    async function updateNavbar(){
        const filePath = `${pathFile}/src/layout/components/Navbar.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('<screenfull') > -1 && file.indexOf('<search ') === -1){
                file = newStr(file,file.indexOf(`<screenfull`),`<search id="header-search" class="right-menu-item" :style="{'color':navbarColor }" />
                        `)
                file = newStr(file,file.indexOf(`export default `),`import Search from '@/components/HeaderSearch'
                        `)
                file = newStr(file,file.indexOf(`Hamburger,`),`Search,
                        `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <screenfull
                2、是否已添加：<search id="header-search" class="right-menu-item" :style="{'color':navbarColor }" />
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const headerSearchFile =  await addHeaderSearch()
        const navbarFile =  await updateNavbar()
        await fscreateWriteStream(`${pathFile}/src/components/HeaderSearch`,`index.vue`,headerSearchFile)
        log('src/components/HeaderSearch/index.vue文件添加成功')
        await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,navbarFile)
        log('src/layout/components/Navbar.vue文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addHeaderSearch 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



