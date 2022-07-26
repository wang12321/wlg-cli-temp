/**
 * @author ff
 * @date 2021/8/2
 * @Description: 添加微前端  需要修改src/views/qiankun.vue src/router/index.js  main.js 和 layout/index.vue文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async () => {
    log('resolve   : ' + resolve('./'))
    // 添加 qiankun.vue
    async function qiankunFile(){
        const filePath = `${resolve('./')}/src/views/qiankun/qiankun.vue`
        const dirFilePath = `${__dirname}/../PCFile/qiankun.txt`

        const isfile = await isFileExisted(filePath)
        if(!isfile){
            let  file =  await fscreateReadStream(dirFilePath)
            return Promise.resolve(file)
        }else {
            errorLog('已存在目标文件src/views/qiankun/qiankun.vue')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改src/router/index.js
    async function updateRouter(){
        const filePath = `${resolve('./')}/src/router/index.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let file =  await fscreateReadStream(filePath)
            if(file.indexOf('export const constantRoutes = [') > -1 && file.indexOf('meta: { title: \'微前端\',') === -1) {
                file = newStr(file, file.indexOf('export const constantRoutes = [')+'export const constantRoutes = ['.length, `
                   {
                    path: '/app',
                    component: Layout,
                    alwaysShow: true,
                    meta: { title: '微前端',
                      icon: 'tree',
                      permissionArray: [1, 2, 3]
                    },
                    children: [{
                      path: '/app/vue',
                      name: 'AppOne',
                      meta: {
                        title: 'appvue',
                        icon: 'tree',
                        permissionArray: [1, 2, 3] // 表示只有超级管理员可以访问
                      },
                      component: () => import('@/views/qiankun/qiankun.vue')
                    }]
                  },
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`目标文件src/router/index.js 修改失败!
                请检查代码:
                1、是否有: export const constantRoutes = [
                2、是否已添加：meta: { title: 微前端,' 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('已存在目标文件src/router/index.js')
            return Promise.reject(new Error('Error'))
        }
    }



    // 修改layout/index.vue
    async function updateLayout(){
        const filePath = `${resolve('./')}/src/layout/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('</transition>') > -1 && file.indexOf(':id="container"') === -1) {
                file = newStr(file, file.indexOf('</transition>')+'</transition>'.length, `
                  <div v-if="this.$route.path.indexOf('/app')>-1" :id="container" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%" />
                `)
                file = newStr(file, file.indexOf('computed: {')+'computed: {'.length, `
                  container() {
                      return this.$route.path.split('/').pop()
                    },
                  `)
                return Promise.resolve(file)
            }else {
                errorLog(`目标文件src/layout/index.vue 修改失败!
                请检查代码:
                1、是否有: </transition>
                2、是否已添加：:id="container" 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('已存在目标文件src/layout/index.vue')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const qiankun =  await qiankunFile()
        const routerFile =  await updateRouter()
        const layoutFile =  await updateLayout()

        await fscreateWriteStream(`${resolve('./')}/src/router`,'index.js',routerFile)
        log('src/router/index.js文件修改成功')

        await fscreateWriteStream(`${resolve('./')}/src/views/qiankun`,'qiankun.vue',qiankun)
        log('src/views/qiankun/qiankun.vue文件添加成功')

        await fscreateWriteStream(`${resolve('./')}/src/layout`,'index.vue',layoutFile)
        log('src/router/layout.vue文件修改成功')

        let  Main =  await fscreateReadStream(`${resolve('./')}/src/main.js`)
        let  qiankunMain =  await fscreateReadStream(`${__dirname}/../PCFile/qiankunMain.txt`)
        await fscreateWriteStream(`${resolve('./')}/src`,'main.js',Main+qiankunMain)

        run(`npm install qiankun`,{cwd:`${resolve('./')}`})

        run(`npm run lint:fix`,{cwd:`${resolve('./')}`})
    }catch (e){
        errorLog('目标代码出错，请按上述报错信息检查代码')
    }

}

