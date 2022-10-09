const resolve=require("path")["resolve"],{fscreateReadStream,fscreateWriteStream,isFileExisted,newStr}=require("./common.js"),run=require("runjs")["run"],chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async r=>{"string"!=typeof r&&(r=""),log("resolve   : "+resolve("./")+"/"+r);let e=resolve("./")+(r&&0!==r.length?"/"+r:"");try{var s=await async function(){var r=e+"/src/layout/components/Navbar.vue";if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("<screenfull")&&-1===e.indexOf('@click="switchAction"')?(e=newStr(e,e.indexOf("<screenfull"),`
                  <div class="right-menu-item hover-effect" @click="switchAction">
                    <i v-if="!isSwitch" class="el-icon-user-solid" :style="{'color':navbarColor }" />
                    <i v-else class="el-icon-user-solid" :style="{'color':'red' }" />
                  </div>
                        `),e=newStr(e,e.indexOf("export default "),`import { setIsUseMasterApiKey, getIsUseMasterApiKey } from '@/utils/auth'
                        `),e=newStr(e,e.indexOf("return {")+8,`
                    isSwitch: process.env.NODE_ENV.indexOf('development') > -1 && getIsUseMasterApiKey() === 'true',
                        `),e=newStr(e,e.indexOf("methods: {")+10,`
                    switchAction() {
                      if (process.env.NODE_ENV.indexOf('development') > -1) {
                        this.isSwitch = !this.isSwitch
                        setIsUseMasterApiKey(this.isSwitch)
                        window.location.reload()
                      }
                    },
                        `),Promise.resolve(e)):(errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <screenfull
                2、是否已添加：@click="switchAction" 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),t=await async function(){var r=e+"/src/utils/auth.js";if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1===e.indexOf("setIsUseMasterApiKey")?(e=newStr(e,e.length,`// 切换环境
                    const isUseMasterApiKey = 'isUseMasterApiKey'
                    export function setIsUseMasterApiKey(data) {
                      return localStorage.setItem(isUseMasterApiKey, data)
                    }
                    export function getIsUseMasterApiKey() {
                      return localStorage.getItem(isUseMasterApiKey)
                    }
                `),Promise.resolve(e)):(errorLog(`src/utils/auth.js文件修改失败!
                请检查代码:
                1、是否已添加：setIsUseMasterApiKey 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/utils/auth.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),i=await async function(){var r=e+"/src/services/api.js";if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("const accounts = apiUrl[process.env.VUE_APP_BASE_API]")&&-1===e.indexOf("accounts = apiURL['production']")?(e=e.replace("const accounts = apiUrl[process.env.VUE_APP_BASE_API]",`
                import { getIsUseMasterApiKey } from '@/utils/auth'
                let accounts = apiUrl[process.env.VUE_APP_BASE_API]
                if (getIsUseMasterApiKey() === 'true' && process.env.NODE_ENV.indexOf('development') > -1) {
                    accounts = apiUrl['production']
                }
                `),Promise.resolve(e)):(errorLog(`src/services/api.js文件修改失败!
                请检查代码:
                1、是否有：const accounts = apiUrl[process.env.VUE_APP_BASE_API]
                2、是否已添加：accounts = apiUrl['production'] 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/services/api.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(e+"/src/utils","auth.js",t),log("src/utils/auth.js 文件修改成功"),await fscreateWriteStream(e+"/src/layout/components","Navbar.vue",s),log("src/layout/components/Navbar.vue文件修改成功"),await fscreateWriteStream(e+"/src/services","api.js",i),log("src/services/api.js文件修改成功"),run("npm run lint:fix",{cwd:e})}catch(e){if(errorLog("addSwitchEnvironment 目标代码出错，请按上述报错信息检查代码"),r&&0!==r.length)return Promise.reject(()=>{})}};