---
title: pynongo使用笔记
category: 后端
tags:
  - python
  - mongodb
date: 2019-06-11 11:38:12
description: "使用pymongo操作数据库，python爬虫常用数据库操作语句"
---

前段时间学习了python爬虫，然后爬取了必应壁纸、拉钩、小红唇视频和评论等，其中也使用了mongodb数据库存储数据。

工作电脑和家里电脑都实现了壁纸每分钟实时更新，海量的背景图片，基本不重复，每天中午休息时喜欢盯着屏幕发呆，哈哈😁。其中除了用到的除了基本的爬虫至少，还有pymongo将爬取的数据存储到数据库，不会因为官方更新而丢失早期的图片信息，也用到了shell脚本和crontab定时任务，每周一中午定时爬取，然后下载图片，非常nice啊。
<!-- more -->
更多脚本可以去[github](https://github.com/mhy-web/python_demo)看到，自动执行的shell脚本为项目目录下的 `wallpaper.sh`文件。

这里记录一下pymongo使用笔记，避免下次使用时再去找文档。
```py
# 引入pymongo
import pymongo

# 创建连接
client = pymongo.Conection('127.0.0.1', 27017)
client = pymongo.Conection(host='127.0.0.1', port=27017)

# 连接数据库
db = client.bing
# 或
db = client['bing']
# 其中的`bing`是所创建的数据库的名称。
# 或
dbName = 'xhc'
db = client[dbName]

# 连接集合
collection = db.video
# 或
collection = db['video']

# 查看全部集合名称
db.collection_names()

# 查找集合的记录
db.bing.find()
for doc in db.test.find():
  print(doc)
db.bing.find_one({x: 1})
db.bing.find_mangy({})

db.bing.count_document({x: 1})

# 插入数据
db.bing.insert_one({x: 1})
db.bing.insert_many([{'x': i} for i in range(2)])

# 替换
db.bing.replace_one({x: 1}, {y: 1})

# 更新
# update 后面的操作符同 mongodb 原生的操作符
db.bing.update_one({x: 1}, {'$inc': {x: 3}})
db.bing.find_one_and_update({'_id': 665}, {'$inc': {'count': 1}, '$set': {'done': True}})
db.bing.find_one_and_update({'_exists': False}, {'$inc': {'count': 1}})
db.bing.find_one_and_update(
  { '_id': 'userid' },
  { '$inc': {'seq': 1}},
  projection={'seq': True, '_id': False},
  upsert=True,
  return_document=ReturnDocument.AFTER
)

# 删除
db.bing.delete_one({x: 1})
db.bing.delete_many({'x': 1})
db.bing.find_one_and_delete({'x': 1})
db.bing.find_one_and_delete({'x': 1}, sort=[('_id', pymongo.DESCENDING)])

# 新建索引
db.bing.create_index("mike")
```
更多内容可以参考官方文档。
参考文档： http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.delete_one

