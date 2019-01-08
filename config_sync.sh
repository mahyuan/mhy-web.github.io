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

# 因卜算子统计域名变更，如果theme仓库的域名还没有更新，需要更改 themes/BlueLake/layout/_partial/after_footer.jade 文件下的域名
# 截止2019/1/8，theme开发者github还没有同步该域名（已有人提了该issue），这里手动改一下
cat "source/_data/after_footer.jade" > "$floader/themes/BlueLake/layout/_partial/after_footer.jade" && echo "7. busuanz 域名更改，已经手动同步了!"
