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

启动本地服务器查看博客
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
```
menu:
  home: /
  about: /about
  ......
```
然后找到lanhuages目录，编辑zh-Hans.yml文件：
```
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
基本信息
　　在根目录下的_config.yml文件中，可以修改标题，作者等信息。打开编辑该文件，注意：每一个值的冒号后面都有一个半角空格！

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
查阅了一些评论相关的介绍，最后选用的[来必力](https://livere.com/)。
[配置方式](http://www.hl10502.com/2017/03/24/hexo-config-livere/)参考自这里。
评论系统的配置在主题的配置文件_config.yml中，修改livere_uid的配置值为[来必力](http://www.hl10502.com/2017/03/24/hexo-config-livere/livere-get-code.png)获取到的data-uid。
```yml
# Support for LiveRe comments system.
# You can get your uid from https://livere.com/insight/myCode (General web site)
livere_uid: your uid
```
### 总结： 
在默认分支hexo上， 博客静态文件使用hexo g -d发布到master分支，源文件push 到hexo 分支， master分支上的文件是hexo 分支自动生成的，不用手动编辑



### [hexo 命令](https://hexo.io/zh-cn/docs/commands.html)

**命令简写**
- hexo n "我的博客" == hexo new "我的博客" #新建文章
- hexo g == hexo generate #生成
- hexo s == hexo server #启动服务预览
- hexo d == hexo deploy #部署
- hexo server #Hexo会监视文件变动并自动更新，无须重启服务器
- hexo server -s #静态模式
- hexo server -p 5000 #更改端口
- hexo server -i 192.168.1.1 #自定义 IP
- hexo clean #清除缓存，若是网页正常情况下可以忽略这条命令
