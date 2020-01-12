---
title: vps搭建指南
category: vps
tags:
  - vps
date: 2019-09-23 16:00:56
description: "vps搭建指南，实现科学上网"
---

上周发现我的vps又被禁了，又得重新部署。
每次部署vps都要google搜索相关命令，特别麻烦，这里记录一下搭建vps的简单步骤吧。

<!-- more -->
安装shadowsocks命令
```sh
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh

chmod +x shadowsocks-all.sh

./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```
安装过程中根据命令行交互选择服务器类型（如Shadowsocks-libev）、端口、密码、加密方法等。
如Shadowsocks-libev类型的服务的配置文件在 `/etc/shadowsocks-libev/config.json`，可以编辑配置。

查看状态
```
/etc/init.d/shadowsocks-libev status
```
重启服务
```
/etc/init.d/shadowsocks-libev restart
```
关闭服务
```
/etc/init.d/shadowsocks-libev stop
```
开启服务
```
/etc/init.d/shadowsocks-libev start
```

参考:
[科学上网的终极姿势：在 Vultr VPS 上搭建 Shadowsocks](https://zoomyale.com/2016/vultr_and_ss/)
[美国 VPS Hostwinds 购买流程新手教程](https://www.vps234.com/hostwinds-purchase-tutorial/)
[一键安装最新内核并开启 BBR 脚本](https://teddysun.com/489.html)
[新购VPS后的设置及网站迁移步骤](https://teddysun.com/276.html)
[2019年最好的国外VPS推荐](https://www.10besty.com/best-vps-hosting-services/)
