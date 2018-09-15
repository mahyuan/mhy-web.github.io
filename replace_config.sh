#!/bin/bash

git clone git@github.com:chaooo/hexo-theme-BlueLake.git;

floader="/themes/BlueLake"

if [ -d "$floader" ]; then
    rm -rf "$floader"
else
    mkdir "$floader"
fi

mkdir -vp /themes/BlueLake && mv hexo-theme-BlueLake/* "$floader";

rm -rf ./hexo-theme-BlueLake

if [ -f "/themes/BlueLake/_config.yml" ]; then
    mv "$floader/_config.yml" "/themes/BlueLake/_config.yml.backup"
fi;

cp "/source/_data/BlueLake_theme_config.yml" "/themes/BlueLake/_config.yml"
