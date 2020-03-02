---
title: centos7使用firewalld配置防火墙
category: linux
tags:
  - linux
  - firewalld
  - firewall-cmd
description: 'linux下配置防火墙有iptables和firewalld两种方式，在centos7以后的版本，默认使用firewall配置防火墙。
这里简单介绍一下firewalld以及使用firewalld配置防火墙的方式。'
date: 2020-01-10 21:20:41
---

linux下配置防火墙有iptables和firewalld两种方式，在centos7以后的版本，默认使用firewall配置防火墙。 这里简单介绍一下firewalld以及使用firewalld配置防火墙的方式。

<!-- more -->

## firewalld原理简介

使用firewalld之前应该先了解`zone`的概念，firewalld中将网络分成了不同信任等级的区域，不同的应用配置防火墙时可以归属于不同等级的zone，默认的zone是public，可以使用firewall-cmd --get-default-zone查看默认zone。
> 基于用户对网络中设备和交通所给与的信任程度，防火墙可以用来将网络分割成不同的区域。 NetworkManager 通知 firewalld 一个接口归属某个区域。接口所分配的区域可以由 NetworkManager 改变，也可以通过能为您打开相关 NetworkManager 窗口的 firewall-config 工具进行。在/etc/firewalld的区域设定是一系列可以被快速执行到网络接口的预定。

由firewalld 提供的区域按照从不信任到信任的顺序排序。

|区域名|介绍|
|:-----|:----|
|drop （丢弃）|任何接收的网络数据包都被丢弃，没有任何回复。仅能有发送出去的网络连接。|
|block（限制）|任何接收的网络连接都被 IPv4 的 icmp-host-prohibited 信息和 IPv6 的 icmp6-adm-prohibited 信息所拒绝。|
|public（公共）|在公共区域内使用，不能相信网络内的其他计算机不会对您的计算机造成危害，只能接收经过选取的连接。|
|external（外部）|特别是为路由器启用了伪装功能的外部网。您不能信任来自网络的其他计算，不能相信它们不会对您的计算机造成危害，只能接收经过选择的连接。|
|dmz（隔离区）|用于您的隔离区内的电脑，此区域内可公开访问，可以有限地进入您的内部网络，仅仅接收经过选择的连接。|
|work（工作）|用于工作区。您可以基本相信网络内的其他电脑不会危害您的电脑。仅仅接收经过选择的连接。|
|home（家庭）|用于家庭网络。您可以基本信任网络内的其他计算机不会危害您的计算机。仅仅接收经过选择的连接。|
|internal（内部）|用于内部网络。您可以基本上信任网络内的其他计算机不会威胁您的计算机。仅仅接受经过选择的连接。|
|trusted（信任）|可接受所有的网络连接。|

动态防火墙后台程序firewalld有firewall-cmd、firewall-config和firewall-applet等配置工具可以配置firewalld，其中firewall-config是图形化工具，centos下使用命令行客户端firewall-cmd进行配置。

firewalld配置存储在`/usr/lib/firewalld`和`/etc/firewalld`目录中的xml文件里，这样可以灵活的编辑这些文件来配置防火墙规则，也可以进行备份或者使用于其他设备。

firewalld的工作原理比较接近底层，作为一名前端菜鸟的我是不懂的，这里借官方的一张结构图说明一下。

<img src="https://firewalld.org/documentation/firewalld-structure+nftables.png" height="400" rel="firewalld structure">

## 安装firewalld
在Centos7.5以后的版本中，系统已经默认安装了firewalld和firewall-cmd，低版本没有安装时可以自己安装。安装前可以检测系统是否已经安装了firewalld和firewall-cmd。
```sh
rpm -qa|grep firewalld
rpm -qa|grep firewall-cmd
```
如果没有安装，则可以使用以下命令安装firewalld和firewall-cmd。
```sh
yum install firewalld
yum install firewall-cmd
```

## 运行、停止、禁用firewalld
使用firewalld前应该先把iptables关闭，两者不可同时使用
```sh
systemctl disable iptables
```
然后进行firewalld的启用。
```sh
# 启动/停止/重启/开机启动/禁用 firewalld
systemctl start firewalld
systemctl stop firewalld
systemctl restart firewalld
systemctl enable firewalld
systemctl disable firewalld
```

查看firewall是否运行
```
systemctl status firewalld
# 或
firewall-cmd --state
```

## firewalld配置
### 服务管理
查看default zone和active zone
default zone和active zone默认都是public。
```sh
firewall-cmd --get-default-zone
firewall-cmd --get-active-zone
```

### 查看当前开启了哪些服务
在linux下，一个服务对应一个端口，每个服务对应`/usr/lib/firewalld/services`下面一个xml文件。
```sh
firewall-cmd --list-services
```

### 查看还有哪些服务可以打开
```sh
firewall-cmd --get-services
```
### 查看所有打开的端口
```sh
firewall-cmd --zone=public --list-ports
```

### 更新防火墙规则
重新载入防火墙规则：
```sh
firewall-cmd --reload
```

以上命令添加的服务在系统重启后会失效，如果要永久开放一个服务，需要加上`--permanent`选项。
```sh
firewall-cmd  --permanent --add-service=nginx
```

前面说过，linux下一个服务对应一个端口，如果要开启的端口没有对应的服务，可以自定义一个服务，在`/usr/lib/firewalld/services`新建一个xml文件，如test.xml，从该目录下其他文件复制内容过来，修改一下即可。其中，protocol和port是关键部分，可以自定义，改完之后把该服务添加至firewalld， 然后重启firewalld服务即可生效。
```sh
firewall-cmd --permanent --add-service=test
systemctl restart firewalld.service
```

### firewalld常用命令汇总
```sh
# 查看版本
firewall-cmd --version

# 查看帮助
firewall-cmd --help

# 显示状态
firewall-cmd --state

# 查看所有打开的端口
firewall-cmd --zone=public --list-ports
firewall-cmd --list-service # 默认zone为public

# 查看防火墙，添加的端口也可以看到
firewall-cmd --list-all

# 查看所有zone下的防火墙
firewall-cmd --list-all-zones

# 更新防火墙规则
firewall-cmd --reload

# 查看区域信息
firewall-cmd --get-active-zones

# 查看指定接口所属区域
firewall-cmd --get-zone-of-interface=eth0

# 拒绝所有包
firewall-cmd --panic-on

# 取消拒绝状态
firewall-cmd --panic-off

# 查看是否拒绝
firewall-cmd --query-panic

# 查看default zone
firewall-cmd --get-default-zone

# 查看active zone
firewall-cmd --get-active-zones

# 设置 default zone
firewall-cmd --set-default-zone=public

# 查看服务
firewall-cmd --zone=public --get-service
firewall-cmd --zone=public --query-service ftp

# 添加服务
firewall-cmd --add-service=http
firewall-cmd --zone=public --add-service=ftp --permanent

# 删除服务
firewall-cmd --zone=public --remove-service=ftp --permanent

# 查看某个端口
firewall-cmd --zone=public --query-port=80/tcp

# 添加端口
firewall-cmd --zone=public --add-port=80/tcp --permanent  # --permanent永久生效，没有此参数重启后失效

# 删除端口
firewall-cmd --zone=public --remove-port=80/tcp --permanent

# 查看状态
systemctl status firewalld

# 开启firewalld
systemctl start firewalld

# 重启firewalld
systemctl restart firewalld

# 停止firewalld
systemctl stop firewalld

# 开启开机自启
systemctl enable firewalld

# 禁用开机自启
systemctl disable firewalld
```

firewalld还有其他的一些高级用法，如端口转发等，有兴趣可以查阅官方文档。

## 参考文献
- [firewalld文档](https://firewalld.org/)
- [CentOS7为firewalld添加开放端口及相关资料](https://www.cnblogs.com/hubing/p/6058932.html)
- [linux command firewalld](https://wangchujiang.com/linux-command/c/firewall-cmd.html)
- [在Ubuntu18.04/16.04系统上安装和使用Firewalld的方法](https://ywnz.com/linuxaq/4293.html)
- [CentOS7中firewalld的安装与使用详解](https://blog.csdn.net/solaraceboy/article/details/78342360)
- [Red Hat使用防火墙](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/7/html/security_guide/sec-using_firewalls)
