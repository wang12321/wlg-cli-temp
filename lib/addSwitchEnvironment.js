/**
 * @author ff
 * @date 2021/7/30
 * @Description: 添加切换环境标志  需要修改utils/auth.js、services/api.js 和navbar.vue 文件
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

    // 修改navbar.vue
    async function updateNavbar(){
        const filePath = `${pathFile}/src/layout/components/Navbar.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('<screenfull') > -1 && file.indexOf('@click="switchAction"') === -1){
                file = newStr(file,file.indexOf(`<screenfull`),`
                  <div class="right-menu-item hover-effect" @click="switchAction">
                    <i v-if="!isSwitch" class="el-icon-user-solid" :style="{'color':navbarColor }" />
                    <i v-else class="el-icon-user-solid" :style="{'color':'red' }" />
                  </div>
                        `)
                file = newStr(file,file.indexOf(`export default `),`import { setIsUseMasterApiKey, getIsUseMasterApiKey } from '@/utils/auth'
                        `)
                file = newStr(file,file.indexOf(`return {`)+8,`
                    isSwitch: process.env.NODE_ENV.indexOf('development') > -1 && getIsUseMasterApiKey() === 'true',
                        `)
                file = newStr(file,file.indexOf(`methods: {`)+10,`
                    switchAction() {
                      if (process.env.NODE_ENV.indexOf('development') > -1) {
                        this.isSwitch = !this.isSwitch
                        setIsUseMasterApiKey(this.isSwitch)
                        window.location.reload()
                      }
                    },
                        `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <screenfull
                2、是否已添加：@click="switchAction" 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改auth.js
    async function updateAuth(){
        const filePath = `${pathFile}/src/utils/auth.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('setIsUseMasterApiKey') === -1){
                file = newStr(file, file.length,`// 切换环境
                    const isUseMasterApiKey = 'isUseMasterApiKey'
                    export function setIsUseMasterApiKey(data) {
                      return localStorage.setItem(isUseMasterApiKey, data)
                    }
                    export function getIsUseMasterApiKey() {
                      return localStorage.getItem(isUseMasterApiKey)
                    }
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/utils/auth.js文件修改失败!
                请检查代码:
                1、是否已添加：setIsUseMasterApiKey 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/utils/auth.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改services/api.js
    async function updateApi(){
        const filePath = `${pathFile}/src/services/api.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('const accounts = apiURL[process.env.VUE_APP_BASE_API]')> -1 && file.indexOf('accounts = apiURL[\'production\']') === -1){
                file = file.replace('const accounts = apiURL[process.env.VUE_APP_BASE_API]',`
                import { getIsUseMasterApiKey } from '@/utils/auth'
                let accounts = apiURL[process.env.VUE_APP_BASE_API]
                if (getIsUseMasterApiKey() === 'true' && process.env.NODE_ENV.indexOf('development') > -1) {
                    accounts = apiURL['production']
                }
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/services/api.js文件修改失败!
                请检查代码:
                1、是否有：const accounts = apiURL[process.env.VUE_APP_BASE_API]
                2、是否已添加：accounts = apiURL['production'] 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/services/api.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const navbarFile =  await updateNavbar()
        const authFile =  await updateAuth()
        const ApiFile =  await updateApi()
        await fscreateWriteStream(`${pathFile}/src/utils`,`auth.js`,authFile)
        log('src/utils/auth.js 文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,navbarFile)
        log('src/layout/components/Navbar.vue文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/services`,`api.js`,ApiFile)
        log('src/services/api.js文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addSwitchEnvironment 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



