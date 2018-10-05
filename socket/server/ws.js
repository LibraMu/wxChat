
var express = require('express');
var app = express();
var server = require('http').Server(app);
var websocket = require('ws');

app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
});

var wss = new websocket.Server({
    server
});

//广播  
wss.broadcast = function broadcast(s, ws) {
    wss.clients.forEach(function each(client) {
        if (s == 1) {
            client.send(ws);
        }
        if (s == 0) {
            client.send(ws.id + "退出聊天室");
        }
    });
};
// 初始化连接
wss.on('connection', function(ws) {
    // ws.send('你是第' + wss.clients.size + '位');
    // 接收消息并发送到客户端  
    ws.on('message', function(data, flags) {
        // ws.send(data);
        // if (typeof data.msg != "undefined") {
            wss.broadcast(1,data);
        // }
    });
    // 退出聊天  
    // ws.on('close', function(close) {
    //     try {
    //         //手动退出
    //         wss.broadcast(0, this.user.name);
    //     } catch (e) {
    //         console.log('连接断开');
    //     }
    // });
    ws.on('disconnection',function(){
        console.log('关闭连接')
    });
    // 错误信息
    ws.on('error',function(err){
        console.log('错误',err)
    })
});



server.listen(80, function() {
    console.log('listening on *:8080');
});