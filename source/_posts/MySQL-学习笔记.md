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
## 1.授权、登录相关
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

```sh
grant all privileges on test.* to mhy@localhost identified by '123';  
flush privileges;
```

**privilegesCode**代表授予的权限，常用的权限类型有：
- `all privileges` 所有权限
- `select` 读取权限
- `delete` 删除权限
- `update` 更新权限
- `create` 创建权限
- `drop` 删除数据库、数据表权限

**dbName.tableName**表示授予权限的数据库和数据表，常用的类型有以下几个：
- `.` 授予该数据库服务器上所有的数据库的权限
- `dbName.*` 授予dbName数据库上所有数据表的权限
- `dbName.dbTable` 授予dbName数据库的dbTable数据表的权限

**username@host**表示授予权限的用户及允许该用户登录的IP地址。其中Host有以下几种选择：
- `localhost` 只允许本地登录，不允许远程登录。
- `%` 允许在除本机之外的任何一台机器远程登录。
- `192.168.33.21` 具体的IP地址，表示允许该用户从特定的IP登录。

**password**
 指定该用户登录时的密码。

**flush privileges**
 表示刷新权限变更。

运行以下命令可以删除用户：
```sh
drop user zhangsan@'%';
```
查看用户`mhy`的权限用以下命令：
```sh
show grants for 'mhy';
```
## 2.创建、修改和删除数据库 database

### 创建数据表

创建数据库命令, dbName为数据库名字：
```sh
create database dbName;
```
### 删除数据库：
```sh
drop database dbName;
```
### 查看所有数据库：
```sh
show databases;
```

### 修改数据表

修改数据表更多的是修改数据表的结构。使用`alter table`语句。
- 删除字段用 `drop`
```sh
alter table tableName drop 字段名;
```
- 添加字段用 `add`
```sh
alter table tableName add 字段名 数据类型 [可选项];
```
- 修改字段名称和类型
有两种方式：`modify`和`change`
```sh
alter table tableName 原字段名 modify 新字段名 [char(20)]
```
可选项中可以是数据类型。
```sh
alter table tableName change 原字段名 新字段名 char(10);
```
- 修改数据表名
```sh
alter table tableName rename to newTableName;
```
还可以修改字段的默认值。

如果引擎是innodb的话，数据库名称不能修改，其他引擎的数据库重命名有数据丢失的风险，所以在创建数据库的时候命名切勿草率。

## 3.创建和修改数据表 table
创建数据表之前需要选择数据库，使用以下命令选择数据库：
```sh
use dbName;
```
选择数据库之后就可以创建数据表了，创建数据表的时候需要填写的有表名、表的字段名称、每个字段的数据类型，还有其他可选项主键（PRIMARY KEY）、外键（）、自动增长（AUTO_INCREMENT）、默认值（DEFAULT）、是否允许为空（NOT NULL）等。ENGINE=InnoDB设置引擎，引擎一般会在配置文件中设置，如果要建的数据表的引擎和配置文件不一样需要在此处指明。
```sh
create table tableName (
  字段1 数据类型 [其他可选项]，
  字段2 数据类型 [其他可选项]，
  ...
) [ENGINE=InnoDB DEFAULT CHARSET=utf8];
```
`[]`内的项为可选项，最后面的`ENGING DEFAULT CHARSET`也是可选项，一般都会在配置文件中设置，不需要在创建表时进行设置。
创建数据表的具体实例稍后讲了mysql的数据类型和约束后在将。
查看数据表：
```sh
show tables [from dbName];
```
查看表结构：
```sh
show columns from tableName;
```
数据表删除的三种语句drop、delete和truncate的异同：

**相同点**：

1. truncate和delete只删除表数据保留表结构；
2. truncate和不带where子句的delete，以及drop都能删除表内的数据.

**不同点**：

1. drop整个删除数据表，速度最快；
2. delete删除数据表中的数据，可以加入条件语句where，需要先查询符合条件的数据然后删除，如果不加条件语句，则清空所有数据;
3. truncate清空表内数据，但不删除数据表结构。
```sh
#删除数据表（结构、属性、索引）
drop table tableName;

# 删除某一行
delete from tableName  Where volumnName=values;
# 删除所有数据
delete from tableName；
# or
delete * from tableName

#清空数据
truncate table tableName;
```
对于有主外键关系的表，不能使用truncate而应该使用不带where子句的delete语句，由于truncate不记录在日志中，不能够激活触发器。

## 4.SQL数据类型

SQL语句常见的数据类型有字符串、数字和日期三大类。

### 字符串类型

CHAR和VARCHAR类型类似，但它们保存和检索的方式不同。它们的最大长度和是否尾部空格被保留等方面也不同。在存储或检索过程中不进行大小写转换。

<img style="width: 70%" src="https://wicdn.xiaohongchun.com/xhc-plat/1520585223512_53Wbnarmmc.png">

## 数值类型

<img style="width: 70%" src="https://wicdn.xiaohongchun.com/xhc-plat/1520585223512_yJtAzAQjAC.png">

### 日期时间类型

<img style="width: 70%" src="https://wicdn.xiaohongchun.com/xhc-plat/1520585223509_bknXEkz6P5.png">

合理选用数据类型对于提高MySQL性能具有非常重要的意义，这一块可以参考《高性能MYSQL》进行学习。

## 5.约束

约束主要完成对数据的检验和限制，从而保证数据库的完整性。常见的约束有以下几种：
- 外键约束(foreign key)
- 主键约束(primary key)
- 唯一值约束(unique)
- 自增长约束(auto_increment)
- 默认值约束(default)
- 非空约束(not null)

### 主键约束（primary key)

主键约束列不能重复，任意两行的主键值都不能相同，也不能为空值。
一般每一张数据表都有一个约束，通常为id，最好不要把业务字段设为主键，因为可能会有重复的数据。
创建数据表的时候在需要创建主键约束的字段后面的可选项位置加入 `primary key` 即可。
拥有主键约束的表插入数据时，拥有主键约束的字段的数据重复或为空时会报错。
常见的操作：
```sh
# 创建数据表时加入主键的两种方法
create table tableName (
  字段名1 数据类型 primary key,
  字段名2 数据类型 
);
create table tableName (
  字段名1 数据类型,
  字段名2 数据类型,
  constraint 约束名 primary key(字段名1)
);

# 添加主键 列名columnName如果为多个时建立联合主键
alter table tableName add primary key(columnName);

# 删除主键约束  
alter table tableName drop primary key;

# 修改列为主键
alter table tableName modify 字段名 数据类型 primary key;
```
**联合主键**:联合多个列建立联合主键。

### 外键约束（foreign key）

外键约束的作用是建立两张表之间的联系，保持数据的一致性。表的外键可以是另一张表的主键或唯一索引或唯一约束。
外键可以有重复的, 可以是空值。实现一对一或一对多关系。
创建外键约束实例：
```sh
# 创建父表
create table fatherTable(
  id int primary key,
  title varchar(10)
);

# 创建子表，建立外键有两种方式
# 第一种：添加关键字
create table sonTable(
  id int auto_increment,
  name varchar(20),
  constraint son_id primary key(id),
  father_id int references fatherTable(id)
);
# 第二种： 额外声明 son_id 为主键的名字，fa_tab_id为外键的名字
create table sonTable(
  id int auto_increment,
  name varchar(20),
  constraint son_id primary key(id),
  father_id int,
  constraint fa_tab_id foreign key(father_id) reference fatherTable(id)
);
```
**加外键约束的条件**：
- 父表和子表必须使用相同的存储引擎， 数据表的存储引擎只能为InnoDB,default-storage-engine-INNODB
- 外键列和参照列必须具有相似的数据类型，数字的长度或是有符号位必须相同，而字符 的长度可以不同
- 外键列和参照列必须创建索引，如果外键列不存在索引的话，MySQL将自动创建索引。
 
设定参照列:FOREIGN KEY(id) PEFERENCES provinces(id)
```sh
# 删除外键约束
alter table tableName drop foreign key 外键约束名;
(创建外键的方法没有指定约束名称，系统会默认给外键约束分配外键约束名称，命名为student_ibfk_n)

# 增加外键约束 
alter table tableName add foreign key 列名 references 父表(对应列名);
```

### 唯一约束（unique key）

`unique key`的用途：主要是用来防止数据插入的时候重复。
创建数据表时在字段后面加入`unique key`即可建立唯一约束。
也可以单独设置：
```sh
alter table tableName modify columnName char(20) unique key;
```

## 6.插入和修改记录

建立好数据表之后就可以插入数据了。

### 插入数据

插入数据使用`insert into`语句，具体如下：
```sh
inset into tableName (字段1, 字段2, 字段3,...字段n) values (值1, 值2, 值3, ...值n);
# 如果数据为字符串，必须加引号。
```
注意：以上语句插入数据的时候必须要保证一致性，即前后必须一一对应。
还有一种方式：
```sh
inset into tableName (字段1=值1, 字段2=值2, ...);
```
### 修改数据

update set命令用来修改表中的数据。
update set命令格式：
```sh
update tableName set 字段=新值, ... where 条件;
```

## 7.查询
数据查询使用`select`语句。
`select 查询项 from tableName [where 条件]`



