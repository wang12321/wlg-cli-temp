const resolve=require("path")["resolve"],{fscreateReadStream,fscreateWriteStream,isFileExisted,newStr}=require("./common.js"),run=require("runjs")["run"],chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async t=>{"string"!=typeof t&&(t=""),log("resolve   : "+resolve("./")+"/"+t);let e=resolve("./")+(t&&0!==t.length?"/"+t:"");try{var r=await async function(){var t=e+"/src/layout/components/Sidebar/item.vue";if(await isFileExisted(t)){let e=await fscreateReadStream(t);return-1<e.indexOf("vnodes.push(<span slot='title'>{(title)}</span>)")&&-1===e.indexOf("newTime && newTime.getTime() > new Date().getTime()")?(e=e.replace("vnodes.push(<span slot='title'>{(title)}</span>)",`
              if (newTime && newTime.getTime() > new Date().getTime()) {
                vnodes.push(<span slot='title'>{(title)}<span style='color: red;display: inline-block;margin-top: -10px;padding:0 5px;'>NEW!</span></span>)
              } else {
                vnodes.push(<span slot='title'>{(title)}</span>)
              }`),e=(e=newStr(e,e.indexOf("icon: {"),`newTime: {
                  type: Date,
                  default: new Date()
                },
                `)).replace("const { icon, title } = context.props","const { icon, title, newTime } = context.props"),Promise.resolve(e)):(errorLog(`src/layout/components/Sidebar/item.vue文件修改失败!
                请检查代码:
                1、是否有: vnodes.push(<span slot='title'>{(title)}</span>)
                2、是否已添加：newTime && newTime.getTime() > new Date().getTime()
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Sidebar/item.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),n=await async function(){var t=e+"/src/layout/components/Sidebar/SidebarItem.vue";if(await isFileExisted(t)){let e=await fscreateReadStream(t);return-1<e.indexOf(':title="onlyOneChild.meta.title"')&&-1===e.indexOf(':new-time="new Date(onlyOneChild.meta.newTime)"')?(e=newStr(e,e.indexOf(':title="onlyOneChild.meta.title"'),':new-time="new Date(onlyOneChild.meta.newTime)" '),e=newStr(e,e.indexOf(':title="item.meta.title"'),':new-time="new Date(item.meta.newTime)" '),Promise.resolve(e)):(errorLog(`src/layout/components/Sidebar/SidebarItem.vue文件修改失败!
                请检查代码:
                1、是否有: :title="onlyOneChild.meta.title"
                2、是否已添加：:new-time="new Date(onlyOneChild.meta.newTime)"
                `),Promise.reject(new Error("Error")))}return errorLog("找不到src/layout/components/Sidebar/SidebarItem.vue目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(e+"/src/layout/components/Sidebar","item.vue",r),log("src/layout/components/Sidebar/item.vue文件修改成功"),await fscreateWriteStream(e+"/src/layout/components/Sidebar","SidebarItem.vue",n),log("src/layout/components/Sidebar/SidebarItem.vue文件修改成功"),run("npm run lint:fix",{cwd:e})}catch(e){if(errorLog("addNew 目标代码出错，请按上述报错信息检查代码"),t&&0!==t.length)return Promise.reject(()=>{})}};