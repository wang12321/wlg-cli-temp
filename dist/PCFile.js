const promisify=require("util")["promisify"],download=promisify(require("download-git-repo")),inquirer=require("inquirer"),fs=require("fs"),handlebars=require("handlebars"),resolve=require("path")["resolve"],run=require("runjs")["run"],chalk=require("chalk"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e)),addBreadcrumb=require("./addBreadcrumb.js"),addTagsView=require("./addTagsView.js"),addGameShow=require("./addGameShow.js"),addUnifiedLogin=require("./addUnifiedLogin.js"),addSwitchEnvironment=require("./addSwitchEnvironment.js"),addHeaderSearch=require("./addHeaderSearch.js"),addNew=require("./addNew.js"),addNavBarMenu=require("./addNavBarMenu.js");module.exports.clonePC=async(e,n)=>{log("__dirname : "+__dirname),log("resolve   : "+resolve("./"));const r=require("ora")("下载..."+e);r.start(),await download(e,n,{clone:!0},e=>{e?(errorLog(`
            error: `+e),r.fail("下载失败")):(log(`
            success`),r.succeed("下载成功"),inquirer.prompt([{type:"input",name:"name",message:"请输入项目名称"},{type:"input",name:"description",message:"请输入项目简介"},{type:"input",name:"author",message:"请输入作者名称"}]).then(async e=>{console.log(e);var r=n+"/package.json",a=fs.readFileSync(r,"utf8"),a=handlebars.compile(a)(e);fs.writeFileSync(r,a),inquirer.prompt([{type:"checkbox",name:"funcName",message:"请选择配置功能",checked:!0,choices:[{value:"Breadcrumb",name:"Breadcrumb (添加面包屑)"},{value:"SwitchEnvironment",name:"SwitchEnvironment (添加切换环境按钮)"},{value:"HeaderSearch",name:"HeaderSearch (添加菜单搜索)"},{value:"New",name:"New（添加菜单new！标志)"}],default:["New","SwitchEnvironment"]}]).then(async e=>{log("rows",e),run("npm install",{cwd:resolve("./")+"/"+n});var r=e.funcName||[];for(let e=0;e<r.length;e++)switch(r[e]){case"TagsView":await addTagsView(n);break;case"Breadcrumb":await addBreadcrumb(n);break;case"SwitchEnvironment":await addSwitchEnvironment(n);break;case"HeaderSearch":await addHeaderSearch(n);break;case"New":await addNew(n);break;case"NavBarMenu":await addNavBarMenu(n);break;default:errorLog("请输入选择的功能名")}run("npm run lint:fix",{cwd:resolve("./")+"/"+n}),run("npm run dev:mock",{cwd:resolve("./")+"/"+n})}).catch(e=>{errorLog(e)})}))})};