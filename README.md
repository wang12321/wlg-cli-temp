wlg-cli-temp 是wlg-cli 升级版
目前wlg-cli已下架，全部使用wlg-cli-temp

环境配置：node > 10
npm >= 6.7

1、全局安装
```
npm install -g wlg-cli-temp
```

2、初始化项目
```
ff2 init <name>
```

直接会运行打开项目

以下命令需要到当前项目跟目录下使用

`
init <name> 初始化项目

addTemp <name> 初始化模板文件

add [name] 添加功能 

updateLayout 修改layout布局

deleteTagsViews 删除导航标签

sentry 接入sentry

qiankun 接入微前端

`

[思维导图](https://www.processon.com/view/link/615fa8757d9c0806d55a8067#map)


## 1.3.0 版本
1、加入mobile下载链接 

2、增加命名别名，优化命令信息

## 2.0.0 版本
1、为了区分wlg-cli-temp 和 wlg-cli

wlg-cli-temp： ff2

wlg-cli： ff

## 2.1.0 版本
1、新增添加导航栏显示一级目录
ff2 addNavBarMenu|addNBM

1、删除导航栏显示一级目录
ff2 deleteNavBarMenu|delNBM

## 2.1.1 版本
1、新增配置环境
ff2 addNewEnvironment|addENV <name> 添加新环境

## 2.1.2 版本
1、添加思维导图

## 2.2.0 版本
1、将私有库下载地址隐藏改为输入方式

2、开放公开库GitHub,如果不输入下载地址，默认使用GitHub

3、GitHub下载慢可设置代理

## 2.2.3 版本
1、完善基础模板

## 2.2.4 版本
1、解决windows \n报错的问题
