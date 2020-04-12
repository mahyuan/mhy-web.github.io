---
title: wsl配置zsh为默认shell
date: 2020-4-12
permalink: /wsl-config-zsh
category: 工具链
tags:
  - zsh
  - wsl
---
linux系统下的终端利器zsh + ohmyzsh非常好用，比如兼容bash、自动补全、代码高亮、灵活的路径跳转等。
最近在给wsl配置zsh，发现终端启动时不能成功的切换到zsh。

<!-- more -->

## 问题

安装完zsh和ohmyzsh后，发现启动终端时并不能成功切换到zsh，有如下报错：
```bash
$ source .zshrc
autoload: command not found
bash: /home/mahy/.oh-my-zsh/oh-my-zsh.sh: line 41: syntax error near unexpected token `('
bash: /home/mahy/.oh-my-zsh/oh-my-zsh.sh: line 41: `for plugin ($plugins); do'
```

## 解决方案
根据报错可以搜索到**oh-my-zsh**官方仓库早在2017年就有人反馈这个问题了([issues/6405](https://github.com/ohmyzsh/ohmyzsh/issues/6405 "autoload: command not found"))
，按上面的解决方案执行，问题依然存在，最后查出了是wsl的问题。

这个问题可以在[windows/wsl](https://github.com/Microsoft/WSL/issues/477 "can't change default shell") 上找到解决办法，简单来说，就是在bash的配置文件如~/.bashrc中写入`bash -c zsh`, 手动切换当前shell为zsh。
然后执行`source .bashrc`， 或者重启终端即可解决。




