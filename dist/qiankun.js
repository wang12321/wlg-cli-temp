const{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,isFileExisted:isFileExisted,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async()=>{log("resolve   : "+resolve("./"));try{var e=(n=`${resolve("./")}/src/views/qiankun/qiankun.vue`,o=`${__dirname}/../PCFile/qiankun.txt`,await(await isFileExisted(n)?(errorLog("已存在目标文件src/views/qiankun/qiankun.vue"),Promise.reject(new Error("Error"))):(o=await fscreateReadStream(o),Promise.resolve(o)))),r=await async function(){var r=`${resolve("./")}/src/router/index.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("export const constantRoutes = [")&&-1===e.indexOf("meta: { title: '微前端',")?(e=newStr(e,e.indexOf("export const constantRoutes = [")+"export const constantRoutes = [".length,`
                   {
                    path: '/app',
                    component: Layout,
                    alwaysShow: true,
                    meta: { title: '微前端',
                      icon: 'tree',
                      permissionArray: [1, 2, 3]
                    },
                    children: [{
                      path: '/app/vue',
                      name: 'AppOne',
                      meta: {
                        title: 'appvue',
                        icon: 'tree',
                        permissionArray: [1, 2, 3] // 表示只有超级管理员可以访问
                      },
                      component: () => import('@/views/qiankun/qiankun.vue')
                    }]
                  },
                `),Promise.resolve(e)):(errorLog(`目标文件src/router/index.js 修改失败!
                请检查代码:
                1、是否有: export const constantRoutes = [
                2、是否已添加：meta: { title: 微前端,' 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("已存在目标文件src/router/index.js"),Promise.reject(new Error("Error"))}(),t=await async function(){var r=`${resolve("./")}/src/layout/index.vue`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("</transition>")&&-1===e.indexOf(':id="container"')?(e=newStr(e,e.indexOf("</transition>")+"</transition>".length,`
                  <div v-if="this.$route.path.indexOf('/app')>-1" :id="container" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%" />
                `),e=newStr(e,e.indexOf("computed: {")+"computed: {".length,`
                  container() {
                      return this.$route.path.split('/').pop()
                    },
                  `),Promise.resolve(e)):(errorLog(`目标文件src/layout/index.vue 修改失败!
                请检查代码:
                1、是否有: </transition>
                2、是否已添加：:id="container" 相关代码
                `),Promise.reject(new Error("Error")))}return errorLog("已存在目标文件src/layout/index.vue"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(`${resolve("./")}/src/router`,"index.js",r),log("src/router/index.js文件修改成功"),await fscreateWriteStream(`${resolve("./")}/src/views/qiankun`,"qiankun.vue",e),log("src/views/qiankun/qiankun.vue文件添加成功"),await fscreateWriteStream(`${resolve("./")}/src/layout`,"index.vue",t),log("src/router/layout.vue文件修改成功");var a=await fscreateReadStream(`${resolve("./")}/src/main.js`),i=await fscreateReadStream(`${__dirname}/../template/qiankunMain.txt`);await fscreateWriteStream(`${resolve("./")}/src`,"main.js",a+i),run("npm install qiankun",{cwd:`${resolve("./")}`}),run("npm run lint:fix",{cwd:`${resolve("./")}`})}catch(e){errorLog("目标代码出错，请按上述报错信息检查代码")}var n,o};