---
title: git url格式和修改git端口正确姿势
category: git
tags:
  - git url formates
  - git
date: 2020-03-30 19:29:47
description: 'git url格式，修改git ssh端口正确姿势.  git url formats'
---

前几天对云服务器安全优化时关闭了默认端口22改成其他端口，然后在向该主机上的git服务器提交代码时报错了，经排查发现是该主机的ssh服务不再使用默认的22端口，但是git服务还是沿用之前的端口22。

<!-- more -->

我尝试着在remote url路径上加上端口改成`git@host:port/path`格式，但是报错依旧。
```
ssh: connect to host gitlab.mhynet.cn port 22: Connection refused
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```
当时想过把端口改回22，但是强迫症的我想了想还是决定再试试。网上搜了相关的问题，都是让配置`~/.ssh/config`端口的，于是就在segmengfault上提了一个问题[git ssh的端口怎么改](https://segmentfault.com/q/1010000022185111?_ea=36062928)，有位热心朋友提示还是得改remote url，但是我的改动不对，一定有什么是我不知道的。 于是，我找到了git官方文档，一切谜题都迎刃而解。

git url有很多种格式，但是大部分人只知道最常用的两种，分别为:

- ` user@host.xz:path/to/repo.git `
- ` http[s]://host.xz[:port]/path/to/repo.git/ `

上面提到的两种格式中第二种使用`http`或`https`协议传输，常见于分享的github仓库地址，不需要身份验证；第二种是常用的ssh链接，需要有仓库的权限，其实这种格式是一种标准格式的简写。

## git url标准格式
官方文档中列出的标准的格式一共有以下四种：
- `ssh://[user@]host.xz[:port]/path/to/repo.git/`
- `git://host.xz[:port]/path/to/repo.git/`
- `http[s]://host.xz[:port]/path/to/repo.git/`
- `ftp[s]://host.xz[:port]/path/to/repo.git/`

我们最常用的类似于scp语法的格式`[user@]host.xz/path/to/repo.git/`其实是第一种格式的简写，省略了`ssh`协议。
但是如果要使用ssh传输且不是默认端口，则必须在url中加上ssh协议和端口，经测试只加端口不加协议的简写是无法成功推送到远程服务器的。

所以，非默认端口的git url的正确格式应该是`ssh://user@host.xz:port/path/to/repo.git`，其中的ssh协议、user和端口不要省略。

其他三种格式中，`git`协议缺乏授权机制，只有特殊情况下才会用到。

`http[s]`协议需要启动`http[s]`服务，简单来说就是把git仓库所在目录通过http服务器共享出来，但是要实现版本管理，还需要一些配置，服务端需要运行`git update-server-info`命令去产生和更新两个版本管理的重要文件
`.git/info/refs`和`.git/objects/info/packs`。 使用http协议搭建git服务器可以参考[这篇文章](https://www.worldhello.net/gotgit/05-git-server/010-http.html)。

`ftp[s]`协议由于效率低下，git文档中不建议使用，"可以使用ftp和ftps进行获取，但这效率低下且不建议使用"。

除了以上四种协议之外，还有一个本地协议，适用于远程仓库是硬盘内的另一个目录的场景，url可以直接是文件路径或者使用`file://`开头的路径，安全性不好，不建议使用。

## 参考文献
[GIT URLS文档](https://git-scm.com/docs/git-clone#_git_urls_a_id_urls_a)
[git: 四种git协议](https://cloud.tencent.com/developer/article/1347791)
