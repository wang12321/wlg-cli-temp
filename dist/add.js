const{resolve:resolve}=require("path"),inquirer=require("inquirer"),chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e)),addBreadcrumb=require("./addBreadcrumb.js"),addTagsView=require("./addTagsView.js"),addGameShow=require("./addGameShow.js"),addUnifiedLogin=require("./addUnifiedLogin.js"),addSwitchEnvironment=require("./addSwitchEnvironment.js"),addHeaderSearch=require("./addHeaderSearch.js"),addNew=require("./addNew.js"),addNavBarMenu=require("./addNavBarMenu.js");module.exports=async(e="")=>{if(log("resolve   : "+resolve("./")),log("name   : "+e),e&&0!==e.length)switch(e){case"TagsView":await addTagsView();break;case"Breadcrumb":await addBreadcrumb();break;case"GameShow":await addGameShow();break;case"UnifiedLogin":await addUnifiedLogin();break;case"SwitchEnvironment":await addSwitchEnvironment();break;case"HeaderSearch":await addHeaderSearch();break;case"New":await addNew();break;case"NavBarMenu":await addNavBarMenu();break;default:errorLog(`请输入正确的功能:
                  TagsView (添加导航标签) 
                  Breadcrumb (添加面包屑) 
                  GameShow (添加展示游戏平台) 
                  UnifiedLogin (接入统一登入) 
                  SwitchEnvironment (添加切换环境按钮) 
                  HeaderSearch (添加菜单搜索) 
                  New（添加菜单new！标志)
                  NavBarMenu (导航栏显示一级目录)
                  或者 ff add 选择功能`)}else inquirer.prompt([{type:"list",name:"funcName",message:"请选择添加的功能",choices:[{value:"TagsView",name:"TagsView (添加导航标签)"},{value:"Breadcrumb",name:"Breadcrumb (添加面包屑)"},{value:"GameShow",name:"GameShow (添加展示游戏平台)"},{value:"UnifiedLogin",name:"UnifiedLogin (接入统一登入)"},{value:"SwitchEnvironment",name:"SwitchEnvironment (添加切换环境按钮)"},{value:"HeaderSearch",name:"HeaderSearch (添加菜单搜索)"},{value:"New",name:"New（添加菜单new！标志)"},{value:"NavBarMenu",name:"NavBarMenu（导航栏显示一级目录)"}],default:0}]).then(async e=>{switch(console.log(e),e.funcName){case"TagsView":await addTagsView();break;case"Breadcrumb":await addBreadcrumb();break;case"GameShow":await addGameShow();break;case"UnifiedLogin":await addUnifiedLogin();break;case"SwitchEnvironment":await addSwitchEnvironment();break;case"HeaderSearch":await addHeaderSearch();break;case"New":await addNew();break;case"NavBarMenu":await addNavBarMenu();break;default:errorLog("请输入正确的功能名,或者 ff2 add 选择功能")}})};