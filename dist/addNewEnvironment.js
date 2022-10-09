const{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,isFileExisted:isFileExisted,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async t=>{log("resolve   : "+resolve("./"));let s=resolve("./");try{var e=await async function(){var e=`${s}/.env.${t}`;if(await isFileExisted(e))return errorLog(`${e}文件存在!`),Promise.reject(new Error("Error"));{let e="";return-1<t.indexOf("development")?e=`NODE_ENV = development

# just a flag
ENV = ${t}

# base api
VUE_APP_BASE_API = '${t}'
`:-1<t.indexOf("production")?e=`NODE_ENV = production

# just a flag
ENV = ${t}

# base api
VUE_APP_BASE_API = '${t}'
`:log(`${t}不符合规范，前缀需要是development和production`),Promise.resolve(e)}}(),r=await async function(){var r=`${s}/package.json`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf('"scripts": {')?(-1<t.indexOf("development")?e=newStr(e,e.indexOf('"scripts": {')+'"scripts": {'.length,`
    "dev:${t.substring(11,t.length)}": "vue-cli-service serve --mode ${t}",`):-1<t.indexOf("production")&&(e=newStr(e,e.indexOf('"scripts": {')+'"scripts": {'.length,`
    "build:${t.substring(10,t.length)}": "vue-cli-service build --mode ${t}",`)),Promise.resolve(e)):(errorLog(`package.json文件修改失败!
                请检查代码:
                1、是否有: "scripts": {
                `),Promise.reject(new Error("Error")))}return errorLog("找不到package.json目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}(),o=await async function(){var r=`${s}/src/services/api-url.js`;if(await isFileExisted(r)){let e=await fscreateReadStream(r);return-1<e.indexOf("module.exports = {")?(e=newStr(e,e.indexOf("module.exports = {"),`
                const ${t} = {

                }
                `),e=newStr(e,e.indexOf("module.exports = {")+"module.exports = {".length,`
                ${t},`),Promise.resolve(e)):(errorLog(`api-url.js文件修改失败!
                请检查代码:
                1、是否有: module.exports = {
                `),Promise.reject(new Error("Error")))}return errorLog("找不到api-url.js目标文件，请查看命令是否使用正确"),Promise.reject(new Error("Error"))}();await fscreateWriteStream(`${s}`,`.env.${t}`,e),log(`.env.${t}文件修改成功`),await fscreateWriteStream(`${s}`,"package.json",r),log("package.json文件修改成功"),await fscreateWriteStream(`${s}/src/services`,"api-url.js",o),log("src/services/api-url.js文件修改成功"),run("npm run lint:fix",{cwd:`${s}`})}catch(e){errorLog("addNew 目标代码出错，请按上述报错信息检查代码")}};