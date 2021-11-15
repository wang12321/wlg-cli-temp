/**
 * @author ff
 * @date 2021/8/3
 * @Description: 删除导航标签  需要添加组件tagsView.vue 和修改layout/index.vue 文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr, unlink } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async () => {
    log('resolve   : ' + resolve('./'))
    // 删除tagsView/index.vue
    async function delTagsView(){
        const filePath = `${resolve('./')}/src/layout/components/TagsView`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            try {
                await unlink(`${resolve('./')}/src/layout/components/TagsView`)
                log('src/store/modules/tagsView文件删除成功')
                return Promise.resolve(true)
            }catch (e){
                return Promise.reject(new Error('Error'))
            }

        }else {
            errorLog('不存在目标文件src/layout/components/TagsView')
            return Promise.reject(new Error('Error'))
        }
    }

    // 删除store/modules/tagsView.js
    async function delStoreTagsView(){
        const filePath = `${resolve('./')}/src/store/modules/tagsView.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            try {
                await unlink(`${resolve('./')}/src/store/modules/tagsView.js`)
                log('src/store/modules/tagsView.js文件删除成功')
                return Promise.resolve(true)
            }catch (e){
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('不存在目标文件src/store/modules/tagsView.js')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改layout/index.vue
    async function updateLayoutD(){
        const filePath = `${resolve('./')}/src/layout/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('<tags-view />') === -1){
                errorLog('不存在<tags-view />配置导航标签')
                return Promise.reject(new Error('Error'))
            }

            let str = '<tags-view />'
            if (file.indexOf(str) > -1) {
                file = file.replace(str, ``)
                file = file.replace('import TagsView from \'./components/TagsView\'', ``)
                file = file.replace(`,
    TagsView`,``)
                file = file.replace(`.fixed-header+.app-main {
  padding-top: 90px;
}`,`.fixed-header+.app-main {
  padding-top: 50px;
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
        const updateLayoutFile =  await updateLayoutD()
        await delTagsView()
        await delStoreTagsView()
        await fscreateWriteStream(`${resolve('./')}/src/layout`,`index.vue`,updateLayoutFile)
        log('src/layout/index.vue文件修改成功')
        run(`npm run lint:fix`,{cwd:`${resolve('./')}`})
    }catch (e){
        errorLog('目标代码出错，请按上述报错信息检查代码')
    }
}



