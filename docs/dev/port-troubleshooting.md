# 端口占用排查

开发过程中，Metro bundler 默认使用 8081 端口。如果端口被占用，可按以下方式排查和处理。

## 查看端口占用

```bash
# 查看 8081 端口的占用情况（显示进程名、PID 等信息）
lsof -i :8081
```

输出示例：

```
COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    12345 asterisk   24u  IPv6 0x1234567890abcdef      0t0  TCP *:sunproxyadmin (LISTEN)
```

## 杀死占用进程

```bash
# 方法 1：一行命令直接杀死（-t 参数只输出 PID）
kill -9 $(lsof -ti :8081)

# 方法 2：先用 lsof 查看 PID，再手动指定
lsof -i :8081
kill -9 <PID>
```

## 使用其他端口启动 Metro

如果不想杀死已有进程，也可以指定其他端口：

```bash
yarn start --port 8082
```

对应地，运行 Android 时也需要指定端口：

```bash
yarn android --port 8082
```

## 常见占用场景

| 场景                  | 说明                                   |
| --------------------- | -------------------------------------- |
| 上次 Metro 未正常退出 | 终端关闭但 node 进程仍在后台运行       |
| 多个项目同时开发      | 另一个 RN 项目也在使用 8081            |
| 其他服务占用          | 如 Charles Proxy 等工具默认也使用 8081 |
