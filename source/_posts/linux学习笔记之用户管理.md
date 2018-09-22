---
title: user管理
category: javascript
tags:
  - javascript
date: 2018-09-22 18:15:31
---
# 用户和用户组的管理
```
用户: 使用操作系统的人
用户组: 具有相同系统权限的一组用户
```
`/etc/group` 存储当前系统中所有用户组信息

格式：
```
 group:x:123:ABC,def,xyz
 组名称:组密码占位符:组编号:组中用户列表
```
组只有一个用户，用户组合和用户名相同，用户组列表为空,
root用户组的组号为0,
编号1~499全部是分配给系统的，越早安装的应用组编号越靠前,
个人用户编号从500开始计数,
组密码占位符全部都是x

`/etc/gshadow` 存储当前系统中用户组的密码信息
```
 group:*: :abc
 组名称:组密码:组管理者:组中用户列表
 ```
 
组密码为*或!或空表示没有组密码

`/etc/paswd` 存储当前系统所有用户的信息。
```
user:x:123:456:xxxx:/home/user:/bin/bash
用户名:密码占位符:用户编号:用户组编号:用户注释信息:用户主目录:shell类型
```
`/etc/shadow` 存储当前系统中所有用户的密码信息。

用户和用户组的密码保存在单独的文件/etc/gshadow 和/etc/shadow中， 需要的权限要比保存用户和用户组的文件高很多

管理用户组的命令：
- 添加用户组：
`groupadd [用户组名]`
- 修改用户组名：
`groupmod -n [newGroupName] [oldGroupName]`
- 修改用户组编号：
`groupmid -g 666 [groupName]`
- 创建用户组的时候指定编号：
`groupadd -g 888 [groupName]`
- 删除用户组(删除用户组之前必须先清空组内用户， 否则这些用户的组信息丢失， 有权限方面的影响)：
`groupdel [groupName]`

- 组内添加用户(用户目录默认在/home下，默认创建一个和用户名相同的用户组)：
```
useradd userName
useradd -g groupName -d /home/userName userName
```
- 给用户添加备注：
`useradd -c 备注内容 userName`
- 改用户名：
`usermod -l 新用户名 旧用户名`
- 指定新的用户文件夹：
`usermod -d /home/mhy mhy`
- 修改所属用户组：
`usermod -g 组名 用户名`
- 删除账号：
`userdel 用户名`
- 删除的同时删除用户目录:
`userdel -r 用户名`
- 禁止root以外的用户登录服务器（空文件就可以）：
`touch /etc/nologin`

- 锁定用户账户：
`passwd -l 用户名`
- 解锁用户
`passwd -u 用户名`
- 清除用户的密码，无密码登录：
`passwd -d 用户名`

### 主要组和附属组：
一个用户可以属于多个组，一个主要组，若干个个附属组, 添加多个，用逗号连接多个附属组名
```
gpasswd -a 用户名  附属组名
```

- 创建用户时指定主要组和附属组：
`useradd -g 主要组 -G 附属组1,负数组2  用户名
- 用户组设置密码：
`gpasswd 用户组名`

- 切换用户身份:
`su 用户名`

- 我是谁:
`whoami`
- 用户信息：
`id 用户名`
- 所属组：
`groups 用户名`
