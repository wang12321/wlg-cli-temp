/**
 * @author ff
 * @date 2021/8/2
 * @Description: 接入统一登入  需要修改permission.js 和login/index.vue 文件
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

    // 修改permission.js
    async function updatePermission(){
        const filePath = `${pathFile}/src/permission.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('if (hasToken) {') > -1 && file.indexOf('window.location.search !== \'\' && getSearchParam(\'token\')') === -1){
                file = newStr(file,file.indexOf('if (hasToken) {'),`
                if (window.location.search !== '' && getSearchParam('token')) {
                  // setToken('admin-token') // 为了测试先默认设置一个
                  setToken(getSearchParam('token'))
                  window.history.replaceState({}, document.title, getRemovedQueryStringInUrl());
                }
                if (!getToken()) {
                  const url = window.btoa(encodeURIComponent(window.location.href))
                  window.location = \`\${apiUrl[process.env.VUE_APP_BASE_API].unifiedLoginUrl}/?request_url=\${url}&token_in_url=1\`
                  return
                }
                `)

                file = newStr(file,file.indexOf('const whiteList'),`
                 import { getRemovedQueryStringInUrl, getSearchParam } from 'js-utils-lc'
                 import apiUrl from '@/services/api-url'
                 `)

                file = file.replace(`import { getToken } from '@/utils/auth'`,`import { getToken, setToken } from '@/utils/auth'`)
                return Promise.resolve(file)
            }else {
                errorLog(`src/permission.js文件修改失败!
                请检查代码:
                1、是否有: if (hasToken) {
                2、是否已添加：window.location.search !== \'\' && getSearchParam(\'token\')
                3、是否改变： import { getToken } from '@/utils/auth'
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/permission.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改login/index.vue
    async function updateLogin(){
        const filePath = `${pathFile}/src/views/login/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  `
                <template>
                  <div></div>
                </template>
                
                <script>
                export default {
                  name: 'Index'
                }
                </script>
            `
            return Promise.resolve(file)
        }else {
            errorLog('找不到src/views/login/index.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改user.js 自行解析token
    async function analysisToken(){
        const filePath = `${pathFile}/src/store/modules/user.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            let  tokenAnalysisFile =  await fscreateReadStream(`${__dirname}/../PCFile/tokenAnalysis.txt`)
            file = newStr(file,file.indexOf('const getDefaultState = () => {'),tokenAnalysisFile)
            let strArr = file.match((/(const {\s*postUserInfoApi[\s\S]*?}\)\s*}\))/g))
            let str = strArr?strArr[0]:strArr
            file = file.replace(str,`
            return new Promise((resolve, reject) => {
      const token = getToken()
      const strToken = token.substring(token.indexOf('.') + 1, token.length)
      const str = strToken.substring(0, strToken.indexOf('.'))
      const response = decodeURIComponent(escape(atob(decode(str))))
      const data = JSON.parse(response)
      if (!data) {
        return reject('Verification failed, please Login again.')
      }
      const { user_name: name } = data
      commit('SET_NAME', name)
      resolve(Object.assign({ ...data }, { permission: [1] }))
    })
    `)
            return Promise.resolve(file)
        }else {
            errorLog('找不到src/store/modules/user.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const permissionFile =  await updatePermission()
        const loginFile =  await updateLogin()
        const analysisTokenFile =  await analysisToken()
        await fscreateWriteStream(`${pathFile}/src`,`permission.js`,permissionFile)
        log('src/permission.js文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/views/login`,`index.vue`,loginFile)
        log('src/views/login/index.vue文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/store/modules`,`user.js`,analysisTokenFile)
        log('src/store/modules/user.js文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addUnifiedLogin 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



