---
title: mongodb学习笔记
date: 2018-07-04 10:36:21
category: 数据库
tags: [mongodb, 数据库]
---

- 创建数据库
如果存在则切换，不存在则创建
```
use DATABASE_NAME
```
- 显示所有数据库
```
show dbs
```
发现刚刚创建的数据库没有有显示出来，可以插入数据
```
db.runoob.insert({"name":"菜鸟教程"})
```
然后执行`show dbs`发现刚刚创建的数据库显示出来了

- 删除数据库
以下命令删除的是当前的数据库，如果要删除非当前数据库需要先使用`use DATABASE_NAME`命令切换过去，然后执行以下命令
```
db.dropDatabase()
```
- 创建集合
```
db.createCollection(name, optipon)
```
name: 集合名称
options： 可选参数对象，有以下选项
	capped: 布尔 (可选)， 如果为true则创建固定集合，是指有固定大小的集合，当达到最大值时会自动覆盖最早的数据， 当该值为true时，必须指定size参数
	autoIndexId: 布尔 （可选）如果为true，则自动在_id字段创建索引，默认为false
	size: 数值 （可选） 固定集合指定一个最大值， 单位是字节
	max: 数值 （可选） 固定集合中包含的文档的最大数量

- 查看集合
查看当前数据库的已有集合
```
show collections
```
eg:
```
db.createCollection("my_test_coll1", { capped: true, autoIndexId: true, size: 6142800, max : 10000 })
```
在mongodb中也可以通过直接插入数据创建集合
```
db.my_test_coll2.insert({"name": "mhyuan", "age": 22})
```
- 删除集合
```
db.COLLECTION_NAME.drop()
```
如果删除成功返回true，否则返回false

- 插入文档
BSON是一种类json的一种二进制形式的存储格式,简称Binary JSON。mongodb中所有存储在集合中的数据都是BSON结构。
```
db.COLLECTION_NAME.insert(document)
```
eg:
```
db.col.insert({title: 'MongoDB 教程',
    description: 'MongoDB 是一个 Nosql 数据库',
    by: 'mhy',
    url: 'http://www.mhynet.cn',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
})
```
可以将数据定义成一个变量，然后插入
```
document=({title: 'MongoDB 教程',
    description: 'MongoDB 是一个 Nosql 数据库',
    by: 'mhy',
    url: 'http://www.mhynet.cn',
    tags: ['mongodb', 'database', 'NoSQL'],
    likes: 100
});
```
然后
```
db.col2.insert(document)
```
也可以执行
```
db.col.save(document)
```
如果不知道_id字段则效果和insert一样，如果指定了_id，则会更新该_id的数据

- 更新文档
mongodb使用updata()和save()方法更新数据
update()方法用于更新已存在的文档
```
db.collection.update(
	<query>,
	<update>,
	{
		upsert: <boolean>,
		multi: <boolean>,
		writeConcern: <document>
	}
)
```
参数说明：
query: update的查询条件，类似于SQL update 的where后面的
update: update的对象和一些更新的操作符（如$,$inc...），也可以理解为SQL update 查询内set后面的
upsert: 可选， 如果不存在update的记录，是否插入数据， true为插入， 默认为false
multi: 可选， mongodb默认为false，只更新找到的第一条记录，如果这个参数为true，就把按条件查出来的多条记录全部更新
writeConcern: 可选，抛出异常的级别


save()方法
save方法通过传入的文档来替换已有文档
```
db.collection.save(
	<document>,
	{
		writeConcern: <document>
	}
)
```
参数说明：
document: 文档数据
writeConcern: 可选， 抛出异常的级别

