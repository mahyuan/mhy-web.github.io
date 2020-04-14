---
title: systemctl命令指南
category: linux
tags:
  - linux
  - systemctl
description: 'systemctl是一个systemd工具，主要负责控制systemd系统和服务管理器。'
date: 2020-01-21 21:18:25
---

systemctl是一个systemd工具，主要负责控制systemd系统和服务管理器。
<!-- more -->

> systemctl命令 是系统服务管理器指令，它实际上将 service 和 chkconfig 这两个命令组合到一起

启动服务：
```sh
systemctl start nginx.service
```
关闭服务：
```sh
systemctl stop nginx.service
```
重启服务：
```sh
systemctl restart nginx.service
```
显示服务状态：
```sh
systemctl status nginx.service
```
在开机时启用服务：
```sh
systemctl enable nginx.service
```
在开机时禁用服务：
```sh
systemctl disable nginx.service
```
查看服务是否开机启动：
```sh
systemctl is-enabled nginx.service
```
列出所有服务：
```sh
systemctl list-unit-files | grep enabled
```
查看启动失败的服务列表：
```sh
systemctl --failed
```
使用systemctl命令杀死服务
```sh
systemctl kill nginx
systemctl status nginx
```
更多更详细的使用方式，可以阅读[官方文档](https://linux.cn/article-5926-1.htm)。

[systemctl 命令完全指南](https://linux.cn/article-5926-1.html)
[systemctl命令](https://man.linuxde.net/systemctl)
