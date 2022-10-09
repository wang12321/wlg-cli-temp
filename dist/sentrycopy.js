const promisify=require("util")["promisify"],resolve=require("path")["resolve"],{fscreateReadStream,fscreateWriteStream}=require("./common.js"),run=require("runjs")["run"],chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e));module.exports=async()=>{log("resolve   : "+resolve("./")),run("npm install @sentry/browser",{cwd:""+resolve("./")}),run("npm install @sentry/integrations",{cwd:""+resolve("./")}),async function(){var e,r=await fscreateReadStream(resolve("./")+"/src/main.js");-1<r.indexOf("Sentry.init({")?errorLog("查看代码main.js 是否有 Sentry.init 相关代码"):-1===(e=`
        ${(e=await fscreateReadStream(resolve("./")+"/src/services/server.js")).substring(0,e.indexOf("const service"))}
        import * as Sentry from '@sentry/browser'
        ${e.substring(e.indexOf("const service"),e.length)}
            `).indexOf("// sentry预留位置1 ---- 请不要删除")?errorLog("查看代码server.js 是否有 sentry预留位置1 ---- 请不要删除"):(e=`
         ${(e=`
         ${e.substring(0,e.indexOf("// sentry预留位置1 ---- 请不要删除"))}
        Sentry.configureScope((scope) => {
        scope.setTag('errno', \`\${response.data.errmsg}\`)
        scope.setLevel('warning')
        scope.setExtra('setExtra', response.config)
        scope.setExtra('localStorage', window.localStorage ? window.localStorage.valueOf() : 'localStorage无法获得')
        scope.setExtra('sessionStorage', window.sessionStorage ? window.sessionStorage.valueOf() : 'sessionStorage无法获得')
      })
      Sentry.captureMessage(\`errno不为0 \${response.data.errmsg} \${response.config.url}\`, 'info')
        ${e.substring(e.indexOf("// sentry预留位置1 ---- 请不要删除"),e.length)}
        `).substring(0,e.indexOf("// sentry预留位置2 ---- 请不要删除"))}
        Sentry.configureScope((scope) => {
      scope.setTag(\`\${error.response.status}\`, \`\${error.response.data.errmsg}\`)
      scope.setLevel('warning')
      scope.setExtra('setExtra', error)
      scope.setExtra('localStorage', window.localStorage ? window.localStorage.valueOf() : 'localStorage无法获得')
      scope.setExtra('sessionStorage', window.sessionStorage ? window.sessionStorage.valueOf() : 'sessionStorage无法获得')
    })
    Sentry.captureMessage(\`\${error.response.status}\${error.response.data.errmsg}\${error.config.url}\`, 'info')
        ${e.substring(e.indexOf("// sentry预留位置2 ---- 请不要删除"),e.length)}
        `,await fscreateWriteStream(resolve("./")+"/src/services","server.js",e),await fscreateWriteStream(resolve("./")+"/src","main.js",r+`
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
    `),run("npm run lint:fix",{cwd:""+resolve("./")}),log("sentry接入成功"))}()};