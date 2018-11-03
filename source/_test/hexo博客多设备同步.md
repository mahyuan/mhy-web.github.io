---
title: hexo+github博客多设备同步
date: 2018-10-19 11:25:59
categories: 博客
tags: [hexo, github]
---

为什么hexo博客需要多设备同步呢？
很多基于hexo的博客的主题都是引用的第三方的主题项目啊，作为一个第三方的项目，导入到自己博客项目的themes目录下之后，作为一个subproject 是无法commit到自己的项目下的，删除原项目的.git文件把整个主题包作为自己项目的文件的当我没说，需要尊重一下主题开发者吧。

这样一来，在一个新设备上`git pull`了自己的项目后还要去`git pull`主题目录，直接拉下来的主题包的配置文件`_config.yml`文件一般都需要修改下吧，如果有google、百度统计相关的代码需要添加到主题中的相关文件中的，就需要改下原来的主题文件了，这些改的第一次改动之后，下一次你还记得怎么改不? 不记得啦！那只好在相关文件里面记录下来，下次直接参考该记录来重新配置下吧，手动配置感觉很麻烦，那就写一个shell脚本，下次直接执行以下该脚本就自动配置好啦！

这里贴一下我的自动化配置shell脚本：
```sh
#!/bin/bash

localRepo="$HOME/hexo-theme-BlueLake"
floader="themes/BlueLake"
subGitFloader="themes/BlueLake/.git"

if [ ! -d "$localRepo" ]; then
		echo "1. local BlueLake theme repostory not exist and start clone from remote......"
		echo $( git clone git@github.com:chaooo/hexo-theme-BlueLake.git && mv "hexo-theme-BlueLake" "$HOME/" )
else
		echo "1. local BlueLake theme repostory exist!"
fi

if [ -d "$floader" ]; then
   	rm -rf "$floader" && echo "2.remove themes/BlueLake success!"
fi

cp -Rf "$HOME/hexo-theme-BlueLake" "themes/BlueLake" && echo "3. copy thems successed!" || echo "3. copy thems failed!"

cat "source/_data/BlueLake_theme_config.yml" > "$floader/_config.yml" && echo "4. move _config.yml successed!"

cat "source/_data/baidu_config_script.jade" >> "themes/BlueLake/layout/_partial/after_footer.jade" && echo "5. add baidu_config_script success!" || echo "5. add baidu_config_script failed!"

if [ -d "$subGitFloader" ]; then
	echo $( rm -rf ${subGitFloader} ) && echo "6.remove ${subGitFloader} succsssful!"
fi
```

自从写好这段脚本后再也不用担心更换新设备后重新部署hexo博客的问题啦。
为什么需要经常部署博客呢？我爱折腾啊，电脑经常换系统啊，虚拟机ubuntu，Windows，Mac OS X双系统，近一年来重装了好多次系统啊，每次都重新部署开发环境好麻烦，而且换工作之后也会更换电脑啊。

今天周末，使用react写了会儿项目，折腾下博客吧。
