/**
 * @author ff
 * @date 2021/8/3
 * @Description: 添加模板。cd到文件目录 确定路径，选择模板
 * @update by:
 */

const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, format, newStr } = require('./common.js')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async name => {
    log('resolve   : ' + resolve('./'))
    log('name : ' + name)
    inquirer.prompt([{
        type: 'input',
        name: 'path',
        message: `请确认添加文件路径${resolve('./')}/${name}`,
        default: true
    }]).then((answers)=>{
       if(answers.path === true) {
           // autoRouter
           async function templateFile(){
               if(name.substring(0,1) === '/') {
                   name =  name.substring(1,name.length)
               }
               const filePath = `${resolve('./')}/${name}`
               const isfile = await isFileExisted(filePath)
               if(!isfile){
                   inquirer
                       .prompt([{
                           type: 'rawlist',
                           name: 'choice',
                           message: '请选择架构',
                           default: 0,
                           choices: [
                               { value: 1, name: '基础模板' },
                               { value: 2, name: '增删改查模板' }
                           ]
                       }]).then(async (rows)=> {
                       let  filePath = 'template.txt'
                       let  nameTemp = '基础模板'

                       if (rows.choice === 2) {
                           filePath = 'addFile.txt'
                           nameTemp = '增删改查模板'
                       }
                       let  file =  await fscreateReadStream(`${__dirname}/../PCFile/${filePath}`)


                       // var stringDate = format(new Date(new Date().getTime() + 3*24*60*60*1000),"yyyy-MM-dd");
                       // const meta = `
                       // meta: {
                       //         title: '${nameTemp}',
                       //         icon: 'form',
                       //         permissionArray: [1, 2, 3],
                       //         sortIndex: 1,
                       //         newTime: '${stringDate}'
                       // },
                       // `
                       // file = newStr(file, file.indexOf('data() {\n' +
                       //     '    return {'),meta)

                       if(name.indexOf('.vue') > -1 && name.indexOf('/') > -1){
                           const nameArr = name.split('/');
                           const nameStr = nameArr[nameArr.length - 1]
                           const namePath = nameArr.slice(0,nameArr.length-1).join('/')
                           await fscreateWriteStream(`${resolve('./')}/${namePath}`,`${nameStr}`,file)
                       }else  if(name.indexOf('.vue') > -1 && name.indexOf('/') === -1){
                           await fscreateWriteStream(`${resolve('./')}`,`${name}`,file)
                       }else  {
                           await fscreateWriteStream(`${resolve('./')}/${name}`,`index.vue`,file)
                       }

                       log(`${nameTemp}新增文件成功`)
                   })

               }else {
                   errorLog(`${resolve('./')}/${name}目标文件已存在`)
               }
           }
           templateFile()
       }else {
           errorLog('已取消新增，请重新cd文件路径添加')
       }
    })

}


