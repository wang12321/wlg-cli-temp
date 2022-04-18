const {promisify} = require('util')
// 封装一个函数，得到一个函数，得到的函数返回值是一个promise
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const inquirer = require('inquirer')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))
const {cloneMobile} = require('./mobileFile')
const {clonePC} = require('./PCFile')
module.exports = async name => {
    //打印页面
    clear()
    const data = await figlet('FF welcome')
    log(data)
    log('🚀创建项目' + name)

    inquirer
        .prompt([{
            type: 'list',
            name: 'framework',
            message: '请选择架构',
            default: 'PC',
            choices: [
                { value: 'PC', name: 'PC' },
                { value: 'Mobile', name: 'Mobile' }
            ]
        },{
            type: 'input',
            name: 'URL',
            message: '请输入下载地址，默认是GitHub地址'
        }])
        .then(async (answers) => {
            console.log('answers', answers)
            if(answers.framework === 'PC'){
                if(answers.URL){
                    await clonePC('direct:'+answers.URL,name)
                }else {
                    await clonePC('direct:https://github.com/wang12321/wlg-vue2-admin-cli#pc',name)
                }
            }else if(answers.framework === 'Mobile'){
                if(answers.URL){
                    await cloneMobile('direct:'+answers.URL,name)
                }else {
                    await cloneMobile('direct:https://github.com/wang12321/wlg-vue2-admin-cli#mobile',name)
                }
            }
        })
}


