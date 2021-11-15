/**
 * @author ff
 * @date 2021/7/29
 * @Description: 添加new!标志  需要修改SidebarItem.vue 和item.vue 文件
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
    // 修改item.vue
    async function updateItem(){
        const filePath = `${pathFile}/src/layout/components/Sidebar/item.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('vnodes.push(<span slot=\'title\'>{(title)}</span>)') > -1 && file.indexOf('newTime && newTime.getTime() > new Date().getTime()') === -1){
                file = file.replace('vnodes.push(<span slot=\'title\'>{(title)}</span>)',`
              if (newTime && newTime.getTime() > new Date().getTime()) {
                vnodes.push(<span slot='title'>{(title)}<span style='color: red;display: inline-block;margin-top: -10px;padding:0 5px;'>NEW!</span></span>)
              } else {
                vnodes.push(<span slot='title'>{(title)}</span>)
              }`
                )
                file = newStr(file,file.indexOf(`icon: {`),`newTime: {
                  type: Date,
                  default: new Date()
                },
                `)
                file = file.replace(`const { icon, title } = context.props`,`const { icon, title, newTime } = context.props`)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Sidebar/item.vue文件修改失败!
                请检查代码:
                1、是否有: vnodes.push(<span slot=\'title\'>{(title)}</span>)
                2、是否已添加：newTime && newTime.getTime() > new Date().getTime()
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Sidebar/item.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改SidebarItem.vue
    async function updateSidebarItem(){
        const filePath = `${pathFile}/src/layout/components/Sidebar/SidebarItem.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf(':title="onlyOneChild.meta.title"') > -1 && file.indexOf(':new-time="new Date(onlyOneChild.meta.newTime)"') === -1){
                file = newStr(file,file.indexOf(`:title="onlyOneChild.meta.title"`),`:new-time="new Date(onlyOneChild.meta.newTime)" `)
                file = newStr(file,file.indexOf(`:title="item.meta.title"`),`:new-time="new Date(item.meta.newTime)" `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Sidebar/SidebarItem.vue文件修改失败!
                请检查代码:
                1、是否有: :title="onlyOneChild.meta.title"
                2、是否已添加：:new-time="new Date(onlyOneChild.meta.newTime)"
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Sidebar/SidebarItem.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const itemFile =  await updateItem()
        const sidebarItemFile =  await updateSidebarItem()
        await fscreateWriteStream(`${pathFile}/src/layout/components/Sidebar`,`item.vue`,itemFile)
        log('src/layout/components/Sidebar/item.vue文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/layout/components/Sidebar`,`SidebarItem.vue`,sidebarItemFile)
        log('src/layout/components/Sidebar/SidebarItem.vue文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addNew 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



