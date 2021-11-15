const {promisify} = require('util')
const download = promisify(require('download-git-repo'))
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const {resolve} = require('path')
const { run } = require('runjs')

const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

const addBreadcrumb = require('./addBreadcrumb.js')
const addTagsView = require('./addTagsView.js')
const addGameShow = require('./addGameShow.js')
const addUnifiedLogin = require('./addUnifiedLogin.js')
const addSwitchEnvironment = require('./addSwitchEnvironment.js')
const addHeaderSearch = require('./addHeaderSearch.js')
const addNew = require('./addNew.js')
const addNavBarMenu = require('./addNavBarMenu.js')

module.exports.clonePC = async (repo,desc)=>{

    log('__dirname : ' + __dirname)
    log('resolve   : ' + resolve('./'))

    const ora = require('ora')
    const process = ora(`下载...${repo}`)
    process.start()
    await download(repo,desc,{clone: true}, err => {
        if(err){
            errorLog(`
            error: ${err}`)
            process.fail('下载失败')
            return
        }else {
            log(`
            success`)
        }
        process.succeed('下载成功')
        inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: '请输入项目名称'
        },{
            type: 'input',
            name: 'description',
            message: '请输入项目简介'
        },{
            type: 'input',
            name: 'author',
            message: '请输入作者名称'
        }]).then(async (answers)=>{
            console.log(answers)
            const packagePath = `${desc}/package.json`
            const packageContent = fs.readFileSync(packagePath,'utf8')
            const packageResult =  handlebars.compile(packageContent)(answers)
            fs.writeFileSync(packagePath,packageResult)

            inquirer
                .prompt([{
                    type: 'checkbox',
                    name: 'funcName',
                    message: '请选择配置功能',
                    checked: true,
                    choices: [
                        { value: 'Breadcrumb', name: 'Breadcrumb (添加面包屑)' },
                        { value: 'SwitchEnvironment', name: 'SwitchEnvironment (添加切换环境按钮)' },
                        { value: 'HeaderSearch', name: 'HeaderSearch (添加菜单搜索)' },
                        { value: 'New', name: 'New（添加菜单new！标志)' },
                        { value: 'UnifiedLogin', name: 'UnifiedLogin (接入统一登入)' },
                        { value: 'GameShow', name: 'GameShow (添加展示游戏平台)' },
                        { value: 'NavBarMenu', name: 'NavBarMenu（导航栏显示一级目录)' }
                    ],
                    default: ['New','SwitchEnvironment']
                }])
                .then(async (rows) => {
                    log('rows', rows)
                    run(`npm install`,{cwd:`${resolve('./')}/${desc}`})

                    let nameArr = rows.funcName || []
                    for(let i = 0;i<nameArr.length;i++){
                        let name = nameArr[i]
                        switch (name) {
                            case "TagsView":
                                await addTagsView(desc)
                                break;
                            case "Breadcrumb":
                                await addBreadcrumb(desc)
                                break;
                            case "GameShow":
                                await addGameShow(desc)
                                break;
                            case "UnifiedLogin":
                                await addUnifiedLogin(desc)
                                break;
                            case "SwitchEnvironment":
                                await addSwitchEnvironment(desc)
                                break;
                            case "HeaderSearch":
                                await addHeaderSearch(desc)
                                break;
                            case "New":
                                await addNew(desc)
                                break;
                            case "NavBarMenu":
                                await addNavBarMenu(desc)
                                break;
                            default:
                                errorLog('请输入选择的功能名')
                                break;
                        }
                    }

                    // // 格式化文件
                    run(`npm run lint:fix`,{cwd:`${resolve('./')}/${desc}`})
                    run(`npm run dev:mock`,{cwd:`${resolve('./')}/${desc}`})
                })
                .catch(error => {
                    errorLog(error)
                });
        })
    })
}
