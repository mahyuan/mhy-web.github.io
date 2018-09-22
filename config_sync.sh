#!/bin/bash

localRepo="$HOME/hexo-theme-BlueLake"
floader="themes/BlueLake"

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
