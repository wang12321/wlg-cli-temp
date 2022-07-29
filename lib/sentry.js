const { promisify } = require('util')
const { resolve } = require('path')
const { fscreateReadStream, fscreateWriteStream, newStr } = require('./common.js')
const { run } = require('runjs')
const inquirer = require('inquirer')

const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async () => {
    log('resolve   : ' + resolve('./'))
    run(`npm install @sentry/browser@5.4.3`,{cwd:`${resolve('./')}`})
    run(`npm install @sentry/integrations@5.4.2`,{cwd:`${resolve('./')}`})

    async function sentryFile(){
        const filePath = `${resolve('./')}/src/main.js`
        let  mainFile =  await fscreateReadStream(filePath)
        if(mainFile.indexOf("Sentry.init({") > -1) {
            errorLog('查看代码main.js 是否有 Sentry.init 相关代码')
            return
        }
        inquirer.prompt([{
            type: 'input',
            name: 'url',
            message: '请输入判断域名地址,以、分割'
        },{
            type: 'input',
            name: 'dsn',
            message: '请输入dsn,以、分割。（请按域名的顺序对应）'
        }]).then(async (answers)=> {
            console.log('answers',answers)
            var sentryMain = ''
            var urlList = answers.url.length>0?answers.url.split('、'):[]
            var dsnList = answers.dsn.length>0?answers.dsn.split('、'):[]
            if(urlList.length >0 && urlList.length === dsnList.length){
                let sentryList = ""
                urlList.forEach((itemUrl,index)=>{
                    console.log(itemUrl,index)
                    if(index > 0 && index < urlList.length -1){
                        sentryList+='else '
                    }
                    sentryList += `
if (window.location.host === '${itemUrl}') {
  Sentry.init({
    dsn: '${dsnList[index]}',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
        logErrors: true,
      })
    ]
  })
}`

                })

                sentryMain = `
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

${sentryList}

`

            }else if(dsnList.length>0 && urlList.length === 0){
                sentryMain = `
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

  Sentry.init({
    dsn: '${dsnList[0]}',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true,
        logErrors: true,
      })
    ]
  })
                `
            }else {
                errorLog('请按规则填写url或dsn')
            }
            console.log(111111,sentryMain)

            // server.js
            let  serverFile =  await fscreateReadStream(`${resolve('./')}/src/services/server.js`)
            let  sentryOneFile =  await fscreateReadStream(`${__dirname}/../PCFile/sentryOne.txt`)
            let  sentryTwoFile =  await fscreateReadStream(`${__dirname}/../PCFile/sentryTwo.txt`)


            serverFile = newStr(serverFile,serverFile.indexOf('const service'),`import * as Sentry from '@sentry/browser'
            `)

            serverFile = newStr(serverFile,serverFile.indexOf('// sentry预留位置1 ---- 请不要删除'),sentryOneFile)
            serverFile = newStr(serverFile,serverFile.indexOf('// sentry预留位置2 ---- 请不要删除'),sentryTwoFile)
            await fscreateWriteStream(`${resolve('./')}/src/services`,'server.js',serverFile)
            await fscreateWriteStream(`${resolve('./')}/src`,'main.js',mainFile+sentryMain)
            run(`npm run lint:fix`,{cwd:`${resolve('./')}`})
            log('sentry接入成功')
        })
    }
    sentryFile()
}


