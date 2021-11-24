/**
 * @author ff
 * @date 2021/7/29
 * @Description: 添加导航标签  需要添加组件tagsView.vue 和修改layout/index.vue 文件
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

    // 添加tagsView/index.vue
    async function addTagsView(){
        const filePath = `${pathFile}/src/layout/components/TagsView/index.vue`
        const indexFilePath = `${__dirname}/../PCFile/TagsView/index.vue`
        const ScrollPaneFilePath = `${__dirname}/../PCFile/TagsView/ScrollPane.vue`

        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  indexFile =  await fscreateReadStream(indexFilePath)
            let  ScrollPaneFile =  await fscreateReadStream(ScrollPaneFilePath)
            await fscreateWriteStream(`${pathFile}/src/layout/components/TagsView`,`index.vue`,indexFile)
            await fscreateWriteStream(`${pathFile}/src/layout/components/TagsView`,`ScrollPane.vue`,ScrollPaneFile)
            return Promise.resolve(true)
        }else {
            errorLog('已存在目标文件src/layout/components/TagsView')
            return Promise.reject(new Error('Error'))
        }
    }

    // 添加store/modules/tagsView.js
    async function addStoreTagsView(){
        const filePath = `${pathFile}/src/store/modules/tagsView.js`
        const jsFilePath = `${__dirname}/../PCFile/TagsView/tagsView.js`
        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  file =  await fscreateReadStream(jsFilePath)
            return Promise.resolve(file)
        }else {
            errorLog('已存在目标文件src/store/modules/tagsView.js')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改layout/index.vue
    async function updateLayout(){
        const filePath = `${pathFile}/src/layout/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)

            if(file.indexOf('</el-header>') > -1 ){
                errorLog('上下布局,不能配置导航标签')
                return Promise.reject(new Error('Error'))
            }
            if(file.indexOf('<tags-view />') > -1){
                errorLog('已添加配置导航标签')
                return Promise.reject(new Error('Error'))
            }

            let str = '<navbar />'
            if (file.indexOf(str) > -1) {
                file = file.replace(str, `<navbar />
        <tags-view />`)
                file = newStr(file, file.indexOf('export default {'), `import TagsView from './components/TagsView'
                   `)
                var dataArr = file.match((/(Navbar,([\s\S]*?)Sidebar)/g))

                var view = dataArr?dataArr[0]:dataArr
                file = file.replace(view, `Navbar,
                    Sidebar,
                    TagsView`)
                file = file.replace(`.fixed-header+.app-main {
  padding-top: 50px;
}`, `.fixed-header+.app-main {
  padding-top: 90px;
}`)
                return Promise.resolve(file)
            } else {
                errorLog(`src/layout/index.vue文件修改失败!
                请检查代码:
                1、是否有:${str}
                `)
                return Promise.reject(new Error('Error'))
            }

        }else {
            errorLog('找不到src/layout/index.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {

        const updateLayoutFile =  await updateLayout()
        const storeTagsView =  await addStoreTagsView()
        await addTagsView()
        await fscreateWriteStream(`${pathFile}/src/layout`,`index.vue`,updateLayoutFile)
        log('src/layout/index.vue文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/store/modules`,`tagsView.js`,storeTagsView)
        log('src/store/modules/tagsView.js文件添加成功')

        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addTagsView 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



