const{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,isFileExisted:isFileExisted,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async r=>{"string"!=typeof r&&(r=""),log("resolve   : "+resolve("./")+"/"+r);let e=resolve("./")+(r&&0!==r.length?`/${r}`:"");try{var o=await async function(){var r=`${e}/src/permission.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("if (hasToken) {")&&-1===e.indexOf("window.location.search !== '' && getSearchParam('token')")?(e=newStr(e,e.indexOf("if (hasToken) {"),`
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
                `),e=newStr(e,e.indexOf("const whiteList"),`
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
                 `),e=e.replace("import { getToken } from '@/utils/auth'","import { getToken, setToken } from '@/utils/auth'"),Promise.resolve(e)):(errorLog(`src/permission.js文件修改失败!
                请检查代码:
                1、是否有: if (hasToken) {
                2、是否已添加：window.location.search !== \'\' && getSearchParam(\'token\')
                3、是否改变： import { getToken } from '@/utils/auth'
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/permission.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),t=(n=`${e}/src/views/login/index.vue`,await(await isFileExisted(n)?Promise.resolve(`
                <template>
                  <div></div>
                </template>
                
                <script>
                export default {
                  name: 'Index'
                }
                </script>
            `):(errorLog("找不到src/views/login/index.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error")))));await fscreateWriteStream(`${e}/src`,"permission.js",o),log("src/permission.js文件修改成功"),await fscreateWriteStream(`${e}/src/views/login`,"index.vue",t),log("src/views/login/index.vue文件修改成功"),run("npm run lint:fix",{cwd:`${e}`})}catch(e){if(errorLog("addUnifiedLogin 目标代码出错，请按上述报错信息检查代码"),r&&0!==r.length)return Promise.reject(()=>{})}var n};