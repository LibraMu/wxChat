var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});


app.get('/get',function(req,res){
	console.log('我的法');
	let obj = {code:1,msg:'123'};
	res.json(obj);
	// res.end("{code:1,msg:'123'}");
})

io.on('connection', socket => {
	socket.on('login', (data,callback) =>{
		console.log("用户登录")
	});
	// 加入房间
	socket.on('joinRoom',(data,callback) => {
		callback({code:0,msg:"加入房间"+data.roomName});
	});
	// 离开房间
	socket.on("leaveRoom",(data,callback) => {
		callback({code:0,msg:"已经离开房间"+data.roomName});
	});
	// 监听发布信息
	socket.on('message',(data,callback) => {
		socket.emit('message',data);
		socket.broadcast.emit('message',data);
	});
	socket.on('disconnect',function(){
		console.log('已经断开连接')
	})
	// 
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});