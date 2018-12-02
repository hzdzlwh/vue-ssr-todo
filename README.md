

# 使用方法
```
进入项目目录，运行
```
npm install
```
然后执行
```
npm run dev
```
开始开发项目


nodemon.json用于服务端文件修改时重启服务


启动项目
pm2 start pm2.yml --env production
监听
http://localhost:9999/

pm2 stop vue-todo

test local history

# 正式环境配置
1，进入远程服务器目录
2，clone代码
3，进入项目目录，npm run i
4，npm run build
5,pm2 start pm2.yml --env production启动服务

此时不能通过域名访问，只能通过ip访问，因为域名只能监听80端口, 需要通过nginx转发到nodejs的服务

