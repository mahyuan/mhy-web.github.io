---
title: linux系统安装python3
date: 2020-4-11
permalink: /wsl-python3-setup
category: 工具链
tags:
  - python
  - wsl
---

前段时间趁着华为云的优惠活动入手了云服务器，顺手安装了python3环境，这周末回家忘记带电脑电源，结果不得不拿出在家吃了几个月灰的笔记本。 由于不习惯在windows系统下开发，所以就安装了wsl, 配置开发工具链。
<!-- more -->

这里记录一下在wsl ubuntu18.04上安装python3的过程吧，顺便把python3的安装包放在了我的云服务器上，通过ningx的autoindex功能实现一键下载，python官方源下载安装包卡的怀疑人生。所以，这里建议各位朋友，下载完python官方的安装包后记得保存好。

下面开始进入正题。

## 下载安装包
在[python官网](https://www.python.org/downloads/ "python3下载")进入下载页面，在这里选择你需要的版本，这里以`Python 3.7.0`为例，点击download会跳转到所选版本的详情页。
<img src="https://image.mhynet.cn/blog-python3_release_1.png" width=400 alt="package list">

在最下面的表格Files中选择*Gzipped source tarball*下载源码包。
<img src="https://image.mhynet.cn/blog-python3_release2.png" width=400 alt="gzip files">

也可以直接去官方的[ftp](https://www.python.org/ftp/python/3.7.0/)列表页面去下载，一般下载所需版本的.tgz包就可以了。

<img src="https://image.mhynet.cn/blog-python3_release3.png" width=400 alt="packages">

如果服务器的网速不佳，可以使用浏览器下载完之后使用scp上传服务器，或者复制安装包链接，使用curl或wget等直接下载到服务器上。

下载安装包的这段时间可以先安装一下python需要的库。

## 安装依赖库
源码编译需要依赖一些库，如gcc等。
- ubuntu 18.04
```bash
apt update && apt upgrade -y

apt-get install -y  libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev
apt-get install zlib1g-dev
```
- centos 7
```bash
yum -y install zlib-devel bzip2-devel openssl-devel openssl-static ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel libffi-devel lzma gcc
```

## 安装python3
下载或上传安装包到服务器，cd到安装包所在目录，解压安装包
```bash
tar -xzvf Python-3.7.0.tgz
```
一般用户手动安装的包都在/usr/local/目录下，解压后移动到/usr/local目录：
```bash
mv Python3.7.0 /usr/local/python-3.7
```
在/usr/local/python-3.7目录执行执行 configure 命令进行配置，使用 --prefix 选项指定安装路径。
```bash
./configure  --prefix=/usr/local/sbin/python-3.7
```
然后，编译和安装。
```bash
make && make install
```
安装过程中可能会出现依赖问题，可以搜索解决。
安装完之后可以执行`python3 --version`检查版本判断是否安装正确。

## 加入环境变量
刚才配置的时候使用了 --prefix 选项指定了安装后命令的位置，安装完成后使用软连接在/usr/bin目录下创建python3命令的副本。
```bash
ln -s /usr/local/sbin/python-3.7/bin/python3.7 /usr/bin/python3
ln -s /usr/local/sbin/python-3.7/bin/python3.7 /usr/bin/python3.7
```

## pip3的安装、升级、卸载
- 安装
```
apt-get install python3-pip
```
- 升级
```
pip3 install --upgrade pip
```
- 卸载
```
apt-get remove python3-pip
```
