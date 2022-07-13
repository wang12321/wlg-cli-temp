/**
 * @author ff
 * @date 2021/8/2
 * @Description: 添加展示游戏平台  需要修改permission.js 和dashboard/index.vue 文件 navbar.vue
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

    // 修改modules/permission.js
    async function updateModulesPermission(){
        const filePath = `${pathFile}/src/store/modules/permission.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)

            if(file.indexOf('SET_ROUTES: (state, routes) => {') > -1 && file.indexOf('SET_GAMEID: (state, data) => {') === -1){

                file = newStr(file,0,`
                 import { getIsGameIdKey, setIsGameIdKey } from '@/utils/auth'
                `)

                file = newStr(file,file.indexOf('SET_ROUTES: (state, routes) => {'),`
                 SET_GAMEID: (state, data) => {
                    state.gameId = data
                    setIsGameIdKey(data)
                  },
                `)

                file = newStr(file,file.indexOf('routes: [],'),`
                 gameId: getIsGameIdKey() || '',
                 `)

                file = file.replace(`state.routes = constantRoutes.concat(routes)`,`if (state.gameId !== '') {
                  state.routes = constantRoutes.concat(routes)
                } else {
                  state.routes = constantRoutes
                }`)
                return Promise.resolve(file)
            }else {
                errorLog(`src/store/modules/permission.js文件修改失败!
                请检查代码:
                1、是否有: SET_ROUTES: (state, routes) => {
                2、是否已添加：SET_GAMEID: (state, data) => {}
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/store/modules/permission.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }


    // 修改permission.js
    async function updatePermission(){
        const filePath = `${pathFile}/src/permission.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            let strArr = file.match((/(\}\s*(\r?\n)*}\s*else([\s\S]*?)whiteList.indexOf\(to.path\)\s*!==\s*-1\)\s*\{)/g))
            let str = strArr?strArr[0]:strArr
            // let str = ' }\n' +
            //     '  } else {\n' +
            //     '    /* has no token*/\n' +
            //     '    if (whiteList.indexOf(to.path) !== -1) {'
            if(file.indexOf(str) > -1 && file.indexOf('store.state.permission.gameId') === -1){
                file = newStr(file,file.indexOf(str),`
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
                `)

                file = newStr(file,file.indexOf('router.$addRoutes(accessRoutes'),`
                 await store.dispatch('user/getGamelist')
                 `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/permission.js文件修改失败!
                请检查代码:
                1、是否有: ${str}
                2、是否已添加：store.state.permission.gameId
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/permission.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改dashboard/index.vue
    async function updateDashboard(){
        const filePath = `${pathFile}/src/views/dashboard/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(`${__dirname}/../PCFile/indexGame.txt`)
            return Promise.resolve(file)
        }else {
            errorLog('找不到src/views/dashboard/index.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改auth.js
    async function updateAuth(){
        const filePath = `${pathFile}/src/utils/auth.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('setIsGameIdKey') === -1){
                file = newStr(file, file.length,`// gameID
                    const isGameIdKey = 'isGameIdKey'
                    export function setIsGameIdKey(data) {
                      return localStorage.setItem(isGameIdKey, data)
                    }
                    export function getIsGameIdKey() {
                      return localStorage.getItem(isGameIdKey)
                    }
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/utils/auth.js文件修改失败!
                请检查代码:
                1、是否已添加：setIsGameIdKey 相关代码
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
            if(file.indexOf('postUserLoginApi(params) {')> -1 && file.indexOf('getGamelistApi(params) {') === -1){
                file = newStr(file, file.indexOf('postUserLoginApi(params) {'),`
                getGamelistApi(params) {
                    return request.get(\`\${userUrl}/user/gamelist\`, params)
                  },
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/services/api.js文件修改失败!
                请检查代码:
                1、是否有：const accounts = apiUrl[process.env.VUE_APP_BASE_API]
                2、是否已添加：accounts = apiUrl['production'] 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/services/api.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改navbar.vue
    async function updateNavbar(){
        const filePath = `${pathFile}/src/layout/components/Navbar.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('<screenfull') > -1 && file.indexOf(':value="selectedGameId"') === -1){
                file = newStr(file,file.indexOf(`<screenfull`),`
                  <div class="right-menu-item hover-effect">
                    <el-select v-if="gamelist.length>0" :value="selectedGameId" class="select" filterable placeholder="请选择平台" @change="getSelectedGameId">
                      <el-option v-for="(item) in gamelist" :key="item.game_id" :label="item.game_id + '-' + item.game_name" :value="item.game_id" />
                    </el-select>
                  </div>
                        `)
                file = newStr(file,file.indexOf(`navbarBackground() {`),`selectedGameId() {
                      return Number(this.$store.state.permission.gameId) || ''
                    },
                        `)
                file = newStr(file,file.indexOf(`'sidebar',`),`
                    'gamelist',
                        `)
                file = newStr(file,file.indexOf(`methods: {`)+10,`
                    getSelectedGameId(gameID) {
                          this.$store.commit('permission/SET_GAMEID', gameID)
                          this.$store.commit('permission/SET_ROUTES', this.$store.state.permission.addRoutes)
                            if (this.$route.name.toLowerCase() === 'dashboard') {
                                this.$router.push({ path: 'reference-template/template-one', params: { id: gameID }})
                              } else {
                                this.$router.go(0)
                                // this.$router.push({ name: this.$route.name, params: { id: gameID }})
                              }
                            },
                        `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <screenfull
                2、是否已添加：:value="selectedGameId" 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }


    // 修改getters.js
    async function updateGetters(){
        const filePath = `${pathFile}/src/store/getters.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('sidebar: state => state.app.sidebar,') > -1 && file.indexOf('gamelist: state => state.user.gamelist,') === -1){
                file = newStr(file, file.indexOf('sidebar: state => state.app.sidebar,'),`
                    gamelist: state => state.user.gamelist,
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/store/getters.js文件修改失败!
                请检查代码:
                1、是否有：sidebar: state => state.app.sidebar,
                2、是否已添加：gamelist: state => state.user.gamelist, 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/store/getters.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改user.js
    async function updateUser(){
        const filePath = `${pathFile}/src/store/modules/user.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)
            if(file.indexOf('gamelist: []') === -1 && file.indexOf('token: getToken()') > -1 ){
                file = newStr(file, file.indexOf('token: getToken()'),`
                   gamelist: [],
                `)
                file = newStr(file, file.indexOf('RESET_STATE: (state) => {'),`
                   SET_Gamelist: (state, data) => {
                    state.gamelist = data
                  },
                `)

                file = newStr(file, file.indexOf('const actions = {')+'const actions = {'.length,`
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
                `)

                return Promise.resolve(file)
            }else {
                errorLog(`src/store/modules/user.js文件修改失败!
                请检查代码:
                1、是否有：token: getToken()
                2、是否已添加：gamelist: [] 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/store/modules/user.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // // 修改mock.mjs
    // async function updateMock(){
    //     const filePath = `${pathFile}/mock/mock.mjs`
    //     const isfile = await isFileExisted(filePath)
    //     if(isfile){
    //         let  file =  await fscreateReadStream(filePath)
    //         if(file.indexOf('router.get(\'/user/gamelist\', ctx => {') === -1){
    //             file = newStr(file, file.length,`
    //                const gamelist = {
    //                   'data': [
    //                     {
    //                       'game_id': 123,
    //                       'game_name': '牌圈1',
    //                       'category_id': 2,
    //                       'status': 1
    //                     }
    //                   ],
    //                   'errno': '0'
    //                 }
    //
    //                 // 游戏
    //                 router.get('/user/gamelist', ctx => {
    //                   const info = gamelist['data']
    //                   ctx.body = fhcode(info)
    //                 })
    //             `)
    //             return Promise.resolve(file)
    //         }else {
    //             errorLog(`src/store/getters.js文件修改失败!
    //             请检查代码:
    //             1、已添加：router.get(\'/user/gamelist\', ctx => { 相关代码
    //             `)
    //             return Promise.reject(new Error('Error'))
    //         }
    //     }else {
    //         errorLog('找不到mock/mock.mjs目标文件，请查看命令是否使用正确')
    //         return Promise.reject(new Error('Error'))
    //     }
    // }

    try {
        const navbarFile =  await updateNavbar()
        const authFile =  await updateAuth()
        const modulesPermissionFile =  await updateModulesPermission()
        const permissionFile =  await updatePermission()
        const dashboardFile =  await updateDashboard()
        const ApiFile =  await updateApi()
        const gettersFile =  await updateGetters()
        // const mockFile =  await updateMock()
        const userFile =  await updateUser()

        await fscreateWriteStream(`${pathFile}/src/store/modules`,`user.js`,userFile)
        log('src/store/modules/user.js文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/store/modules`,`permission.js`,modulesPermissionFile)
        log('src/store/modules/permission.js文件修改成功')

        await fscreateWriteStream(`${pathFile}/src`,`permission.js`,permissionFile)
        log('src/permission.js文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/views/dashboard`,'index.vue',dashboardFile)
        log('src/views/dashboard/index.vue文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,navbarFile)
        log('src/layout/components/Navbar.vue文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/services`,`api.js`,ApiFile)
        log('src/services/api.js文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/utils`,`auth.js`,authFile)
        log('src/utils/auth.js 文件修改成功')

        await fscreateWriteStream(`${pathFile}/src/store`,`getters.js`,gettersFile)
        log('src/store/getters.js 文件修改成功')

        // await fscreateWriteStream(`${pathFile}/mock`,`mock.mjs`,mockFile)
        // log('mock/mock.mjs 文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})

    }catch (e){
        errorLog('addGameShow 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



