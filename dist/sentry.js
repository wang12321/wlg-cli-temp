const{promisify:promisify}=require("util"),{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream,newStr:newStr}=require("./common.js"),{run:run}=require("runjs"),inquirer=require("inquirer"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async()=>{log("resolve   : "+resolve("./")),run("npm install @sentry/browser",{cwd:`${resolve("./")}`}),run("npm install @sentry/integrations",{cwd:`${resolve("./")}`});!async function(){var e=`${resolve("./")}/src/main.js`;let i=await fscreateReadStream(e);-1<i.indexOf("Sentry.init({")?errorLog("查看代码main.js 是否有 Sentry.init 相关代码"):inquirer.prompt([{type:"input",name:"url",message:"请输入判断域名地址,以、分割"},{type:"input",name:"dsn",message:"请输入dsn,以、分割。（请按域名的顺序对应）"}]).then(async e=>{console.log("answers",e);var r="",n=0<e.url.length?e.url.split("、"):[],s=0<e.dsn.length?e.dsn.split("、"):[];if(0<n.length&&n.length===s.length){let t="";n.forEach((e,r)=>{console.log(e,r),0<r&&r<n.length-1&&(t+="else "),t+=`
if (window.location.host === '${e}') {
  Sentry.init({
    dsn: '${s[r]}',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  })
}`}),r=`
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

${t}

`}else 0<s.length&&0===n.length?r=`
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

  Sentry.init({
    dsn: '${s[0]}',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  })
                `:errorLog("请按规则填写url或dsn");console.log(111111,r);let t=await fscreateReadStream(`${resolve("./")}/src/services/server.js`);var a=await fscreateReadStream(`${__dirname}/../PCFile/sentryOne.txt`),e=await fscreateReadStream(`${__dirname}/../PCFile/sentryTwo.txt`);t=newStr(t,t.indexOf("const service"),`import * as Sentry from '@sentry/browser'
            `),t=newStr(t,t.indexOf("// sentry预留位置1 ---- 请不要删除"),a),t=newStr(t,t.indexOf("// sentry预留位置2 ---- 请不要删除"),e),await fscreateWriteStream(`${resolve("./")}/src/services`,"server.js",t),await fscreateWriteStream(`${resolve("./")}/src`,"main.js",i+r),run("npm run lint:fix",{cwd:`${resolve("./")}`}),log("sentry接入成功")})}()};