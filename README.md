
# 一、简介
![https://www.npmjs.com/package/wlg-cli-temp](https://img.shields.io/npm/v/wlg-cli-temp)
![https://www.npmjs.com/package/wlg-cli-temp](https://img.shields.io/npm/dt/wlg-cli-temp)
![https://github.com/wang12321/wlg-cli-temp](https://img.shields.io/github/languages/code-size/wang12321/wlg-cli-temp)
![https://github.com/wang12321/wlg-cli-temp](https://img.shields.io/github/issues-raw/wang12321/wlg-cli-temp)
![https://github.com/wang12321/wlg-cli-temp](https://img.shields.io/github/license/wang12321/wlg-cli-temp)

wlg-cli-temp单页面脚手架 是wlg-cli 升级版
目前wlg-cli已下架，全部使用wlg-cli-temp

建议环境配置：node > 10
npm >= 6.7

# 二、使用方法
[思维导图](https://www.processon.com/view/link/615fa8757d9c0806d55a8067#map)

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

```
init <name> 初始化项目

addTemp <name> 初始化模板文件

add [name] 添加功能

updateLayout 修改layout布局

deleteTagsViews 删除导航标签

sentry 接入sentry

qiankun 接入微前端

```

查看更多功能命令
```
ff2 -h 
```

# 三、版本信息
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

## 2.2.5 版本
1、解决windows \n报错的问题

## 2.2.6 版本
1、解决cloneMobile问题

## 2.2.7 版本
1、解决styleLint样式问题

## 2.2.8 版本
1、修改README.md信息

## 2.2.9 版本
1、gulp打包配置

## 2.3.0 版本
1、自动发布npm包,版本自动叠加，之后只会备注大更新信息

## 2.3.12 版本
1、更新统一登入集成，以及sentry集成
