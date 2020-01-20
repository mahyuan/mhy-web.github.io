---
title: centos7配置防火墙
category: linux
tags:
  - linux
  - firewall
description: 'centos7使用firewall配置防火墙'
date: 2020-01-10 21:20:41
---

Linux下配置防火墙有iptables和firewall两种方式，在centos7以后的版本，默认使用firewall配置防火墙。
这里记录一下使用firewall配置防火墙的方式。


1.安装`firewalld`服务
在Centos 7.4中，系统已经默认安装了`firewalld`，我们只需要安装一下`firewall-config`即可。

检查系统是否已经安装了`firewalld`和`firewall-config`。
```sh
rpm -qa|grep firewalld
rpm -qa|grep firewall-config
```

centos安装`firewalld`和`firewall-config`：
```sh
yum install firewalld
yum install firewall-config
```

2.运行、停止、禁用`firewalld`
```sh
# 启动/停止/重启/开机启动/禁用 firewalld
systemctl start firewalld
systemctl stop firewalld
systemctl restart firewalld
systemctl enable firewalld
systemctl disable firewalld
```

- 查看firewall是否运行
```
systemctl status firewalld
# 或
firewall-cmd --state
```

- 查看default zone和active zone
default zone和active zone默认都是public。
```sh
firewall-cmd --get-default-zone
firewall-cmd --get-active-zone
```

- 查看当前开启了哪些服务
在linux下，一个服务对应一个端口，每个服务对应`/usr/lib/firewalld/services`下面一个xml文件。
```sh
firewall-cmd --list-services
```

- 查看还有哪些服务可以打开
```sh
firewall-cmd --get-services
```
- 查看所以打开的端口
```sh
firewall-cmd --zone=public --list-ports
```

- 更新防火墙规则
添加了防火墙规则之后必须手动更新才能生效
```sh
firewall-cmd --reload
```

- 添加一个服务到`firewalld`
如添加http服务至`firewalld`：
```sh
firewall-cmd --add-service=http
```
以上命令添加的服务在系统重启后会失效，如果要永久开放一个服务，需要加上`--permanent`选项。
```sh
firewall-cmd  --permanent --add-service=nginx
```

前面说过，linux下一个服务对应一个端口，如果要开启的端口没有对应的服务，可以自定义一个服务，在`/usr/lib/firewalld/services`新建一个xml文件，如`test.xml`，从该目录下其他文件复制内容过来，修改一下即可。其中，protocol和port是关键部分，可以自定义，改完之后把该服务添加至`firewalld`， 然后重启`firewalld`服务即可生效。
```sh
firewall-cmd --permanent --add-service=test
systemctl restart firewalld.service
```



查看版本： firewall-cmd --version
查看帮助： firewall-cmd --help
显示状态： firewall-cmd --state
查看所有打开的端口： firewall-cmd --zone=public --list-ports
更新防火墙规则： firewall-cmd --reload
查看区域信息:  firewall-cmd --get-active-zones
查看指定接口所属区域： firewall-cmd --get-zone-of-interface=eth0
拒绝所有包：firewall-cmd --panic-on
取消拒绝状态： firewall-cmd --panic-off
查看是否拒绝： firewall-cmd --query-panic

那怎么开启一个端口呢
添加
firewall-cmd --zone=public --add-port=80/tcp --permanent    （--permanent永久生效，没有此参数重启后失效）
重新载入
firewall-cmd --reload
查看
firewall-cmd --zone= public --query-port=80/tcp
删除
firewall-cmd --zone= public --remove-port=80/tcp --permanent

```sh
# 运行nginx
systemctl start firewalld.service
firewall-cmd --add-service=http --permanent
firewall-cmd --add-service=https --permanent
firewall-cmd --add-port=8080/tcp --permanent #追加一个测试用端口

firewall-cmd --reload


systemctl status firewalld.service
systemctl stop firewalld.service
systemctl start firewalld.service
firewall-cmd --remove-port=8080/tcp --permanent

firewall-cmd --list-ports
firewall-cmd --list-service
firewall-cmd --list-all
firewall-cmd --list-all-zones
firewall-cmd --zone=public --get-service
firewall-cmd --zone=public --query-service ftp

firewall-cmd --zone=public --add-service=ftp --permanent

firewall-cmd --zone=public --remove-service=ftp --permanent

firewall-cmd --query-port=80/tcp --zone=public
firewall-cmd --zone=public --add-port=6088/tcp
firewall-cmd --zone=public --remove-port=6088/tcp
firewall-cmd --zone=public --add-port=6000-6600/tcp
firewall-cmd --reload
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones
firewall-cmd --set-default-zone=public
firewall-cmd --panic-on
firewall-cmd --panic-off

```


四、firewalld的使用详解

<img src="https://firewalld.org/documentation/firewalld-structure+nftables.png" height="400" rel="firewalld structure">

1、使用之前，几个需要理解的概念。

在正式使用firewalld之前，有几个概念我们必须了解一下。

由firewalld 提供的区域按照从不信任到信任的顺序排序。

丢弃（drop）：任何流入网络的包都被丢弃，不作出任何响应。只允许流出的网络连接。

阻塞（block）：任何进入的网络连接都被拒绝，并返回 IPv4 的 icmp-host-prohibited 报文或者 IPv6 的 icmp6-adm-prohibited 报文。只允许由该系统初始化的网络连接。

公开（public）：用以可以公开的部分。你认为网络中其他的计算机不可信并且可能伤害你的计算机。只允许选中的连接接入。（You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.）

外部（external）：用在路由器等启用伪装的外部网络。你认为网络中其他的计算机不可信并且可能伤害你的计算机。只允许选中的连接接入。

隔离区（dmz）：用以允许隔离区（dmz）中的电脑有限地被外界网络访问。只接受被选中的连接。

工作（work）：用在工作网络。你信任网络中的大多数计算机不会影响你的计算机。只接受被选中的连接。

家庭（home）：用在家庭网络。你信任网络中的大多数计算机不会影响你的计算机。只接受被选中的连接。

内部（internal）：用在内部网络。你信任网络中的大多数计算机不会影响你的计算机。只接受被选中的连接。

受信任的（trusted）：允许所有网络连接。



### 参考文献
- [firewalld文档](https://firewalld.org/)
- [CentOS7为firewalld添加开放端口及相关资料](https://www.cnblogs.com/hubing/p/6058932.html)
- [在Ubuntu18.04/16.04系统上安装和使用Firewalld的方法](https://ywnz.com/linuxaq/4293.html)
- [CentOS7中firewalld的安装与使用详解](https://blog.csdn.net/solaraceboy/article/details/78342360)
