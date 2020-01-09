---
title: mongodb学习笔记
date: 2018-07-04 10:36:21
category: 数据库
tags: [mongodb, 数据库]
---

### 启动服务
在mac下启动mongod服务时，如果读取默认配置文件的话直接执行`mongod`就行了，如果要添加其他配置可以添加对应的配置项，但是最合理的应该是读取配置文件且后台运行服务。
使用 -f 或 --config 选项指定配置文件
```bash
mongod -f  /etc/mongod.conf &
# 或
mongod --config  /etc/mongod.conf &
```

### 创建数据库
如果存在则切换，不存在则创建
```
use DATABASE_NAME
```
<!-- more -->
### 显示所有数据库
```
show dbs
```
发现刚刚创建的数据库没有有显示出来，可以插入数据
```
db.runoob.insert({"name":"菜鸟教程"})
```
然后执行`show dbs`发现刚刚创建的数据库显示出来了

### 删除数据库
以下命令删除的是当前的数据库，如果要删除非当前数据库需要先使用`use DATABASE_NAME`命令切换过去，然后执行以下命令
```
db.dropDatabase()
```
### 创建集合
```
db.createCollection(name, optipon)
```
- name: 集合名称
- options： 可选参数对象，有以下选项
	-	capped: 布尔 (可选)， 如果为true则创建固定集合，是指有固定大小的集合，当达到最大值时会自动覆盖最早的数据， 当该值为true时，必须指定size参数
	- autoIndexId: 布尔 （可选）如果为true，则自动在_id字段创建索引，默认为false
	-	size: 数值 （可选） 固定集合指定一个最大值， 单位是字节
	-	max: 数值 （可选） 固定集合中包含的文档的最大数量

### 查看集合
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
### 删除集合
```
db.COLLECTION_NAME.drop()
```
如果删除成功返回true，否则返回false

### 插入文档
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

- db.collection.insertOne(): 向指定集合中插入一条文档数据
```
db.collection.insertOne({"a": 3})
```
- db.collection.insertMany(): 向指定集合中插入多条文档数据
```
db.collection.insertMany([{"b": 3}, {'c': 4}])
```

### 更新文档
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
- 参数说明：
	- query: update的查询条件，类似于SQL update 的where后面的
	- update: update的对象和一些更新的操作符（如$,$inc...），也可以理解为SQL update 查询内set后面的
	- upsert: 可选， 如果不存在update的记录，是否插入数据， true为插入， 默认为false
	- multi: 可选， mongodb默认为false，只更新找到的第一条记录，如果这个参数为true，就把按条件查出来的多条记录全部更新
	- writeConcern: 可选，抛出异常的级别


- 只更新第一条记录：
```
db.col.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } );
```
- 全部更新：
```
db.col.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true );
```
- 只添加第一条：
```
db.col.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false );
```
- 全部添加进去:
```
db.col.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true );
```
- 全部更新：
```
db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );
```
- 只更新第一条记录：
```
db.col.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );
```

### save()方法
save方法通过传入的文档来替换已有文档
```
db.collection.save(
	<document>,
	{
		writeConcern: <document>
	}
)
```
- 参数说明：
	- document: 文档数据
	- writeConcern: 可选， 抛出异常的级别

### 删除文档
```
db.collection.remove(
   <query>,
   <justOne>
)
如果你的 Mong
```

如果你的 MongoDB 是 2.6 版本以后的，语法格式如下：
```
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)
```
- 参数说明
	- query : （可选）删除的文档的条件。
	- justOne : （可选）如果设为 true 或 1，则只删除一个文档，如果不设置该参数，或使用默认值 false，则删除所有匹配条件的文档。
	- writeConcern :（可选）抛出异常的级别。


> remove() 方法已经过时了，现在官方推荐使用 deleteOne() 和 deleteMany() 方法。

> 如删除集合下全部文档：
```
db.inventory.deleteMany({})

// 删除 status 等于 A 的全部文档：
db.inventory.deleteMany({ status : "A" })

// 删除 status 等于 D 的一个文档：
db.inventory.deleteOne( { status: "D" } )
```

remove() 方法 并不会真正释放空间。
需要继续执行 db.repairDatabase() 来回收磁盘空间

### 查询文档
```
db.collection.find(query, projection)
```
- 参数
	-	query ：可选，使用查询操作符指定查询条件
	- projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

如果你需要以易读的方式来读取数据，可以使用 pretty() 方法，语法格式如下：
```
db.col.find().pretty()
```
pretty() 方法以格式化的方式来显示所有文档。

除了 find() 方法之外，还有一个 findOne() 方法，它只返回一个文档。

| 操作 |	格式	| 范例	| RDBMS中的类似语句 |
| --- | -------| -----| ----------------|
| 等于 |{\<key>:\<value>} | db.col.find({"by":"菜鸟教程"}).pretty() | where by = '菜鸟教程' |
| 小于 | {\<key>:{$lt:\<value>}} | db.col.find({"likes":{$lt:50}}).pretty() | where likes < 50 |
| 小于或等于 | {\<key>:{$lte:\<value>}} | db.col.find({"likes":{$lte:50}}).pretty() | where likes <= 50 |
| 大于 | {\<key>:{$gt:\<value>}} | db.col.find({"likes":{$gt:50}}).pretty() | where likes > 50 |
| 大于或等于 | {\<key>:{$gte:\<value>}} | db.col.find({"likes":{$gte:50}}).pretty() | where likes >= 50 |
| 不等于 | {\<key>:{$ne:\<value>}} | db.col.find({"likes":{$ne:50}}).pretty() | where likes != 50 |


- MongoDB AND 条件

MongoDB 的 find() 方法可以传入多个键(key)，每个键(key)以逗号隔开，即常规 SQL 的 AND 条件。

语法格式如下：
```
db.col.find({key1:value1, key2:value2}).pretty()
```
eg:
```
db.col.find({"by":"菜鸟教程", "title":"MongoDB 教程"}).pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```
以上实例中类似于 WHERE 语句：WHERE by='菜鸟教程' AND title='MongoDB 教程'

- MongoDB OR 条件
MongoDB OR 条件语句使用了关键字 $or,语法格式如下：
```
db.col.find(
   {
      $or: [
         {key1: value1}, {key2:value2}
      ]
   }
).pretty()
```

- AND 和 OR 联合使用
类似常规 SQL 语句为：` 'where likes>50 AND (by = '菜鸟教程' OR title = 'MongoDB 教程')'`
```
db.col.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()
{
        "_id" : ObjectId("56063f17ade2f21f36b03133"),
        "title" : "MongoDB 教程",
        "description" : "MongoDB 是一个 Nosql 数据库",
        "by" : "菜鸟教程",
        "url" : "http://www.runoob.com",
        "tags" : [
                "mongodb",
                "database",
                "NoSQL"
        ],
        "likes" : 100
}
```

