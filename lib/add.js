/**
 * @author ff
 * @date 2021/8/4
 * @Description: 添加选择配置
 * @update by:
 */
const {resolve} = require('path')
const inquirer = require('inquirer')
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



module.exports = async (name = '') => {
    log('resolve   : ' + resolve('./'))
    log('name   : ' + name)

    if(name && name.length !== 0){
        switch (name) {
            case "TagsView":
                await addTagsView()
                break;
            case "Breadcrumb":
                await addBreadcrumb()
                break;
            case "GameShow":
                await addGameShow()
                break;
            case "UnifiedLogin":
                await addUnifiedLogin()
                break;
            case "SwitchEnvironment":
                await addSwitchEnvironment()
                break;
            case "HeaderSearch":
                await addHeaderSearch()
                break;
            case "New":
                await addNew()
                break;
            case "NavBarMenu":
                await addNavBarMenu()
                break;
            default:
                errorLog(`请输入正确的功能:
                  TagsView (添加导航标签) 
                  Breadcrumb (添加面包屑) 
                  GameShow (添加展示游戏平台) 
                  UnifiedLogin (接入统一登入) 
                  SwitchEnvironment (添加切换环境按钮) 
                  HeaderSearch (添加菜单搜索) 
                  New（添加菜单new！标志)
                  NavBarMenu (导航栏显示一级目录)
                  或者 ff add 选择功能`)
                break;
        }
    }else {

        inquirer
            .prompt([{
                type: 'list',
                name: 'funcName',
                message: '请选择添加的功能',
                choices: [
                    { value: 'TagsView', name: 'TagsView (添加导航标签)' },
                    { value: 'Breadcrumb', name: 'Breadcrumb (添加面包屑)' },
                    { value: 'GameShow', name: 'GameShow (添加展示游戏平台)' },
                    { value: 'UnifiedLogin', name: 'UnifiedLogin (接入统一登入)' },
                    { value: 'SwitchEnvironment', name: 'SwitchEnvironment (添加切换环境按钮)' },
                    { value: 'HeaderSearch', name: 'HeaderSearch (添加菜单搜索)' },
                    { value: 'New', name: 'New（添加菜单new！标志)' },
                    { value: 'NavBarMenu', name: 'NavBarMenu（导航栏显示一级目录)' }
                ],
                default: 0
            }]).then(async (rows)=> {
                console.log(rows)
            let name = rows.funcName
            switch (name) {
                case "TagsView":
                    await addTagsView()
                    break;
                case "Breadcrumb":
                    await addBreadcrumb()
                    break;
                case "GameShow":
                    await addGameShow()
                    break;
                case "UnifiedLogin":
                    await addUnifiedLogin()
                    break;
                case "SwitchEnvironment":
                    await addSwitchEnvironment()
                    break;
                case "HeaderSearch":
                    await addHeaderSearch()
                    break;
                case "New":
                    await addNew()
                    break;
                case "NavBarMenu":
                    await addNavBarMenu()
                    break;
                default:
                    errorLog('请输入正确的功能名,或者 ff2 add 选择功能')
                    break;

            }
        })
    }
}



