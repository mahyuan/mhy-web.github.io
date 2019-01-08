# 我的博客

### 博客地址：
 http://mhynet.cn


### 操作命令：
生成静态文件
```
hexo g
```

发布到github
```
hexo d
```

启动本地服务器查看博客
```
hexo server
```

添加新博客
```
hexo new “我的第一篇文章”，会在source->_posts文件夹内生成一个.md文件。
```

编辑该文件（遵循Markdown规则）
修改起始字段
- title 文章的标题
- date 创建日期 （文件的创建日期 ）
- updated 修改日期 （ 文件的修改日期）
- comments 是否开启评论 true
- tags 标签
- categories 分类
- permalink url中的名字（文件名）
- 编写正文内容（MakeDown）
- hexo clean 删除本地静态文件（Public目录），可不执行。
- hexo g 生成本地静态文件（Public目录）
- hexo deploy 将本地静态文件推送至github（hexo d）

### 添加菜单
进入theme目录，编辑_config_yml文件，找到menu:字段，在该字段下添加一个字段。
```yml
menu:
  home: /
  about: /about
  ......
```
然后找到lanhuages目录，编辑zh-Hans.yml文件：
```yml
menu:
  home: 首页
  about: 关于作者
  ......
```
更新页面显示的中文字符，最后进入theme目录下的Source目录，新增一个about目录，里面写一个index.html文件。

### 文章内插入图片
在文章中写入:
```
![](/upload_image/1.jpg)
```
　　然后进入themes-主题名-source-upload_image目录下(自己创建)，将图片放到这个目录下，就可以了。

说明：当执行hexo g命令时，会自动把图片复制到 public文件的upload_image目录下。

### 个性化设置
基本信息在根目录下的_config.yml文件中，可以修改标题，作者等信息。打开编辑该文件，注意：每一个值的冒号后面都有一个半角空格！

未生效的写法：title:nMask的博客
能生效的写法：title:[空格]nMask的博客


### 主题
访问[主题列表](https://www.zhihu.com/question/24422335)，获取主题代码。

进入themes目录，进入以下操作：

下载主题 (以next主题为例)
```
git clone https://github.com/iissnan/hexo-theme-next.git（主题的地址）
```
打开__config.yml文件，将themes修改为next（下载到的主题文件夹的名字）
```
hexo g
hexo d
```
关于hexo-next主题下的一些个性化配置，参考：[Next主题配置](http://theme-next.iissnan.com/)

### 主题美化
文章中添加居中模块
文章Markdown中填写如下：

```
<blockquote class="blockquote-center">优秀的人，不是不合群，而是他们合群的人里面没有你</blockquote>
```
### 阅读量统计
阅读量使用的是不蒜子，配置在主题里面，配置方法见主题介绍文件。需要注意的是自2018年10月份起，不蒜子使用的七牛云域名变更了，在这之前部署的博客需要更新该域名，截止今天（2019/1/8）该主题还没有更新，所以使用该主题的需要手动更新该文件里面的域名。
需要改动的文件位置在`themes/BlueLake/layout/_partial/after_footer.jade`，需要改动的是`theme.busuanzi`代码块的src，具体参考官网介绍：
> 因七牛强制过期『dn-lbstatics.qbox.me』域名，与客服沟通无果，只能更换域名到『busuanzi.ibruce.info』！
改完之后文件
```jade
if theme.busuanzi == true
  script(src='http://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', async)

//- ...
```
我把改完后的该文件存放在了`source/_data/after_footer.jade`文件内，在执行一键部署的shell文件中做了同步处理`config_sync.sh`。

除了不蒜子，还可以使用[LeanCloud](https://leancloud.cn/dashboard/applist.html#/apps)进行阅读量统计，
配置可以参考[Hexo的NexT主题个性化：添加文章阅读量](http://www.jeyzhang.com/hexo-next-add-post-views.html)和[基于 LeanCloud 平台 为 Hexo 博客添加文章阅读量](http://bluesh.me/blog/2017/06/21/add-post-views/)这两篇文章。
需要在项目的配置文件中引入ID和key，然后需要在模板文件中引入一段js代码。
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
    github: git@github.com:mhy-web/mhy-web.github.io.git # github
    gitee: git@gitee.com:mhy-web/mhy-web.git # 码云
  name: mhyuan
  email: dsz9258@163.com
  branch: master
```
推送hexo分支的源文件需要使用git本身的功能，配置多个remote地址，这里参考了[廖雪峰老师的博客](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00150154460073692d151e784de4d718c67ce836f72c7c4000),但是我的Github的远程库的名字还是使用的是origin，仅仅设置了Gitee的远程库名称。

### GitHub Pages自定义域名开启HTTPS
目前大部分网站都在https协议，GitHub Pages本身是走https协议的，但是如果是自定义域名，则需要使用其他方式来配置，google搜索会发现大部分教程都是使用Cloudflare免费的CDN服务。配置过程参考了[这篇文章](https://razeen.me/post/https-githubpages.html)。


### 新设备上`theme`同步问题
因为`theme`是子项目, 所有无法`push`到本项目的远程仓库下, 新建一个仓库单独存储主题项目也不失为一个解决办法，但是很繁琐。
`hexo 3.X`支持在`source`文件夹下创建`_data`文件夹, 可以存储数据。可以把主题配置文件`copy`到`_data`文件加下，如`next.yml`。这样, 在新设备上仅需要根据主题地址`git clone`下主题仓库, 然后把配置文件内容替换为`source/_data/`下对应的配置文件即可。
还有百度搜索、谷歌搜索的文件，之前会保存在`source/_data/`文件夹内，换了设备后复制到主题目录下的`source`文件夹内，这样每次`hexo g`的时候会自动生成。

注：配置忽略项
```yml
skip_render:
	- _test/*  # 两个 ** 表示该目录的所有下级目录, 但是两个**会报错，可能是主题里面的配置没有兼容
	- _data/*
```

### baidu搜索和Google搜索
相关配置教程可有在google搜索，有很多讲的很详细的文章。
google推送和baidu推送需要的两个文件备份在项目的`source/_data`文件夹（改文件夹内的文件不会编译，可当做仓库）下，新设备上复制到主题文件夹的`source`文件夹下(项目根目录的文件夹下会编译，主题目录的`source`下不会编译)。

### SEO优化
SEO优化参考了[这篇文章](https://juejin.im/post/590b451a0ce46300588c43a0), 简化了文件URL层级结构。


### 总结：
在默认分支hexo上， 博客静态文件使用hexo g -d发布到master分支，源文件push 到hexo 分支， master分支上的文件是hexo 分支自动生成的，不用手动编辑。

### [hexo 命令](https://hexo.io/zh-cn/docs/commands.html)
**常用命令**
- hexo n "我的博客" == hexo new "我的博客" #新建文章
- hexo g == hexo generate #生成
- hexo s == hexo server #启动服务预览
- hexo d == hexo deploy #部署
- hexo server #Hexo会监视文件变动并自动更新，无须重启服务器
- hexo server -s #静态模式
- hexo server -p 5000 #更改端口
- hexo server -debug   # 启动debug模式服务器
- hexo server -i 192.168.1.1 #自定义 IP
- hexo clean #清除缓存，若是网页正常情况下可以忽略这条命令
