---
title: "[转载]mongodb常用查询语句"
date: 2019-1-4 11:36:21
category: 数据库
tags: [mongodb, 数据库]
---
记录一下MongoDB常用语句，顺带与SQL做个简单的对比。
<!-- more -->
1、查询(find)

（1）查询所有结果
```
select * from article
db.article.find()
```
（2）指定返回哪些键
```
select title, author from article
db.article.find({}, {"title": 1, "author": 1})
```

（3）where条件
```
select * from article where title = "mongodb"
db.article.find({"title": "mongodb"})
```
（4）and条件
```
select * from article where title = "mongodb" and author = "god"
db.article.find({"title": "mongodb", "author": "god"})
```
（5）or条件
```
select * from article where title = "mongodb" or author = "god"
db.article.find({"$or": [{"title": "mongodb"}, {"author": "god"}]})
```
（6）比较条件
```
select * from article where read >= 100;
db.article.find({"read": {"$gt": 100}})
```
$gt(>)、$gte(>=)、$lt(<)、$lte(<=)
```
select * from article where read >= 100 and read <= 200
db.article.find({"read": {"$gte": 100, "lte": 200}})
```
（7）in条件
```
select * from article where author in ("a", "b", "c")
db.article.find({"author": {"$in": ["a", "b", "c"]}})
```
（8）like
```
select * from article where title like "%mongodb%"
db.article.find({"title": /mongodb/})
```
（9）count
```
select count(*) from article
db.article.count()
```
（10）不等于
```
select * from article where author != "a"
db.article.find({ "author": { "$ne": "a" }})
```
（11）排序
升序：
```
select * from article where type = "mongodb" order by read desc
db.article.find({"type": "mongodb"}).sort({"read": -1})
```
降序：
```
select * from article where type = "mongodb" order by read asc
db.article.find({"type": "mongodb"}).sort({"read": 1})
```
findOne()：除了只返回一个查询结果外，使用方法与find()一样。
2、创建（insert）
```
insert into article(title, author, content) values("mongodb", "tg", "haha")
db.article.insert({"title": "mongodb", "author": "tg", "content": "haha"})
```

3、更新（update）

（1）update()

语法：
```
db.collecion.update(query, update[, options] )
```
query : 必选，查询条件，类似find中的查询条件。
update : 必选，update的对象和一些更新的操作符（如$,$inc...）等
options：可选，一些更新配置的对象。
upsert：可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
multi：可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。
writeConcern：可选，抛出异常的级别。

简单更新：
```
update article set title = "mongodb" where read > 100
db.article.update({"read": {"$gt": 100}}, {"$set": { "title": "mongodb"}})
```

（2）save()
```
db.article.save({_id: 123, title: "mongodb"})
```
执行上面的语句，如果集合中已经存在一个_id为123的文档，则更新对应字段;否则插入。

注：如果更新对象不存在_id，系统会自动生成并作为新的文档插入。

（3）更新操作符

MongoDB提供一些强大的更新操作符。

更新特定字段（$set）：
```
update game set count = 10000 where _id = 123
db.game.update({"_id": 123}, { "$set": {"count": 10000}})
```

删除特定字段（$unset）：
```
db.game.update({"_id":123}, {"$unset": {"author":1}})
```
注：$unset指定字段的值只需是任意合法值即可。

递增或递减（$inc）
```
db.game.update({"_id": 123}, { "$inc": {"count": 10}}) // 每次count都加10
```

注意：$inc对应的字段必须是数字，而且递增或递减的值也必须是数字。

数组追加（$push）：
```
db.game.update({"_id": 123}, { "$push": {"score": 123}})
```
还可以一次追加多个元素：
```
db.game.update({"_id": 123}, {"$push": {"score": [12,123]}})
```

注：追加字段必须是数组。如果数组字段不存在，则自动新增，然后追加。

一次追加多个元素（$pushAll）：
```
db.game.update({"_id": 123}, {"$pushAll": {"score": [12,123]}})
```

追加不重复元素（$addToSet）：
$addToSet类似集合Set，只有当这个值不在元素内时才增加：
```
db.game.update({"_id": 123}, {"$addToSet": {"score": 123}})
```

删除元素（$pop）：
```
db.game.update({"_id": 123}, {"$pop": {"score": 1}})  // 删除最后一个元素
db.game.update({"_id": 123}, {"$pop": {"score": -1}})  // 删除第一个元素
```

注：$pop每次只能删除数组中的一个元素，1表示删除最后一个，-1表示删除第一个。

删除特定元素（$pull）：
```
db.game.update({"_id": 123}, {"$pull": {"score": 123}})
```
上面的语句表示删除数组score内值等于123的元素。

删除多个特定元素（$pullAll）：
```
db.game.update({"_id": 123}, {"$pullAll": {score: [123,12]}})
```
上面的语句表示删除数组内值等于123或12的元素。

更新嵌套数组的值：

使用数组下标（从0开始）：
```
{
  address: [{place: "nanji", tel: 123}, {place: "dongbei", tel: 321}]
}
db.game.update({"_id": 123}, {"$set": {"address.0.tel": 213}})
```

如果你不知道要更新数组哪项，我们可以使用$操作符（ $表示自身，也就是按查询条件找出的数组里面的项自身，而且只会应用找到的第一条数组项）：
```
db.game.update({"address.place": "nanji"}, {"$set": {"address.$.tel": 123}})
```
在上面的语句中，$就是查询条件`{"address.place": "nanji"}`的查询结果，也就是`{place: "nanji", tel: 123}`，所以`{"address.$.tel": 123}`也就是`{"address.{place: "nanji", tel: 123}.tel": 123}`

4、删除（remove）
删除所有文档：
```
delete from article
db.article.remove()
```
删除指定文档：
```
delete from article where title = "mongodb"
db.article.remove({title: "mongodb"})
```

MongoDB特有的语句
1. 数组查询
（1）数组的普通查询
假如type是["mongodb", "javascript"]：
```
db.article.find({"type": "mongodb"})
```
上面的语句可以匹配成功。

（2）多个元素的查询
```
db.article.find({"type": {"$all": ["mongodb", "javascript"]}})
```
只有type数组同时存在mongodb和javascript才会匹配。

（3）限制数组长度查询
```
db.article.find({"type": {"$size": 2}})
```
只有数组的长度是2才会匹配

注：type必须是数组

（4）返回特定数量

当$slice的参数是一个时，表示返回的数量;当是一个数组时，第一个参数表示偏移量，第二个表示返回的数量：
```
db.article.find({"type": {"$slice": 1}}) // 返回第1个
db.article.find({"type": {"$slice": -1}})  // 返回最后一个
db.article.find({"type": {"$slice": [20, 10]}})  // 从第21个开始，返回10个，也就是21～30
```
注：$slice针对的是数组

（5）元素匹配

如果文档中有一个字段的值是数组，可以使用$elemMatch来匹配数组内的元素：
```
{
  kown: [{ a: 2, b: 4}, 10, { a: 4}, {b:10}]
}
db.article.find({"kown": { "$elemMatch": {a: 1, b: {"$gt": 2}}}})
```
只有a=1且b>2才会匹配。

2. 取模（$mod）
比如我们要匹配 read % 5 == 1：
```
db.article.find({"read": {$mod: [5, 1]}})
```
3. 是否存在（$exists)
如果我们要判断love字段是否存在，可以这样：
```
db.article.find({"love": {"$exists": true}})  // 如果存在字段love，就返回
```
我们也可以判断不存在：
```
db.article.find({"love": {"$exists": false}}) // 如果不存在字段love，就返回
```
4. 正则表达式

mongodb支持正则表达式，使用方法与正则字面量一样：
```
db.article.find({"title": /mongodb/i})  // i是忽略大小写
```
5. 类型查询
我们可以根据字段类型来返回数据：
```
db.article.find({"comments": {"$type": 4}})
```
只有当comments的类型是数组才匹配

注：更多类型的数值可以参考这里：mongodb $type

6. 内嵌文档
mongodb是允许内嵌文档的，而且要查询内嵌文档也很简单（使用点语法）：
```
{
  address: { name: "nanji" }
}
db.article.find({"address.name": "nanji"})
```
上面的语句是查询comments中的author。

数组也可以采取点语法:
```
{
  comments: [{title: "mongodb"}, {title: "javascript"}]
}
db.article.find({"comments.title": "mongodb"})
```
7. 取反
$not是元语句，即可以用在任何其他条件之上：
```
db.article.find({"author": {"$not": /mongodb/i}})
```
只要使用$not操作符，就表示取反。

MongoDB常用方法
1. 控制返回数量（limit）
```
db.article.find().limit(10)
```
返回10条数据

2. 略过数量
```
db.article.find().skip(5)
```
略过前5条数据，也就是从第6条开始返回。

可以结合limit()和skip()来达到分页效果：
```
select * from article limit 10, 20
db.article.find().skip(10).limit(20)
```
3. 统计

返回匹配数据的长度：
```
db.article.find().count()
```
4. 格式化
pretty()方法可以以格式化的方式显示所有文档：
```
db.article.find().pretty()
```
5. 删除集合
当你要删除一个集合中的所有文档时，直接删除一个集合效率会更高：
```
db.article.drop()
```

原文: http://ghmagical.com/article/page/id/Bj7qgmJ3CJUE
