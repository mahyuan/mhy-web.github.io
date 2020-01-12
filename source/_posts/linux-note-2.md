---
title: linux 学习笔记(2)
category: 后端
tags:
	- linux
	- bash
date: 2018-08-20 13:26:13
description: "linux学习笔记之shell编程"
---

### 1.shell 脚本
脚本语言是用来让计算机自动化执行完成一系列工作的程序，不需要编译，通常是通过解释器运行的。

<!-- more -->

### 2.shell环境

shell文件的第一行的"#!"是一个约定的标记，告诉系统其后路径所指定的程序即是解释此脚本的shell程
linux的shell种类常见的有：

* Bourne Ageng Shell(/bin/bash)
* Bourne Shell(/usr/bin/sh 或/bin/sh)
* "C Shell" (/usr/bin/csh)
* Shell for Root(/sbin/sh)

### 3.运行shell脚本

创建一个shell脚本文件,保存为test.sh
```sh
echo "hello"   #echo命令用于向窗口输出文本
```
1. 作为可执行文件
```sh
chmod +x ./text.sh  #使脚本具有执行权限
./test.sh #执行脚本
```
执行脚本必须指定路径，可以用绝对路径或者相对路径，不指定路径会从PATH里面找。

2. 作为解释器参数

直接运行解释器，其参数为shell脚本的文件名
```sh
/bin/sh test.sh
/bin/php test.php
```
这种方式运行脚本，第一行不需要指定解释器信息，写了也不起作用

### 4.shell变量

#### 4.1 变量定义

变量名和等号之间不能有空格，shell变量定义的规定：
* 变量命名只能使用英文字母，数字和下划线，首字符不能以数字开头
* 中间不能有空格，可以使用下划线
* 不能使用标点符号
* 不能使用bash里的关键字

有效的变量示例如下：
```sh
Room
L_YARM
_var
var2
```
无效的变量名：
```sh
?var=123
user*name=runoob
```
变量赋值可以显式的直接赋值也可以用语句来赋值：
```sh
Room=222

for file in `ls /etc`
```

#### 4.2 变量的使用

使用一个定义过的变量，只需要在变量前面加上美元符号即可
```sh
your_name='mhy'
echo $your_name
echo ${your_name}
```
变量名外面的花括号可选，加花括号是为了帮助解释器识别变量的边界
```sh
for skill in Ada Coffe Action Java; do
	echo "I am good at ${skill}Script"
done
```
推荐给所有变量加上$

已定义的变量可以重新被定义
```sh
your_name="tom"
echo ${your_name}
your_name="lily"
echo ${your_name}
```
但是变量定义的时候不能加$符号。

#### 4.3 只读变量

使用readonly命令可以将变量定义为只读变量，修改只读变量会报错
```sh
#!bin/bash
girl_friend="lily"
readonly girl_fiend
gir_friend="leilei"
```
运行脚本报错了.

#### 4.4 删除变量

使用unset 命令删除变量
```sh
girl_friend="xiao mei"
unset girl_friend
```
**unset 命令不能删除只读变量**

#### 4.5 变量类型

shell脚本语言存在三种变量：
- 局部变量 局部变量在脚本或命令中定义，仅在当前shell实例中有效
- 环境变量 所有的程序包括shell启动的程序，都能访问环境变量，必要时shell脚本也能定义环境变量
- shell变量 shell变量是由shell程序设置的特殊变量，shell变量中有一部分是环境变量，一部分是局部变量，这些变量保证了shell的正常运行

### 5.shell字符串

字符串是shell编程中最常用最有效的数据类型。
字符串可以用单引号或双引号或不用引号。

#### 5.1 单引号

单引号字符串的限制：
* 单引号里任何字符都会原样输出，单引号字符串中的变量是无效的
* 单引号字符串中不能出现单引号（对单引号使用转义符后也不行）
#### 5.2 双引号

双引号的有点：
* 双引号里可以有变量
* 双引号里可以出现转义字符

#### 5.3 拼接字符串

```sh
your_name="mhy"
greeting="hello", "$your_name"!"
greeting_1="hello, ${your_name}!"
echo $greeting $greeting_1
```

#### 5.4 获取字符串长度
```sh
# string="beijing"
# echo ${#string} #输出 7
```

#### 5.5 提取字符串

以下实例从字符串第2个字符开始截取4个字符
```sh
string="hello beijing!"
echo ${string:1:4} #输出 trin
```

#### 5.6 查找子字符串

查找子字符串的位置
```sh
string="wellcome to beijing, shaonian"
echo `expr index "$string" is` # 输出
```

#### 5.7 判断读取字符串值

| 表达式             | 含义                                 |
|-----------------|------------------------------------|
| ${var}          | 定义var的值，与$var相同                    |
|                 |                                    |
| $(var-DEFAULT}  | 如果var没有被声明，那么就以$DEFAULT作为其值        |
| ${var:-DEFAULT} | 如果var没有被声明，或者其值为空，那么就以$DEFAULT作为其值 |
|                 |                                    |
| ${var=DEFAULT}  | 如果var没有被声明，那么就以$DEFAULT作为其值        |
| ${var:=DEFAULT  | 如果var没有被声明，或者其值为空，那么就以$DEFAULT作为其值 |
|                 |                                    |
| ${var+OTHER}    | 如果var声明了，那么其值就是$OTHER,否则就为null字符串  |
| ${var:+OTHER}   | 如果var被设置了，那么其值就是$OTHER，否则就为null字符串 |

#### 5.8 字符串操作汇总

| 表达式                             | 含义                                                          |
|---------------------------------|-------------------------------------------------------------|
| ${string:position               | 在$string中, 从位置$position开始提取子串                               |
| ${string:position:length        | 在$string中, 从位置$position开始提取长度为$length的子串                    |
|                                 |                                                             |
| ${string#substring              | 从变量$string的开头, 删除最短匹配$substring的子串                          |
| ${string##substring             | 从变量$string的开头, 删除最长匹配$substring的子串                          |
| ${string%substring              | 从变量$string的结尾, 删除最短匹配$substring的子串                          |
| ${string%%substring             | 从变量$string的结尾, 删除最长匹配$substring的子串                          |
|                                 |                                                             |
| ${string/substring/replacement  | 使用$replacement, 来代替第一个匹配的$substring                         |
| ${string//substring/replacement | 使用$replacement, 代替所有匹配的$substring                           |
| ${string/#substring/replacement | 如果$string的前缀匹配$substring, 那么就用$replacement来代替匹配到的$substring |
| ${string/%substring/replacement | 如果$string的后缀匹配$substring, 那么就用$replacement来代替匹配到的$substring |

### 6.shell数组

bash支持一维数组不支持多维数组，没有限定数组的大小
数组下标从0开始编号，下便可以是整数或算数表达式，其值应该大于或等于0。

#### 6.1 定义数组
在shell中用括号来表示数组，元素用空格符号隔开：
```sh
数组名=(值1 值2 值3 ... 值n)
```
eg：
```sh
array_name=(
  value0
  value1
  value2
  value3
)
```
还可以单独定义数组的各个分量：
```sh
array_name[0]=value0
array_name[1]=value1
array_name[100]=value100
```
可以不使用连续的下标，而且下标的范围没有限制。

#### 6.2 数组的操作

* 读取数组

读取数组的语法：
```sh
$(array_name[index])
```
使用@符号可以获取数组中所有元素：
```sh
echo $(array_name[@])
```
* 获取数组的长度

获取数组的长度的方法与获取字符串长度的方法相同。
```sh
# 获取数组元素的个数
length=$(#array_name[@])
# 或者
length=$(#array_name[*])
# 获取数组单个元素的长度
lengthn=$(#array_name[n])
```

### 7 注释

shell中只有单行注释， 在每一行的开头加入#即可

多行代码可以用花括号括起来定义成一个函数，不调用它这块代码不会执行，和多行注释的效果一样

