const{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,isFileExisted:isFileExisted,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async r=>{"string"!=typeof r&&(r=""),log("resolve   : "+resolve("./")+"/"+r);let e=resolve("./")+(r&&0!==r.length?`/${r}`:"");try{var t=await async function(){var r=`${e}/src/permission.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("if (hasToken) {")&&-1===e.indexOf("window.location.search !== '' && getSearchParam('token')")?(e=newStr(e,e.indexOf("if (hasToken) {"),`
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
                `),e=newStr(e,e.indexOf("const whiteList"),`
                 import { getRemovedQueryStringInUrl, getSearchParam } from 'js-utils-lc'
                 import apiUrl from '@/services/api-url'
                 `),e=e.replace("import { getToken } from '@/utils/auth'","import { getToken, setToken } from '@/utils/auth'"),Promise.resolve(e)):(errorLog(`src/permission.js文件修改失败!
                请检查代码:
                1、是否有: if (hasToken) {
                2、是否已添加：window.location.search !== \'\' && getSearchParam(\'token\')
                3、是否改变： import { getToken } from '@/utils/auth'
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/permission.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),o=(i=`${e}/src/views/login/index.vue`,await(await isFileExisted(i)?Promise.resolve(`
                <template>
                  <div></div>
                </template>
                
                <script>
                export default {
                  name: 'Index'
                }
                </script>
            `):(errorLog("找不到src/views/login/index.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))))),s=await async function(){var r=`${e}/src/store/modules/user.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);r=await fscreateReadStream(`${__dirname}/../PCFile/tokenAnalysis.txt`);e=newStr(e,e.indexOf("const getDefaultState = () => {"),r);r=e.match(/(const {\s*postUserInfoApi[\s\S]*?}\)\s*}\))/g),r=r&&r[0];return e=e.replace(r,`
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
    `),Promise.resolve(e)}return errorLog("找不到src/store/modules/user.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(`${e}/src`,"permission.js",t),log("src/permission.js文件修改成功"),await fscreateWriteStream(`${e}/src/views/login`,"index.vue",o),log("src/views/login/index.vue文件修改成功"),await fscreateWriteStream(`${e}/src/store/modules`,"user.js",s),log("src/store/modules/user.js文件修改成功"),run("npm run lint:fix",{cwd:`${e}`})}catch(e){if(errorLog("addUnifiedLogin 目标代码出错，请按上述报错信息检查代码"),r&&0!==r.length)return Promise.reject(()=>{})}var i};