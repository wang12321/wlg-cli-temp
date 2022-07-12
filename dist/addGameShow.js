const{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,isFileExisted:isFileExisted,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async r=>{"string"!=typeof r&&(r=""),log("resolve   : "+resolve("./")+"/"+r);let t=resolve("./")+(r&&0!==r.length?`/${r}`:"");try{var e=await async function(){var r=`${t}/src/layout/components/Navbar.vue`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("<screenfull")&&-1===e.indexOf(':value="selectedGameId"')?(e=newStr(e,e.indexOf("<screenfull"),`
                  <div class="right-menu-item hover-effect">
                    <el-select v-if="gamelist.length>0" :value="selectedGameId" class="select" filterable placeholder="请选择平台" @change="getSelectedGameId">
                      <el-option v-for="(item) in gamelist" :key="item.game_id" :label="item.game_id + '-' + item.game_name" :value="item.game_id" />
                    </el-select>
                  </div>
                        `),e=newStr(e,e.indexOf("navbarBackground() {"),`selectedGameId() {
                      return Number(this.$store.state.permission.gameId) || ''
                    },
                        `),e=newStr(e,e.indexOf("'sidebar',"),`
                    'gamelist',
                        `),e=newStr(e,e.indexOf("methods: {")+10,`
                    getSelectedGameId(gameID) {
                          this.$store.commit('permission/SET_GAMEID', gameID)
                          this.$store.commit('permission/SET_ROUTES', this.$store.state.permission.addRoutes)
                          this.$router.push({ path: 'reference-template/template-one', params: { id: gameID }})
                        },
                        `),Promise.resolve(e)):(errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <screenfull
                2、是否已添加：:value="selectedGameId" 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),s=await async function(){var r=`${t}/src/utils/auth.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1===e.indexOf("setIsGameIdKey")?(e=newStr(e,e.length,`// gameID
                    const isGameIdKey = 'isGameIdKey'
                    export function setIsGameIdKey(data) {
                      return localStorage.setItem(isGameIdKey, data)
                    }
                    export function getIsGameIdKey() {
                      return localStorage.getItem(isGameIdKey)
                    }
                `),Promise.resolve(e)):(errorLog(`src/utils/auth.js文件修改失败!
                请检查代码:
                1、是否已添加：setIsGameIdKey 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/utils/auth.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),a=await async function(){var r=`${t}/src/store/modules/permission.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("SET_ROUTES: (state, routes) => {")&&-1===e.indexOf("SET_GAMEID: (state, data) => {")?(e=newStr(e,0,`
                 import { getIsGameIdKey, setIsGameIdKey } from '@/utils/auth'
                `),e=newStr(e,e.indexOf("SET_ROUTES: (state, routes) => {"),`
                 SET_GAMEID: (state, data) => {
                    state.gameId = data
                    setIsGameIdKey(data)
                  },
                `),e=newStr(e,e.indexOf("routes: [],"),`
                 gameId: getIsGameIdKey() || '',
                 `),e=e.replace("state.routes = constantRoutes.concat(routes)",`if (state.gameId !== '') {
                  state.routes = constantRoutes.concat(routes)
                } else {
                  state.routes = constantRoutes
                }`),Promise.resolve(e)):(errorLog(`src/store/modules/permission.js文件修改失败!
                请检查代码:
                1、是否有: SET_ROUTES: (state, routes) => {
                2、是否已添加：SET_GAMEID: (state, data) => {}
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/store/modules/permission.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),i=await async function(){var r=`${t}/src/permission.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);r=e.match(/(\}\s*(\r?\n)*}\s*else([\s\S]*?)whiteList.indexOf\(to.path\)\s*!==\s*-1\)\s*\{)/g),r=r&&r[0];return-1<e.indexOf(r)&&-1===e.indexOf("store.state.permission.gameId")?(e=newStr(e,e.indexOf(r),`
                 // 如果没有gameId 回到首页
                  if (store.state.permission.gameId === '' && to.path !== '/dashboard') {
                    next('/')
                  }
                  // 如果有gameId 点击首页，则清空gameId
                  if (store.state.permission.gameId !== '' && to.path === '/dashboard') {
                    store.commit('permission/SET_GAMEID', '')
                    store.commit('permission/SET_ROUTES', store.state.permission.addRoutes)
                    next('/')
                  }
                   // 如果有gameId 处理/:id 动态路由 
                if (store.state.permission.gameId !== '' && to.path.indexOf('/:id') > -1) {
                  const params = { id: store.state.permission.gameId }
                  next({ ...to, params: params })
                }
                `),e=newStr(e,e.indexOf("router.$addRoutes(accessRoutes"),`
                 await store.dispatch('user/getGamelist')
                 `),Promise.resolve(e)):(errorLog(`src/permission.js文件修改失败!
                请检查代码:
                1、是否有: ${r}
                2、是否已添加：store.state.permission.gameId
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/permission.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),o=await async function(){var e=`${t}/src/views/dashboard/index.vue`;if(await isFileExisted(e)){e=await fscreateReadStream(`${__dirname}/../PCFile/indexGame.txt`);return Promise.resolve(e)}return errorLog("找不到src/views/dashboard/index.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),n=await async function(){var r=`${t}/src/services/api.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("postUserLoginApi(params) {")&&-1===e.indexOf("getGamelistApi(params) {")?(e=newStr(e,e.indexOf("postUserLoginApi(params) {"),`
                getGamelistApi(params) {
                    return request.get(\`\${userUrl}/user/gamelist\`, params)
                  },
                `),Promise.resolve(e)):(errorLog(`src/services/api.js文件修改失败!
                请检查代码:
                1、是否有：const accounts = apiUrl[process.env.VUE_APP_BASE_API]
                2、是否已添加：accounts = apiUrl['production'] 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/services/api.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),m=await async function(){var r=`${t}/src/store/getters.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("sidebar: state => state.app.sidebar,")&&-1===e.indexOf("gamelist: state => state.user.gamelist,")?(e=newStr(e,e.indexOf("sidebar: state => state.app.sidebar,"),`
                    gamelist: state => state.user.gamelist,
                `),Promise.resolve(e)):(errorLog(`src/store/getters.js文件修改失败!
                请检查代码:
                1、是否有：sidebar: state => state.app.sidebar,
                2、是否已添加：gamelist: state => state.user.gamelist, 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/store/getters.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),c=await async function(){var r=`${t}/src/store/modules/user.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1===e.indexOf("gamelist: []")&&-1<e.indexOf("token: getToken()")?(e=newStr(e,e.indexOf("token: getToken()"),`
                   gamelist: [],
                `),e=newStr(e,e.indexOf("RESET_STATE: (state) => {"),`
                   SET_Gamelist: (state, data) => {
                    state.gamelist = data
                  },
                `),e=newStr(e,e.indexOf("const actions = {")+"const actions = {".length,`
                   getGamelist({ commit, state }) {
                    const { getGamelistApi } = userModule
                    return new Promise((resolve, reject) => {
                      getGamelistApi().then(response => {
                        const { data } = response
                        commit('SET_Gamelist', data)
                        resolve(data)
                      }).catch(error => {
                        reject(error)
                      })
                    })
                  },
                `),Promise.resolve(e)):(errorLog(`src/store/modules/user.js文件修改失败!
                请检查代码:
                1、是否有：token: getToken()
                2、是否已添加：gamelist: [] 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/store/modules/user.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(`${t}/src/store/modules`,"user.js",c),log("src/store/modules/user.js文件修改成功"),await fscreateWriteStream(`${t}/src/store/modules`,"permission.js",a),log("src/store/modules/permission.js文件修改成功"),await fscreateWriteStream(`${t}/src`,"permission.js",i),log("src/permission.js文件修改成功"),await fscreateWriteStream(`${t}/src/views/dashboard`,"index.vue",o),log("src/views/dashboard/index.vue文件修改成功"),await fscreateWriteStream(`${t}/src/layout/components`,"Navbar.vue",e),log("src/layout/components/Navbar.vue文件修改成功"),await fscreateWriteStream(`${t}/src/services`,"api.js",n),log("src/services/api.js文件修改成功"),await fscreateWriteStream(`${t}/src/utils`,"auth.js",s),log("src/utils/auth.js 文件修改成功"),await fscreateWriteStream(`${t}/src/store`,"getters.js",m),log("src/store/getters.js 文件修改成功"),run("npm run lint:fix",{cwd:`${t}`})}catch(e){if(errorLog("addGameShow 目标代码出错，请按上述报错信息检查代码"),r&&0!==r.length)return Promise.reject(()=>{})}};