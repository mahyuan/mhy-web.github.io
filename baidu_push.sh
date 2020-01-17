#!/bin/bash

outpath='urls.txt'
outdirpath='dir.txt'

rm $outpath
rm $outdirpath

echo "baidu push"

path="./public"

echo $path

files=$(ls ${path})

for file in $files; do
  if [  -f ${path}"/"${file} ]; then
    echo 'https://mhynet.cn/'${file}  >> $outpath
  elif [ -d ${path}"/"${file} ]; then
    echo $file >> $outdirpath
  fi
done

cat urls.txt

curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=https://mhynet.cn&token=W5jYGtw56zjlVrXG"
