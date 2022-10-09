const resolve=require("path")["resolve"],{fscreateReadStream,fscreateWriteStream,isFileExisted,newStr}=require("./common.js"),run=require("runjs")["run"],inquirer=require("inquirer"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async e=>{"string"!=typeof e&&(e=""),log("resolve   : "+resolve("./")+"/"+e);let t=resolve("./")+(e&&0!==e.length?"/"+e:"");!async function(){const i=t+"/src/layout/index.vue";await isFileExisted(i)?inquirer.prompt([{type:"rawlist",name:"layout",message:"请选择layout布局",choices:[{value:1,name:"上下布局"},{value:2,name:"左右布局"}],default:0}]).then(async e=>{let r=await fscreateReadStream(i);if(-1<r.indexOf("</el-header>")){if(1===e.layout)return void errorLog("已经是上下布局,请检查代码")}else if(2===e.layout)return void errorLog("已经是左右布局,请检查代码");if(-1<r.indexOf("<tags-view />"))errorLog("上下布局,不允许有<tags-view />,是否需要切换,如需切换请先执行 ff deleteTagsViews");else{r=r.substring(r.indexOf("<script>"),r.length),2===e.layout?r=newStr(r,r.indexOf("<script>"),`<template>
                          <div :class="classObj" class="app-wrapper">
                            <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
                            <sidebar class="sidebar-container" />
                            <div class="main-container">
                              <div class="fixed-header">
                                <navbar />
                              </div>
                              <section class="app-main">
                                <transition name="fade-transform" mode="out-in">
                                  <router-view :key="key" />
                                </transition>
                              </section>
                            </div>
                          </div>
                        </template>
                        
                     `):1===e.layout&&(r=newStr(r,r.indexOf("<script>"),`<template>
                           <div :class="classObj" class="app-wrapper">
                                <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
                                <el-header style="height: 50px;padding: 0">
                                  <div class="fixed-header-layout">
                                    <navbar />
                                  </div>
                                </el-header>
                                <div>
                                  <sidebar class="sidebar-container" style="margin-top: 50px" />
                                  <div class="main-container">
                                    <section class="app-main-layout">
                                      <transition name="fade-transform" mode="out-in">
                                        <router-view :key="key" />
                                      </transition>
                                    </section>
                                  </div>
                                </div>
                              </div>
                        </template>
                        
                        `)),-1<r.indexOf(':id="container"')&&(r=newStr(r,r.indexOf("</transition>")+"</transition>".length,`
                  <div v-if="this.$route.path.indexOf('/app')>-1" :id="container" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%" />
                `));try{var o=await async function(r){var o=t+"/src/layout/components/Navbar.vue",a=await isFileExisted(o);{if(a){let e=await fscreateReadStream(o);var i;return 2===r.layout?(a=e.match(/(<div\s*class="logo">([\s\S]*?)<div class="navbarLogo">)/g),o=a&&a[0],-1<e.indexOf(o)?(e=(e=e.replace(o,'<div class="navbarLogo_rl">')).replace("import Logo from './Sidebar/Logo'",""),a=(i=e.match(/(Screenfull,([\s\S]*?)Logo)/g))&&i[0],e=e.replace(a,"Screenfull"),Promise.resolve(e)):(errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有:${o}
                `),Promise.reject(new Error("Error")))):1===r.layout?(a='<div class="navbarLogo_rl">',-1<e.indexOf(a)?(e=e.replace(a,`<div class="logo">
                      <logo />
                    </div>
                    <div class="navbarLogo">`),e=newStr(e,e.indexOf("export default {"),`import Logo from './Sidebar/Logo'
                   `),o=(i=e.match(/(Hamburger,([\s\S]*?)Screenfull)/g))&&i[0],e=e.replace(o,`Hamburger,
                        Screenfull,
                        Logo`),Promise.resolve(e)):(errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有:${a}
                `),Promise.reject(new Error("Error")))):(errorLog("src/layout/components/Navbar.vue文件修改失败!"),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}}(e),a=await async function(r){var o=t+"/src/layout/components/Sidebar/index.vue",a=await isFileExisted(o);{if(a){let e=await fscreateReadStream(o);return 2===r.layout?(a='<logo :collapse="isCollapse" />',-1===e.indexOf(a)?(e=newStr(e,e.indexOf('<el-scrollbar wrap-class="scrollbar-wrapper">'),`<logo :collapse="isCollapse" />'
                   `),e=(e=newStr(e,e.indexOf("export default {"),`import Logo from './Logo'
                   `)).replace("components: { SidebarItem },","components: { SidebarItem, Logo },"),Promise.resolve(e)):(errorLog(`src/layout/components/Sidebar/index.vue文件修改失败!
                请检查代码:
                1、是否有:${a}
                `),Promise.reject(new Error("Error")))):1===r.layout?(o='<logo :collapse="isCollapse" />',-1<e.indexOf(o)?(e=(e=(e=e.replace(o,"")).replace("import Logo from './Logo'","")).replace("components: { SidebarItem, Logo },","components: { SidebarItem },"),Promise.resolve(e)):(errorLog(`src/layout/components/Sidebar/index.vue文件修改失败!
                请检查代码:
                1、是否有:${o}
                `),Promise.reject(new Error("Error")))):(errorLog("src/layout/components/Sidebar/index.vue文件修改失败!"),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Sidebar/index.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}}(e);await fscreateWriteStream(t+"/src/layout/components","Navbar.vue",o),log("src/layout/components/Navbar.vue文件修改成功"),await fscreateWriteStream(t+"/src/layout/components/Sidebar","index.vue",a),log("src/layout/components/Sidebar/index.vue文件修改成功"),await fscreateWriteStream(t+"/src/layout","index.vue",r),log("src/layout/index.vue文件修改成功"),run("npm run lint:fix",{cwd:""+t})}catch(e){return errorLog("目标代码出错，请按上述报错信息检查代码"),Promise.reject(()=>{})}}}):errorLog("找不到src/layout/index.vue目标文件，请查看命令是否使用正确")}()};