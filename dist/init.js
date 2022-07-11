const{promisify:promisify}=require("util"),figlet=promisify(require("figlet")),clear=require("clear"),chalk=require("chalk"),inquirer=require("inquirer"),log=e=>console.log(chalk.green(e)),errorLog=e=>console.log(chalk.red(e)),{cloneMobile:cloneMobile}=require("./mobileFile"),{clonePC:clonePC}=require("./PCFile");module.exports=async i=>{clear();var e=await figlet("FF welcome");log(e),log("🚀创建项目"+i),inquirer.prompt([{type:"list",name:"framework",message:"请选择架构",default:"PC",choices:[{value:"PC",name:"PC"},{value:"Mobile",name:"Mobile"}]},{type:"input",name:"URL",message:"请输入下载地址，默认是GitHub地址"}]).then(async e=>{console.log("answers",e),"PC"===e.framework?e.URL?await clonePC("direct:"+e.URL,i):await clonePC("direct:https://github.com/wang12321/wlg-vue2-admin-cli#pc",i):"Mobile"===e.framework&&(e.URL?await cloneMobile("direct:"+e.URL,i):await cloneMobile("direct:https://github.com/wang12321/wlg-vue2-admin-cli#mobile",i))})};