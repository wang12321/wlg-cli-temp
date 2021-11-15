const {promisify} = require('util')
const download = promisify(require('download-git-repo'))
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const {resolve} = require('path')
const { run } = require('runjs')

module.exports.cloneMobile = async (repo,desc)=>{

    console.log('__dirname : ' + __dirname)
    console.log('resolve   : ' + resolve('./'))

    const ora = require('ora')
    const process = ora(`下载...${repo}`)
    process.start()
    await download(repo,desc,{clone: true}, err => {
        console.log(err?'err':'success')
        console.log(err)
        process.succeed()
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
        }]).then((answers)=>{
            console.log(answers)
            const packagePath = `${desc}/package.json`
            const packageContent = fs.readFileSync(packagePath,'utf8')
            const packageResult =  handlebars.compile(packageContent)(answers)
            fs.writeFileSync(packagePath,packageResult)
            console.log('answers', answers)
            run(`npm install`,{cwd:`${resolve('./')}/${desc}`})

            // 格式化文件
            run(`npm run lint:fix`,{cwd:`${resolve('./')}/${desc}`})
            run(`npm run dev:mock`,{cwd:`${resolve('./')}/${desc}`})
        })
    })
}
