/**
 * @author ff
 * @date 2021/7/29
 * @Description: 修改layout布局  需要修改layout/index.vue 和item.vue 文件
 * @update by:
 */
const {resolve} = require('path')
const { fscreateReadStream, fscreateWriteStream, isFileExisted, newStr } = require('./common.js')
const { run } = require('runjs')
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const errorLog = content => console.log(chalk.red(content))

module.exports = async (desc) => {
    if(typeof(desc) !== 'string'){
        desc = ''
    }
    log('resolve   : ' + resolve('./') + '/'+ desc)
    let pathFile = resolve('./') + ((desc && desc.length !== 0) ? `/${desc}` : '')

    // 修改layout/index.vue
    async function updateLayout(){
        const filePath = `${pathFile}/src/layout/index.vue`
        const isfile = await isFileExisted(filePath)
        if(isfile){
            inquirer
                .prompt([{
                    type: 'rawlist',
                    name: 'layout',
                    message: '请选择layout布局',
                    choices: [
                        { value: 1, name: '上下布局' },
                        { value: 2, name: '左右布局' }
                    ],
                    default: 0
                }]).then(async (rows)=> {
                let  file =  await fscreateReadStream(filePath)

                if(file.indexOf('</el-header>') > -1){
                    //上下布局
                    if(rows.layout === 1){
                        errorLog('已经是上下布局,请检查代码')
                        return
                    }
                }else {
                    if(rows.layout === 2){
                        errorLog('已经是左右布局,请检查代码')
                        return
                    }
                }
                // 如果有tagsView 那么需要判断上下布局去除
                if(file.indexOf('<tags-view />') > -1){
                    errorLog(`上下布局,不允许有<tags-view />,是否需要切换,如需切换请先执行 ff deleteTagsViews`)
                    return
                }

                file = file.substring(file.indexOf('<script>'),file.length)
                if (rows.layout === 2) {
                    file = newStr(file,file.indexOf('<script>') ,`<template>
                          <div :class="classObj" class="app-wrapper">
                            <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
                            <sidebar class="sidebar-container" />
                            <div class="main-container">
                              <div class="fixed-header">
                                <navbar />
                              </div>
                              <section class="app-main">
                                <transition name="fade-transform" mode="out-in">
                                  <router-view :key="key" />
                                </transition>
                              </section>
                            </div>
                          </div>
                        </template>
                        
                     `)
                }else if (rows.layout === 1) {
                    file = newStr(file,file.indexOf('<script>') ,`<template>
                           <div :class="classObj" class="app-wrapper">
                                <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
                                <el-header style="height: 50px;padding: 0">
                                  <div class="fixed-header-layout">
                                    <navbar />
                                  </div>
                                </el-header>
                                <div>
                                  <sidebar class="sidebar-container" style="margin-top: 50px" />
                                  <div class="main-container">
                                    <section class="app-main-layout">
                                      <transition name="fade-transform" mode="out-in">
                                        <router-view :key="key" />
                                      </transition>
                                    </section>
                                  </div>
                                </div>
                              </div>
                        </template>
                        
                        `)
                }

                if(file.indexOf(':id="container"') > -1){
                    file = newStr(file, file.indexOf('</transition>')+'</transition>'.length, `
                  <div v-if="this.$route.path.indexOf('/app')>-1" :id="container" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%" />
                `)
                }

                try {
                    const navbarFile =  await updateNavbar(rows)
                    const sidebarFile =  await updateSidebar(rows)

                    await fscreateWriteStream(`${pathFile}/src/layout/components`,`Navbar.vue`,navbarFile)
                    log('src/layout/components/Navbar.vue文件修改成功')

                    await fscreateWriteStream(`${pathFile}/src/layout/components/Sidebar`,`index.vue`,sidebarFile)
                    log('src/layout/components/Sidebar/index.vue文件修改成功')

                    await fscreateWriteStream(`${pathFile}/src/layout`,`index.vue`,file)
                    log('src/layout/index.vue文件修改成功')
                    run(`npm run lint:fix`,{cwd:`${pathFile}`})
                }catch (e){
                    errorLog('目标代码出错，请按上述报错信息检查代码')
                    return Promise.reject(()=>{})
                }

            })

        }else {
            errorLog('找不到src/layout/index.vue目标文件，请查看命令是否使用正确')
        }
    }

    // 修改navbar.vue
    async function updateNavbar(rows) {
        const filePath = `${pathFile}/src/layout/components/Navbar.vue`
        const isfile = await isFileExisted(filePath)
        if (isfile) {
            let file = await fscreateReadStream(filePath)
            if (rows.layout === 2) {
                let str = '<div class="logo">\n' +
                    '      <logo />\n' +
                    '    </div>\n' +
                    '    <div class="navbarLogo">'
                if (file.indexOf(str) > -1) {
                    file = file.replace(str, `<div class="navbarLogo_rl">`)
                    file = file.replace('import Logo from \'./Sidebar/Logo\'', ``)
                    file = file.replace('Screenfull,\n' +
                        '    Logo', `Screenfull`)

                    return Promise.resolve(file)
                } else {
                    errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有:${str}
                `)
                    return Promise.reject(new Error('Error'))
                }
            } else if (rows.layout === 1) {
                let str = '<div class="navbarLogo_rl">'
                if (file.indexOf(str) > -1) {
                    file = file.replace(str, `<div class="logo">
                      <logo />
                    </div>
                    <div class="navbarLogo">`)
                    file = newStr(file, file.indexOf('export default {'), `import Logo from './Sidebar/Logo'
                   `)
                    file = file.replace('Hamburger,\n' +
                        '    Screenfull', `Hamburger,
                        Screenfull,
                        Logo`)
                    return Promise.resolve(file)
                } else {
                    errorLog(`src/layout/components/Navbar.vue文件修改失败!
                请检查代码:
                1、是否有:${str}
                `)
                    return Promise.reject(new Error('Error'))
                }
            } else {
                errorLog('src/layout/components/Navbar.vue文件修改失败!')
                return Promise.reject(new Error('Error'))
            }

        } else {
            errorLog('找不到src/layout/components/Navbar.vue目标文件，请查看命令是否使用正确')
            return Promise.reject(new Error('Error'))
        }

    }

        // 修改sidebar/index.vue
        async function updateSidebar(rows){
            const filePath = `${pathFile}/src/layout/components/Sidebar/index.vue`
            const isfile = await isFileExisted(filePath)
            if(isfile){
                let  file =  await fscreateReadStream(filePath)
                if(rows.layout === 2){
                    let str = '<logo :collapse="isCollapse" />'
                    if(file.indexOf(str) === -1){
                        file = newStr(file, file.indexOf('<el-scrollbar wrap-class="scrollbar-wrapper">'),`<logo :collapse="isCollapse" />'
                   `)
                        file = newStr(file, file.indexOf('export default {'),`import Logo from './Logo'
                   `)
                        file = file.replace('components: { SidebarItem },',`components: { SidebarItem, Logo },`)

                        return Promise.resolve(file)
                    }else {
                        errorLog(`src/layout/components/Sidebar/index.vue文件修改失败!
                请检查代码:
                1、是否有:${str}
                `)
                        return Promise.reject(new Error('Error'))
                    }
                }else if(rows.layout === 1){
                    let str = '<logo :collapse="isCollapse" />'
                    if(file.indexOf(str) > -1){
                        file = file.replace(str,``)
                        file = file.replace('import Logo from \'./Logo\'',``)
                        file = file.replace('components: { SidebarItem, Logo },',`components: { SidebarItem },`)
                        return Promise.resolve(file)
                    }else {
                        errorLog(`src/layout/components/Sidebar/index.vue文件修改失败!
                请检查代码:
                1、是否有:${str}
                `)
                        return Promise.reject(new Error('Error'))
                    }
                }else {
                    errorLog('src/layout/components/Sidebar/index.vue文件修改失败!')
                    return Promise.reject(new Error('Error'))
                }

            }else {
                errorLog('找不到src/layout/components/Sidebar/index.vue目标文件，请查看命令是否使用正确')
                return Promise.reject(new Error('Error'))
            }
    }
    updateLayout()
}



