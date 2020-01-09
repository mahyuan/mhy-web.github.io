---
title: 使用hexo+github搭建免费个人博客 #文章页面上的显示名称，一般是中文
date: 2017-12-24 #文章生成时间，一般不改，当然也可以任意修改
categories: 博客 #分类
tags: [hexo, github] #文章标签，可空，多标签请用格式，注意:后面有个空格
---

## 前言
（本文是刚开始学习hexo搭建博客的时候参考了很多博客记录的，比较初级，后来因多次在不同设备上搭建环境，总结了一些个人认为比较有用的知识点，尤其是多设备下搭建方面，记录在该项目的[README](https://github.com/mhy-web/mhy-web.github.io/blob/hexo/README.md)下，欢迎查阅）。

最开始搭建部分参考了[这篇文章](http://blog.liuxianan.com/build-blog-website-by-hexo-github.html)，后面又新增了评论、页面访问量、https服务、主题配置、多终端配置、百度和谷歌搜索、SEO优化等部分，搜集了很多资料，可能某些部分不是很详细但是比较全面。

<!-- more -->

使用github pages服务搭建博客的好处有：
>- 全是静态文件，访问速度快；
>- 免费方便，不用花一分钱就可以搭建一个自由的个人博客，不需要服务器不需要后台；
>- 可以随意绑定自己的域名，不仔细看的话根本看不出来你的网站是基于github的；
>- 数据绝对安全，基于github的版本管理，想恢复到哪个历史版本都行；
>- 博客内容可以轻松打包、转移、发布到其它平台；
>- 等等；

### 准备工作

在开始一切之前，你必须已经：

- 有一个github账号，没有的话去注册一个；
- 安装了node.js、npm，并了解相关基础知识；
- 安装了git和命令行工具

## 搭建github博客

### 创建仓库

新建一个名为`你的用户名.github.io`的仓库，比如说，如果你的github用户名是test，那么你就新建`test.github.io`的仓库（必须是你的用户名，其它名称无效），将来你的网站访问地址就是 - http://test.github.io 了，是不是很方便？

由此可见，每一个github账户最多只能创建一个这样可以直接使用域名访问的仓库。

几个注意的地方：

>- 注册的邮箱一定要验证，否则不会成功；
>- 仓库名字必须是：username.github.io，其中username是你的用户名；
>- 仓库创建成功不会立即生效，需要过一段时间，大概10-30分钟，或者更久，我的等了半个小时才生效；
>- 创建成功后，默认会在你这个仓库里生成一些示例页面，以后你的网站所有代码都是放在这个仓库里啦。

### 绑定域名

当然，你不绑定域名肯定也是可以的，就用默认的 `xxx.github.io `来访问，如果你想更个性一点，想拥有一个属于自己的域名，那也是OK的。

首先你要注册一个域名，域名注册以前总是推荐去godaddy，现在觉得其实国内的阿里云也挺不错的，价格也不贵，毕竟是大公司，放心！

绑定域名分2种情况：带www和不带www的。

域名配置最常见有2种方式，CNAME和A记录，CNAME填写域名，A记录填写IP，由于不带www方式只能采用A记录，所以必须先ping一下你的用户名.github.io的IP，然后到你的域名DNS设置页，将A记录指向你ping出来的IP，将CNAME指向你的用户名.github.io，这样可以保证无论是否添加www都可以访问，如下：
>-
![1](http://image.liuxianan.com/201608/20160823_191336_238_8683.png)

然后到你的github项目根目录新建一个名为CNAME的文件（无后缀），里面填写你的域名，加不加www看你自己喜好，因为经测试：

>- 如果你填写的是没有www的，比如 mygit.me，那么无论是访问 http://www.mygit.me 还是 http://mygit.me ，都会自动跳转到 http://>- mygit.me
>- 如果你填写的是带www的，比如 www.mygit.me ，那么无论是访问 http://www.mygit.me 还是 http://mygit.me ，都会自动跳转到 http://>- www.mygit.me
>- 如果你填写的是其它子域名，比如 abc.mygit.me，那么访问 http://abc.mygit.me 没问题，但是访问 http://mygit.me ，不会自动跳转到 >- http://abc.mygit.me
>- 另外说一句，在你绑定了新域名之后，原来的你的用户名.github.io并没有失效，而是会自动跳转到你的新域名。

## 配置SSH key

为什么要配置这个呢？因为你提交代码肯定要拥有你的github权限才可以，但是直接使用用户名和密码太不安全了，所以我们使用ssh key来解决本地和服务器的连接问题。
```
$ cd ~/. ssh #检查本机已存在的ssh密钥
```
如果提示：No such file or directory 说明你是第一次使用git。
```
ssh-keygen -t rsa -C "邮件地址"
```
然后连续3次回车，最终会生成一个文件在用户目录下，打开用户目录，找到`.ssh\id_rsa.pub`文件，记事本打开并复制里面的内容，打开你的github主页，进入个人设置 -> SSH and GPG keys -> New SSH key：

![](http://image.liuxianan.com/201608/20160818_143914_495_9084.png)

将刚复制的内容粘贴到key那里，title随便填，保存。

### 测试是否成功
```
$ ssh -T git@github.com # 注意邮箱地址不用改
```
如果提示`Are you sure you want to continue connecting (yes/no)?`，输入yes，然后会看到：

> `Hi liuxianan! You've successfully authenticated, but GitHub does not provide shell access.`

看到这个信息说明SSH已配置成功！

此时你还需要配置：
```
$ git config --global user.name "liuxianan"// 你的github用户名，非昵称
$ git config --global user.email  "xxx@qq.com"// 填写你的github注册邮箱
```
具体这个配置是干嘛的我没仔细深究。

## 使用hexo写博客

### hexo简介

Hexo是一个简单、快速、强大的基于 Github Pages 的博客发布工具，支持Markdown格式，有众多优秀插件和主题。

官网： http://hexo.io
github: https://github.com/hexojs/hexo

### 原理

由于github pages存放的都是静态文件，博客存放的不只是文章内容，还有文章列表、分类、标签、翻页等动态内容，假如每次写完一篇文章都要手动更新博文目录和相关链接信息，相信谁都会疯掉，所以hexo所做的就是将这些md文件都放在本地，每次写完文章后调用写好的命令来批量完成相关页面的生成，然后再将有改动的页面提交到github。

### 注意事项

安装之前先来说几个注意事项：

>- 很多命令既可以用Windows的cmd来完成，也可以使用git bash来完成，但是部分命令会有一些问题，为避免不必要的问题，建议全部使用git >- bash来执行；
>- hexo不同版本差别比较大，网上很多文章的配置信息都是基于2.x的，所以注意不要被误导；
>- hexo有2种_config.yml文件，一个是根目录下的全局的_config.yml，一个是各个theme下的；

### 安装
```
$ npm install -g hexo
```
### 初始化

在电脑的某个地方新建一个名为hexo的文件夹（名字可以随便取），比如我的是`F:\Workspaces\hexo`，由于这个文件夹将来就作为你存放代码的地方，所以最好不要随便放。
```
$ cd /f/Workspaces/hexo/
$ hexo init
```
hexo会自动下载一些文件到这个目录，包括node_modules，目录结构如下图：

![](http://image.liuxianan.com/201608/20160818_115922_773_1148.png)

```
$ hexo g # 生成
$ hexo s # 启动服务
```
执行以上命令之后，hexo就会在public文件夹生成相关html文件，这些文件将来都是要提交到github去的：

![](http://image.liuxianan.com/201608/20160818_120700_028_2426.png)

`hexo s`是开启本地预览服务，打开浏览器访问 http://localhost:4000 即可看到内容，很多人会碰到浏览器一直在转圈但是就是加载不出来的问题，一般情况下是因为端口占用的缘故，因为4000这个端口太常见了，解决端口冲突问题请参考这篇文章：
http://blog.liuxianan.com/windows-port-bind.html

第一次初始化的时候hexo已经帮我们写了一篇名为 Hello World 的文章，默认的主题比较丑，打开时就是这个样子：

![](https://upload-images.jianshu.io/upload_images/2858691-0370eac715c74d5e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)

### 修改主题

既然默认主题很丑，那我们别的不做，首先来替换一个好看点的主题。这是 官方主题。

个人比较喜欢的2个主题：hexo-theme-jekyll 和 hexo-theme-yilia。

首先下载这个主题：
```
$ cd /f/Workspaces/hexo/
$ git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
```
下载后的主题都在这里：

![](http://image.liuxianan.com/201608/20160818_134500_245_0912.png)

修改_config.yml中的theme: landscape改为theme: yilia，然后重新执行hexo g来重新生成。

如果出现一些莫名其妙的问题，可以先执行hexo clean来清理一下public的内容，然后再来重新生成和发布。

### 上传之前

在上传代码到github之前，一定要记得先把你以前所有代码下载下来（虽然github有版本管理，但备份一下总是好的），因为从hexo提交代码时会把你以前的所有代码都删掉。

### 上传到github

如果你一切都配置好了，发布上传很容易，一句hexo d就搞定，当然关键还是你要把所有东西配置好。

首先，ssh key肯定要配置好。

其次，配置_config.yml中有关deploy的部分：

正确写法：
```yml
deploy:
  type: git
  repository: git@github.com:liuxianan/liuxianan.github.io.git
  branch: master
  ```
错误写法：
```yml
deploy:
  type: github
  repository: https://github.com/liuxianan/liuxianan.github.io.git
  branch: master
  ```
后面一种写法是hexo2.x的写法，现在已经不行了，无论是哪种写法，此时直接执行hexo d的话一般会报如下错误：
```yml
Deployer not found: github 或者 Deployer not found: git
```
原因是还需要安装一个插件：
```yml
npm install hexo-deployer-git --save
```
其它命令不确定，部署这个命令一定要用git bash，否则会提示Permission denied (publickey).

打开你的git bash，输入hexo d就会将本次有改动的代码全部提交，没有改动的不会：

![](http://image.liuxianan.com/201608/20160818_140441_769_5024.png)

### 保留CNAME、README.md等文件

提交之后网页上一看，发现以前其它代码都没了，此时不要慌，一些非md文件可以把他们放到source文件夹下，这里的所有文件都会原样复制（除了md文件）到public目录的：

![](http://image.liuxianan.com/201608/20160818_141037_580_8035.png)

由于hexo默认会把所有md文件都转换成html，包括README.md，所有需要每次生成之后、上传之前，手动将README.md复制到public目录，并删除README.html。

### 常用hexo命令

常见命令
```
hexo new "postName" #新建文章
hexo new page "pageName" #新建页面
hexo generate #生成静态页面至public目录
hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
hexo deploy #部署到GitHub
hexo help  # 查看帮助
hexo version  #查看Hexo的版本
```
缩写：
```
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```
组合命令：
```
hexo s -g #生成并本地预览
hexo d -g #生成并上传
```
###  _config.yml

这里面都是一些全局配置，每个参数的意思都比较简单明了，所以就不作详细介绍了。

需要特别注意的地方是，冒号后面必须有一个空格，否则可能会出问题。

### 写博客

定位到我们的hexo根目录，执行命令：
```
hexo new 'my-first-blog'
```
hexo会帮我们在_posts下生成相关md文件
我们只需要打开这个文件就可以开始写博客了，默认生成如下内容：

![](http://image.liuxianan.com/201608/20160823_183325_470_9306.png)

当然你也可以直接自己新建md文件，用这个命令的好处是帮我们自动生成了时间。

一般完整格式如下：
```yml
---
title: postName #文章页面上的显示名称，一般是中文
date: 2013-12-02 15:30:16 #文章生成时间，一般不改，当然也可以任意修改
categories: 默认分类 #分类
tags: [tag1,tag2,tag3] #文章标签，可空，多标签请用格式，注意:后面有个空格
description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
---

以下是正文
```
那么`hexo new page 'postName'`命令和`hexo new 'postName'`有什么区别呢？
```
hexo new page "my-second-blog"
```
生成如下：

![](http://image.liuxianan.com/201608/20160823_184852_854_6502.png)

最终部署时生成：hexo\public\my-second-blog\index.html，但是它不会作为文章出现在博文目录。

### 如何让博文列表不显示全部内容

默认情况下，生成的博文目录会显示全部的文章内容，如何设置文章摘要的长度呢？

答案是在合适的位置加上<!--more-->即可，例如：

![](http://image.liuxianan.com/201608/20160823_184633_653_1893.png)

## 最终效果：

可以访问我的git博客来查看效果： http://mhynet.cn

不过呢，其实这个博客我只是拿来玩一玩的，没打算真的把它当博客，因为我已经有一个自己的博客了，哈哈！正因如此，本文仅限入门学习，关于hexo搭建个人博客的更高级玩法大家可以另找教程。

## 后期优化
### 阅读量统计
阅读量统计使用的是[LeanCloud](https://leancloud.cn/dashboard/applist.html#/apps),
配置可以参考[这篇教程](http://www.jeyzhang.com/hexo-next-add-post-views.html)。
```yml
# add post views
leancloud_visitors:
  enable: true
  app_id:  #你的app_id
  app_key:  ##你的app_key
```
### 评论系统
查阅了一些评论相关的介绍, 最后选用的[来必力](https://livere.com/)。
[配置方式](http://www.hl10502.com/2017/03/24/hexo-config-livere/)参考自这里。
评论系统的配置在主题的配置文件_config.yml中，修改livere_uid的配置值为[来必力](http://www.hl10502.com/2017/03/24/hexo-config-livere/livere-get-code.png)获取到的data-uid。
```yml
# Support for LiveRe comments system.
# You can get your uid from https://livere.com/insight/myCode (General web site)
livere_uid: your uid
```
### 部署到github 和 gitee
最开始做的时候只是部署到github, 并且将自己的域名[mhynet.cn](https://mhynet.cn)解析到GitHub上，这样可以通过自己的域名访问博客。后来因为国内访问Github慢的原因将博客备份到了Gitee,但是还有个问题，Gitee并不支持域名解析，所以无法配成成通过自己的域名来访问Gitee。这个问题还在探索中。
这里要记录的是配置推送到Gitee和Github的方法。
博客发布`hexo d`同时推送的配置是在根目录:
```yml
deploy:
  type: git
  repository:
    github:  # github
    gitee:  # 码云
  name: mhyuan
  email: dsz9258@163.com
  branch: master
```
推送hexo分支的源文件需要使用git本身的功能，配置多个remote地址，这里参考了[廖雪峰老师的博客](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00150154460073692d151e784de4d718c67ce836f72c7c4000),但是我的Github的远程库的名字还是使用的是origin，仅仅设置了Gitee的远程库名称。

### GitHub Pages自定义域名开启HTTPS
目前大部分网站都在https协议，GitHub Pages本身是走https协议的，但是如果是自定义域名，则需要使用其他方式来配置，google搜索会发现大部分教程都是使用Cloudflare免费的CDN服务。配置过程参考了[这篇文章](https://razeen.me/post/https-githubpages.html)。

这里有一个问题后期需要优化一下，站内的图片有有一些是直接在网上复制的链接，可能不支持https，显示会出现问题。所以后期还有一项可以优化，使用自己的图床，现在比较主流的是七牛云，这样可以保证图片正常显示。

### 新设备上`theme`同步问题
因为`theme`是子项目, 所有无法`push`到本项目的远程仓库下, 新建一个仓库单独存储主题项目也不失为一个解决办法，但是很繁琐。
`hexo 3.X`支持在`source`文件夹下创建`_data`文件夹, 可以存储数据。可以把主题配置文件`copy`到`_data`文件加下，如`next.yml`。这样, 在新设备上仅需要根据主题地址`git clone`下主题仓库, 然后把配置文件内容替换为`source/_data/`下对应的配置文件即可。
还有百度搜索、谷歌搜索的文件，之前会保存在`source/_data/`文件夹内，换了设备后复制到主题目录下的`source`文件夹内，这样每次`hexo g`的时候会自动生成。

多次在新设备上部署hexo博客后发现最重复和麻烦的是主题的配置，每次从github仓库拉下来博客项目后还要去找主题仓库。拉下来主题仓库，然后还需要改主题仓库的配置文件，谷歌和百度搜索配置等等，需要改很多东西，非常麻烦，后来学了点bash脚本[config_sync](https://github.com/mhy-web/mhy-web.github.io/blob/hexo/config_sync.sh)，写了个文件，每次拉取项目后执行该文件即可自动部署完成，非常快速的完成配置。

注：配置忽略项
```yml
skip_render:
	- _test/*  # 两个 ** 表示该目录的所有下级目录, 但是两个**会报错，可能是主题里面的配置没有兼容
	- _data/*
```

### baidu搜索和Google搜索
相关配置教程可有在google搜索，有很多讲的很详细的文章。
google推送和baidu推送需要的两个文件备份在项目的`source/_data`文件夹下(该文件夹内的文件不会编译，可当做仓库)，新设备上复制到主题文件夹的`source`文件夹下(项目根目录的文件夹下会编译，主题目录的`source`下不会编译)。

### SEO优化
SEO优化参考了[这篇文章](https://juejin.im/post/590b451a0ce46300588c43a0), 简化了文件URL层级结构。


## 参考

http://www.cnblogs.com/zhcncn/p/4097881.html
http://www.jianshu.com/p/05289a4bc8b2
http://www.cnblogs.com/liuxianan/p/build-blog-website-by-hexo-github.html

