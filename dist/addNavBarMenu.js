const resolve=require("path")["resolve"],{fscreateReadStream,fscreateWriteStream,isFileExisted,newStr}=require("./common.js"),run=require("runjs")["run"],chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async t=>{"string"!=typeof t&&(t=""),log("resolve   : "+resolve("./")+"/"+t);let e=resolve("./")+(t&&0!==t.length?"/"+t:"");try{var r=await async function(){var t,r=e+"/src/layout/components/Navbar.vue";if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf('<div class="right-menu">')&&-1===e.indexOf("<el-menu")?(e=newStr(e,e.indexOf('<div class="right-menu">'),`
                  <div style="float: left;height: 100%;line-height: 50px;">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                      <el-menu-item v-for="(item,i) in addRouters" :key="i" :index="i.toString()">{{ item.meta && item.meta.title }}</el-menu-item>
                    </el-menu>
                  </div>
                        `),r=(r=(e=newStr(e,e.indexOf("navbarBackground() {"),`
                    addRouters(){
                      let routers = []
                      this.$store.state.permission.routes.forEach((item) =>{
                          if(item.meta){
                            routers.push(item)
                          }
                      });
                      return routers
                    },
                        `)).match(/(data\(\)\s*\{([\s\S]*?)return\s*\{)/g))&&r[0],t="mounted() {",e=-1<(e=-1<e.indexOf(r)?newStr(e,e.indexOf(r)+r.length,`
                  activeIndex: '0',
                        `):newStr(e,e.indexOf("computed: {"),`
                    data() {
                        return {
                          activeIndex: '0'
                        }
                      },
                    `)).indexOf(t)?newStr(e,e.indexOf(t)+t.length,`
                    this.urlhx()
                        `):newStr(e,e.indexOf("methods: {"),`
                     mounted() {
                        this.urlhx()
                      },
                        `),e=newStr(e,e.indexOf("methods: {")+10,`
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
                        `),e=newStr(e,e.indexOf("</style>"),`
.el-menu-demo {
  background-color: transparent;
  border-bottom: none;

  .el-menu-item {
    height: 50px;
    font-size: 17px;
    line-height: 50px;
    color: $navbarColor;
    border-bottom: none !important;

    &:not(.is-disabled):hover {
      color: $navbarColor;
      background-color: $mainColor;
    }

    &:not(.is-disabled):focus {
      color: $navbarColor;
      background-color: $mainColor;
    }
  }

  .is-active {
    background-color: $mainColor;

    &::after {
      position: absolute;
      top: auto;
      bottom: 10px;
      left: 50%;
      width: 30px;
      height: 4px;
      margin-left: -15px;
      content: "";
      //background-color: #ffffff;
      border-radius: 3px;
    }
  }
}
`),Promise.resolve(e)):(errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有: <div class="right-menu">
                2、是否已添加：<el-menu></el-menu> 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),o=await async function(){var t=e+"/src/store/modules/permission.js";if(await isFileExisted(t)){let e=await fscreateReadStream(t);return-1<e.indexOf("routes: [],")&&-1===e.indexOf("typeRoutes")?(e=newStr(e,e.indexOf("routes: [],"),`
                 typeRoutes: [],
                  basePath: '',
                `),e=newStr(e,e.indexOf("SET_ROUTES: (state, routes) => {"),`
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
                `),Promise.resolve(e)):(errorLog(`src/store/modules/permission.js文件修改失败!
                请检查代码:
                1、是否有: routes: [],
                2、是否已添加：typeRoutes: [], 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/store/modules/permission.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),a=await async function(){var t=e+"/src/layout/components/Sidebar/index.vue";if(await isFileExisted(t)){let e=await fscreateReadStream(t);return-1<e.indexOf("routes() {")&&-1===e.indexOf(":base-path=\"basePath+'/'+route.path\"")?(e=(e=(e=newStr(e,e.indexOf("routes() {"),`
                 basePath() {
                      return this.$store.state.permission.basePath
                    },
                `)).replace("this.$store.state.permission.routes","this.$store.state.permission.typeRoutes")).replace(':base-path="route.path"',`:base-path="basePath+'/'+route.path"`),Promise.resolve(e)):(errorLog(`src/layout/components/Sidebar/index.vue 文件修改失败!
                请检查代码:
                1、是否有: routes() {
                2、是否已添加：:base-path="basePath+'/'+route.path" 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("不存在目标文件src/layout/components/Sidebar/index.vue"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(e+"/src/layout/components","Navbar.vue",r),log("src/layout/components/Navbar.vue文件修改成功"),await fscreateWriteStream(e+"/src/store/modules","permission.js",o),log("src/store/modules/permission.js文件修改成功"),await fscreateWriteStream(e+"/src/layout/components/Sidebar","index.vue",a),log("src/layout/components/Sidebar/index.vue文件修改成功"),run("npm run lint:fix",{cwd:e})}catch(e){if(errorLog("addNavBarMenu 目标代码出错，请按上述报错信息检查代码"),t&&0!==t.length)return Promise.reject(()=>{})}};