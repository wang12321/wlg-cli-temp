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
                  setToken('admin-token') // 为了测试先默认设置一个
                  // setToken(getSearchParam('token'))
                  window.history.replaceState({}, document.title, getRemovedTokenInUrl());
                }
                if (!getToken()) {
                  const url = window.btoa(encodeURIComponent(window.location.href))
                  window.location = \`\${apiURL[process.env.VUE_APP_BASE_API].UnifiedLogin}/?request_url=\${url}&token_in_url=1\`
                  return
                }
                `)

                file = newStr(file,file.indexOf('const whiteList'),`
                 import apiURL from '@/services/apiURL'
                 function getSearchParam(name) {
                      const reg = new RegExp(\`(^|&)\${name}=([^&]*)(&|$)\`, 'i')
                      const r = window.location.search.substr(1).match(reg)
                      if (r != null) {
                        return decodeURIComponent(r[2])
                      }
                      return null
                    }
                 function getRemovedTokenInUrl() {
                      const removeTokenArray = window.location.href.split('token=');
                      const frontPart = removeTokenArray[0].slice(0, removeTokenArray[0].length - 1);
                      const hashPart = removeTokenArray[1].split('#')[1];
                      return \`\${frontPart}#\${hashPart}\`;
                    }
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

    try {
        const permissionFile =  await updatePermission()
        const loginFile =  await updateLogin()
        await fscreateWriteStream(`${pathFile}/src`,`permission.js`,permissionFile)
        log('src/permission.js文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/views/login`,`index.vue`,loginFile)
        log('src/views/login/index.vue文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addUnifiedLogin 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



