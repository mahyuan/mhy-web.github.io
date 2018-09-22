# 这里记录更换设备后同步主题相关操作

```
./
├── BlueLake_theme_config_copy.yml
├── baidu_config_script.html
├── baidu_config_script.jade
├── baidu_verify_8Aiojs1MlP.html
├── baidu_verify_lbjgMfZjsA.html
├── googlea7d29b39b2cf201e.html
├── next.yml
└── note.md
```

由于主题仓库是使用第三方的git仓库，所以在新设备上配置博客时，需要重新git clone 主题仓库，然后进行相关的修改配置。

根目录下的`_data`目录在新版的hexo中是不会编译的，可以存放一些文件，百度和google认证文件都放在了该文件夹下，在新设备上需要把这些认证文件复制到主题目录的`source`目录下。
保证`hexo g`后的目录下有这些认证文件。

还有一段自动向百度推送的脚本，需要添加在相关文件内，所以特意摘录出来保存在了该文件夹下的`baidu_config_script`文件内（后缀分别为`.html`和`.jade`）。
baidu自动推送需要给**每个页面的body节点**加入这段推送代码，`BlueLake theme`是把这段代码加到了`themes/BlueLake/layout/_partial/after_footer.jade`中。

目前使用的主题是`BlueLake`，该主题的配置文件是`BlueLake_theme_config.yml`,在此备份，换设备后用该文件替换对应主题的配置文件（注意替换的时候不要修改主题配置文件的文件名）。

适配iphone X

meta属性viewport项新增一个字段`viewport-fit=cover`
```jade
meta(content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover', name='viewport')
```

百度统计和google分析的文件放在source目录下即可。

