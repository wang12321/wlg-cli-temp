const{promisify:promisify}=require("util"),{resolve:resolve}=require("path"),{fscreateReadStream:fscreateReadStream,fscreateWriteStream:fscreateWriteStream}=require("./common.js"),{run:run}=require("runjs"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async()=>{log("resolve   : "+resolve("./")),run("npm install @sentry/browser",{cwd:`${resolve("./")}`}),run("npm install @sentry/integrations",{cwd:`${resolve("./")}`});!async function(){let s=await fscreateReadStream(`${resolve("./")}/src/main.js`);if(-1<s.indexOf("Sentry.init({"))errorLog("查看代码main.js 是否有 Sentry.init 相关代码");else{let e=await fscreateReadStream(`${resolve("./")}/src/services/server.js`),r=`
        ${e.substring(0,e.indexOf("const service"))}
        import * as Sentry from '@sentry/browser'
        ${e.substring(e.indexOf("const service"),e.length)}
            `;if(-1!==r.indexOf("// sentry预留位置1 ---- 请不要删除")){let e=`
         ${r.substring(0,r.indexOf("// sentry预留位置1 ---- 请不要删除"))}
        Sentry.configureScope((scope) => {
        scope.setTag('errno', \`${response.data.errmsg}\`)
        scope.setLevel('warning')
        scope.setExtra('setExtra', response.config)
        scope.setExtra('localStorage', window.localStorage ? window.localStorage.valueOf() : 'localStorage无法获得')
        scope.setExtra('sessionStorage', window.sessionStorage ? window.sessionStorage.valueOf() : 'sessionStorage无法获得')
      })
      Sentry.captureMessage(\`errno不为0 ${response.data.errmsg} ${response.config.url}\`, 'info')
        ${r.substring(r.indexOf("// sentry预留位置1 ---- 请不要删除"),r.length)}
        `;var t=`
         ${e.substring(0,e.indexOf("// sentry预留位置2 ---- 请不要删除"))}
        Sentry.configureScope((scope) => {
      scope.setTag(\`${error.response.status}\`, \`${error.response.data.errmsg}\`)
      scope.setLevel('warning')
      scope.setExtra('setExtra', error)
      scope.setExtra('localStorage', window.localStorage ? window.localStorage.valueOf() : 'localStorage无法获得')
      scope.setExtra('sessionStorage', window.sessionStorage ? window.sessionStorage.valueOf() : 'sessionStorage无法获得')
    })
    Sentry.captureMessage(\`${error.response.status}${error.response.data.errmsg}${error.config.url}\`, 'info')
        ${e.substring(e.indexOf("// sentry预留位置2 ---- 请不要删除"),e.length)}
        `;await fscreateWriteStream(`${resolve("./")}/src/services`,"server.js",t),await fscreateWriteStream(`${resolve("./")}/src`,"main.js",s+`
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

/**
 * Sentry 接入平台配置 1、老环境 2、省外环境
 */
if (window.location.host === 'xxxxxx.xq668.com') {
  Sentry.init({
    dsn: 'https://xxxxxxxxxx.xq556.com/46',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  })
} else if (window.location.host === 'xxxxx.xq5.com') {
  Sentry.init({
    dsn: 'https://xxxxxxxxxxxxxxxxx.xq556.com/45',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  })
}
    `),run("npm run lint:fix",{cwd:`${resolve("./")}`}),log("sentry接入成功")}else errorLog("查看代码server.js 是否有 sentry预留位置1 ---- 请不要删除")}}()};