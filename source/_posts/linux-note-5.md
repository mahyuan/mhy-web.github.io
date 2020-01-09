---
title: linux学习笔记(4) --定时任务
category: 后端
tags:
	- linux
  - bash
  - crontab
date: 2019-03-14 13:15:31
---

## at 一次性定时任务
at服务是否安装
> chkconfig --list | grep atd

at服务重启
> service atd restart

at的访问控制
> /etc/at.allow 白名单
> /etc/at.deny 黑名单 （对root不起作用）

白名单比黑名单优先级高。
如果这两个文件都不存在，那么只有root用户可以使用at命令
<!-- more -->

at使用方法:
> at [选项] 时间

选项：
 - -m: 当at工作完成后，无论是否命令有输出，都用email通知执行at命令的用户
 - -c：工作号：显示该at工作的实际内容

时间：
HH:MM  03:23
HH:MM: YYYY-MM=DD 02:32 2018-09-21
...

eg:
```sh
#在2分钟后执行脚本hello.sh
at now +2 minutes
at > /home/mhy/work/hello.sh >> /home/mhy/work/log_hello.log
```

> atq #查询当前服务器上的at工作、

> atrm [工作号] # 删除指定的at任务

## crontab 循环定时任务
### crond服务
- 操作crond服务
```sh
# /sbin/service
service crond start #启动服务
service crond stop #关闭服务
service crond restart #重启服务
service crond reload #重新载入配置
service crond stats # 查看crontab服务状态
```
操作crond服务需要root权限
- 查看crond服务是否在运行：
```sh
chkconfig --list | grep cron
```
- 加入开机自动启动
```sh
# 查看crond服务是否已设置为开机启动
ntsysv
# 加入开机自动启动
chkconfig --level 35 crond on
```

### crontab 命令
> crontab [选项] (参数)

选项：
 - -e: 编辑当前用户crontab定时任务
 - -l: 查询当前用户crontab定时任务
 - -r: 删除当前用户所有的crontab定时任务
 - -u<用户名>: 指定要设定时任务的用户名称

参数：
 - crontab文件： 指定包含待执行任务的crontab文件


绑定当前登录用户，要确保没有超出当前用户权限。

linux下的任务调度分为两类：系统任务调度和用户任务调度。
**注意**: 因为用户的定时任务是和用户绑定的，所有使用`crontab -e`来设置，系统定时任务(root权限)是编辑`/etc/crontab`来设置的， 而且必须指定用户。

### 系统任务调度
系统周期性所要执行的工作，比如写缓存数据到硬盘、日志清理等。在`/etc`目录下有个crontab文件，这个就是系统任务调度的配置文件。
`/etc/crontab`默认有以下内容：
```sh
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
HOME=/

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
```
eg:
```sh
01 * * * * root run-parts /etc/cron.hourly
02 4 * * * root run-parts /etc/cron.daily
22 4 * * 0 root run-parts /etc/cron.weekly
42 4 1 * * root run-parts /etc/cron.monthly
```
前四行是用来配置crond任务运行的环境变量，第一行SHELL变量指定了系统要使用哪个shell，这里是bash，第二行PATH变量指定了系统执行命令的路径，第三行MAILTO变量指定了crond的任务执行信息将通过电子邮件发送给root用户，如果MAILTO变量的值为空，则表示不发送任务执行信息给用户，第四行的HOME变量指定了在执行命令或者脚本时使用的主目录。
通过/etc/crontab配置文件来设置定时任务是比较好的方式。

- 执行系统的定时任务的方法有两种：
1. 把需要定时执行的脚步复制到`/etc/cron.{daily,weekly,montyly}`目录的任意一个
2. 修改`/etc/crontab`配置文件

### 用户任务调度
用户定期执行的工作，比如数据备份、定时邮件提醒等。 用户可以使用crontab工具来定制自己的计划任务。所有永不定义crontab文件都保存在`/var/spool/cron`目录中。其文件名与用户名一致，使用者权限文件如下：
```
/etc/cron.deny 该文件中所有用户不允许使用crontab命令（黑名单）
/etc/cron.allow 该文件中所列用户允许使用crontab命令 （白名单）
/etc/spool/cron/ 所有用户crontab文件存放的目录，以用户名命名
```
**白名单比黑名单优先级高**， 白名单的用户一定有权限，黑名单的用户如果在白名单，则有权限；如果黑名单的用户不在白名单，则没有权限。
所以只需要把需要限制权限的用户加入到黑名单就可以了，白名单不需要单独添加用户，除了优先级外，有权限的用户一般都比限制权限的用户多，加黑名单比较方便。


### crontab文件的含义
用户所建立的crontab文件中，每一行都代表一条任务，每行的每个字段代表一项设置，它的格式一共分为六个字段，前五段是时间设定段，第六段是要执行的命令段，格式如下：
```sh
* * * * * [执行的任务]
```
顺序： `miniute hour day month week command`
其中：
- minute:  一小时当中的第几分钟, 范围0-59之间的任意整数
- hour: 一天当中的第几个小时, 范围是0-23之间的任意整数
- day: 一个月当中的第几天, 范围是1-31之间的任意整数
- month: 一年当中的第几个月, 范围是1-12之间的任意整数
- week: 一周当中的星期几, 范围是0-7(0和7都代表星期日)之间的任意整数
- command: 要执行的命令，可以是系统命令，也可以是自己编写的脚本文件

以上各个字段中， 还可以使用以下特殊字符：
- 星号`*`: 代表所有可能的值，比如minute字段为`*`代表每分钟执行一次
- 逗号`,`: 逗号隔开的值指定一个列表范围，比如: `1,2,3,5,6`,列表中的每个时间点执行一次
- 中杠`-`: 可以用整数之间的中杠表示一个整数范围，如：`2-5`表示`2,3,4,5`
- 正斜线`/`: 正斜线指定时间的间隔频率， 如`0-23/2`表示每两个小时执行一次，minute字段的`*/10`表示每十分钟执行一次

**使用以下命令设置定时任务:**
```sh
crontab -e
#进入crontab编辑界面。会打开vim编辑，按刚才的格式设置定时任务
```

crontab定时任务实例：
```sh
* * * * * command # 每一分钟执行一次
3,15 * * * * command # 每小时内在第3和第5分钟执行
3,15 8-11 * * * command # 上午8点到11点的第3和第15分钟执行
3，15 8-11 */2 * * command #每隔两天的上午8点到11点的第3和第5分钟执行
3，15 8-11 * * 1 command #每个星期一的上午8点到11点的第3和第5分钟执行
30 21 * * * service /etc/init.d/smb restart #每晚的21:30重启smb
45 4 1,10,22 * * /etc/init.d/smb restart  #每月的1、10、22日重启smb
30 4 * * 6,7 /etc/init.d/nginx restart #没周六日的4:30重启nginx
0,30 18-23 * * *  /etc/init.d/nginx restart  #每天18:00至23:00之间每隔30分钟重启nginx, 注意，minute的范围是0-59，每隔30分钟的写法*/30和0,30的区别
0 23 * * 6 /etc/init.d/nginx restart #每周六晚11:00重启nginx
0 */1 * * * /etc/init.d/nginx restart #每一小时重启nginx
0 23-7 * * * /etc /init.d/nginx restart #晚上11点到早上7点之间，每隔一小时重启nginx
0 11 4 * 1-3 /etc/init.d/nginx restart #每月的4号与每周一到周三的11点重启nginx
0 * * * * root run-parts /etc/cron.hourly #每小时执行/etc/cron.hourly目录内的脚本

```
其他命令：
> crontab -l # 查询crontab任务

> crontab -r # 清除当前用户的所有crontab任务

注意事项：
- 六个选项都不能为空，必须填写，如果不确定使，用`*`代替任意时间
- crontab定时任务，最小有效时间是分钟，最大时间范围是月
- 在定义时间时，日期和星期最好不要在一条定时任务中出现，因为他们都是以天为单位，不利于管理员管理
- 在定时任务中，不管是直接写命令，还是在脚本中写命令，最好都用绝对路径

## anacron配置
anacron会自动执行因为关机等故障没有执行的定时任务，只会检测`/etc/cron.{daily,weekly,montyly}`目录，而不会检测`crontab -e`设置的定时任务

### anacron检测周期
- anacron会使用一天，七天，一个月作为检测周期
- 在系统的`/var/spool/anacron`目录中存在`cron.{daily,weekly,montyly}`文件，用于记录上次执行crontab的时间
- 和当前时间做比较，如果两个时间的差值超过了anacron的指定时间差值，证明有cron任务呗漏执行

#### `/etc/anacrontab`配置文件
```sh
# /etc/anacrontab: configuration file for anacron

# See anacron(8) and anacrontab(5) for details.

SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
# the maximal random delay added to the base delay of the jobs
RANDOM_DELAY=45
# the jobs will be started during the following hours only
START_HOURS_RANGE=3-22

#period in days   delay in minutes   job-identifier   command
1   5   cron.daily      nice run-parts /etc/cron.daily
7   25  cron.weekly     nice run-parts /etc/cron.weekly
@monthly 45 cron.monthly        nice run-parts /etc/cron.monthly
```
#### cron.daily工作执行过程
- 首先读取`/var/spool/anacron/cron.daily`中的上一次anacron执行的时间
- 和当前时间做比较，如果两个时间的差值超过一天，就执行cron.daily工作
- 执行这个工作只能在03:00-22:00之间
- 执行工作时强制延迟时间为5分钟，再随机延迟0-45分钟时间
- 使用`nice`命令指定默认优先级，使用`run-parts`脚本执行`/etc/cron.daily`目录中的所有可执行文件

### crontab实例
```sh
# 检查crond服务是否安装
yum list cronie && systemctl status crond
# 检查crontab工具是否安装
yum list crontabs && which crontab && crontab -l
```
*systemctl 是类似service的一个命令，可以代替*
- cron日志
cron日志保存在`/var/log/cron`
查看日志：
```sh
tail -n 2 /var/log/cron
```
清理日志系统
```sh
#定时任务清理日志
/dev/null > /var/log/shadowsocks.log
```

