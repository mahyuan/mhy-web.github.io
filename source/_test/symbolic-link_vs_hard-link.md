---
title: 软连接和硬链接
category: linux
tags:
  - linux
  - linux 命令
description: 'linux软链接和硬链接'
date: 2020-04-09 11:01:13
---

linux系统下有软链接和硬链接的区分，使用方法可以输入`ln`回车查看使用介绍
```sh
➜  ~ ln
usage: ln [-Ffhinsv] source_file [target_file]
       ln [-Ffhinsv] source_file ... target_dir
       link source_file target_file
```
从打印出来的信息可以看到，第一个参数是源文件，第二个参数是目标文件。linux系统下使用`ls`命令查看文件时添加`-il`选项参数，可以输出文件的`inode`(节点号)，软链接所指的文件与源文件的inode值

## 软链接
软链接也被称为符号链接（Symbolic Link），类似于windows下的快捷方式，软链接只是实际文件地址的引用，删除源文件之后，软链接打开的文件内容为空，因为源文件已经不存在。

## 硬链接
硬链接的作用是允许一个文件拥有多个有效路径名，只删除一个链接并不会删除实际的文件，只有最后一个地址删除之后文件才会被删除。硬链接不允许普通用户对目录使用，不能跨越文件系统。

使用软链接时建议使用绝对路径取代相对路径，目录嵌套较深时，使用相对路径时会有以下报错：
```
Too many levels of symbolic links
```

使用普通用户对目录使用硬链接时报错：
```
hard link not allowed for directory
```
可以使用 root 用户并且添加 -d 选项对目录添加硬链接，linux系统对目录限制硬链接的原因是避免多级嵌套的目录下陷入无限循环，因为linux系统下目录和文件都有自己的inodex结果，其中的inode结构中也包含了文件类型等信息。
