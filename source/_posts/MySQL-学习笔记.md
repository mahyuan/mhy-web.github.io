---
title: MySQL学习笔记
category: mysql
tags:
  - mysql
  - 数据库
date: 2018-03-03 11:35:30
---
MySQL数据库学习笔记。
MySQL环境搭建可查阅资料，此处不细说。默认已搭建好MySQL环境。
## 1.登录及创建用户
以root用户登录MySQL
```sh
mysql -uroot -p
```
然后输入密码，登录成功后输入以下命令，创建个人用户：
```sh
create user mhy inentified by '123';
```
用户名为: `mhy`, 密码为: `123`。
创建用户后需要进行授权， 授权命令格式:

`grant [privilegesCode] on [dbName.tableName] to [username@host] identified by ["password"];`

`[]`内的项需要根据自己的情况选择。

**privilegesCode**代表授予的权限，常用的权限类型有：
- `all privileges` 所有权限
- `select` 读取权限
- `delete` 删除权限
- `update` 更新权限
- `create` 创建权限
- `drop` 删除数据库、数据表权限

```sh
grant all privileges on test.* to mhy@localhost identified by '123';  
```



## 2.创建数据库database

## 3.创建和修改数据表table

## 4.SQL数据类型

## 5.插入和修改记录

## 6.约束-主键、外键

## 7.查询

