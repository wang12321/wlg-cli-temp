/**
 * @author ff
 * @date 2021/8/14
 * @Description: 添加导航栏显示一级目录  需要修改Sidebar/index.vue 和 navbar.vue文件
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
            if(file.indexOf('<div class="right-menu">') > -1 && file.indexOf('<el-menu') === -1){
                file = newStr(file,file.indexOf(`<div class="right-menu">`),`
                  <div style="float: left;height: 100%;line-height: 50px;">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                      <el-menu-item v-for="(item,i) in addRouters" :key="i" :index="i.toString()">{{ item.meta && item.meta.title }}</el-menu-item>
                    </el-menu>
                  </div>
                        `)
                file = newStr(file,file.indexOf(`navbarBackground() {`),`
                    addRouters(){
                      let routers = []
                      this.$store.state.permission.routes.forEach((item) =>{
                          if(item.meta){
                            routers.push(item)
                          }
                      });
                      return routers
                    },
                        `)

                var datastr = 'data() {\n' +
                    '    return {'
                if(file.indexOf(datastr) > -1){
                    file = newStr(file,file.indexOf(datastr)+datastr.length,`
                  activeIndex: '0',
                        `)
                }else {
                    file = newStr(file,file.indexOf('computed: {'),`
                    data() {
                        return {
                          activeIndex: '0'
                        }
                      },
                    `)
                }

                var mountedstr = 'mounted() {'
                if(file.indexOf(mountedstr) > -1){
                    file = newStr(file,file.indexOf(mountedstr)+mountedstr.length,`
                    this.urlhx()
                        `)
                }else {
                    file = newStr(file,file.indexOf('methods: {'),`
                     mounted() {
                        this.urlhx()
                      },
                        `)
                }

                file = newStr(file,file.indexOf(`methods: {`)+10,`
                     urlhx() {
                          let path = window.location.pathname
                          path = path.indexOf('/') > -1 ? path.split('/')[1] : path
                          this.addRouters.forEach((item, index) => {
                            if (item.path === '/' + path) {
                              this.activeIndex = index.toString()
                            }
                          })
                          this.handleSelect(Number(this.activeIndex), window.location.pathname)
                        },
                        handleSelect(key, keyPath) {
                          const addRouters = this.addRouters // note: roles must be a array! such as: ['editor','develop']
                          this.$store.commit('permission/SET_ROUTERSX', addRouters[key].name)
                          this.$store.commit('permission/SET_BasePath', addRouters[key].path)
                          if (typeof (keyPath) === 'string') {
                            this.$router.push({ path: keyPath })
                          } else {
                            this.$router.push({ path: addRouters[key].path })
                          }
                        },
                        `)

                file = newStr(file,file.indexOf(`</style>`),`.el-menu-demo{
  background-color: transparent;
  border-bottom: none;
  .el-menu-item{
    border-bottom: none !important;
    height: 50px;
    line-height: 50px;
    color:$navbarColor;
    font-size: 17px;
    &:not(.is-disabled):hover{
      color:$navbarColor;
      background-color: $mainColor;
    }
    &:not(.is-disabled):focus{
      color:$navbarColor;
      background-color: $mainColor;
    }
  }
  .is-active{
    background-color: $mainColor;
    &:after {
      content: '';
      position: absolute;
      bottom: 10px;
      top: auto;
      left: 50%;
      height: 4px;
      width: 30px;
      margin-left: -15px;
      //background-color: #ffffff;
      border-radius: 3px;
    }
  }
}`)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <div class="right-menu">
                2、是否已添加：<el-menu></el-menu> 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改modules/permission.js
    async function updateModulesPermission(){
        const filePath = `${pathFile}/src/store/modules/permission.js`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)

            if(file.indexOf('routes: [],') > -1 && file.indexOf('typeRoutes') === -1){

                file = newStr(file,file.indexOf('routes: [],'),`
                 typeRoutes: [],
                  basePath: '',
                `)

                file = newStr(file,file.indexOf('SET_ROUTES: (state, routes) => {'),`
                 SET_ROUTERSX: (state, typeName) => {
                    for (let i = 0; i < state.routes.length; i++) {
                      if (typeName === state.routes[i].name) {
                        state.typeRoutes = state.routes[i].children
                      }
                    }
                  },
                  SET_BasePath: (state, basePath) => {
                    state.basePath = basePath
                  },
                `)
                return Promise.resolve(file)
            }else {
                errorLog(`src/store/modules/permission.js文件修改失败!
                请检查代码:
                1、是否有: routes: [],
                2、是否已添加：typeRoutes: [], 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('找不到src/store/modules/permission.js目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }
    }

    // 修改Sidebar/index.vue
    async function updataSidebarView(){
        const filePath = `${pathFile}/src/layout/components/Sidebar/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            let  file =  await fscreateReadStream(filePath)

            if(file.indexOf('routes() {') > -1 && file.indexOf(':base-path="basePath+\'/\'+route.path"') === -1){

                file = newStr(file,file.indexOf('routes() {'),`
                 basePath() {
                      return this.$store.state.permission.basePath
                    },
                `)

                file = file.replace(`this.$store.state.permission.routes`, `this.$store.state.permission.typeRoutes`)

                file = file.replace(`:base-path="route.path"`, `:base-path="basePath+'/'+route.path"`)
                return Promise.resolve(file)
            }else {
                errorLog(`src/layout/components/Sidebar/index.vue 文件修改失败!
                请检查代码:
                1、是否有: routes() {
                2、是否已添加：:base-path="basePath+'/'+route.path" 相关代码
                `)
                return Promise.reject(new Error('Error'))
            }
        }else {
            errorLog('不存在目标文件src/layout/components/Sidebar/index.vue')
            return Promise.reject(new Error('Error'))
        }
    }

    try {
        const NavbarFile =  await updateNavbar()
        const PermissionFile =  await updateModulesPermission()
        const SidebarFile =  await updataSidebarView()
        await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,NavbarFile)
        log('src/layout/components/Navbar.vue文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/store/modules`,`permission.js`,PermissionFile)
        log('src/store/modules/permission.js文件修改成功')
        await fscreateWriteStream(`${pathFile}/src/layout/components/Sidebar`,`index.vue`,SidebarFile)
        log('src/layout/components/Sidebar/index.vue文件修改成功')
        run(`npm run lint:fix`,{cwd:`${pathFile}`})
    }catch (e){
        errorLog('addNavBarMenu 目标代码出错，请按上述报错信息检查代码')
        if(desc && desc.length !== 0){
            return Promise.reject(()=>{})
        }
    }
}



