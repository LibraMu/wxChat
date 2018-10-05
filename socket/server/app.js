let app = require('express')(),
	router = require('./router.js'),
	db = require('./db.js');

// 引入json解析中间件
var bodyParser = require('body-parser');
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 跨域
app.all("*",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// app.use('/',router);
app.get('/',function(req,res,next){
	console.log(req.query,'参数')
	let sql = 'select * from chat_record';
	
	db.query(sql,function(err,result){
		if (err) {
			res.send(err);
			next();
		}else{
			console.log(result,'返回结果')
			res.json(result)
		}
	})
});
// 注册
app.post("/user/register",function(req,res){
	let param = req.body,
		phone = param.phone,
		password = param.password,
		data = [phone,password],
		sql = 'insert into user_table (phone,password) value (?,?)';

	db.insert(sql,data,function(err,result){
		if (err) {
			if (err.sqlState == '23000') {
				res.send({code:0,msg:'手机号已注册'});
				return;
			}
			res.send({code:0,msg:'注册失败'});
		}else{
			res.json({code:1,msg:'注册成功'})
		}
	})
});
// 登陆
app.get('/user/login',function(req,res){
	let param = req.query,
		phone = param.phone,
		password = param.password,
		data = [phone,password],
		sql = 'select * from user_table where phone=? and password=?';
	db.insert(sql,data,function(err,result){
		if (err) {
			res.send(err);
		}else{
			if (result.length ==0) {
				res.json({code:0,msg:'账户或密码不正确'});
				return;
			}
			res.json({code:1,msg:"登陆成功",user_id:result[0].id});
		}
	})
});

// 获取好友列表
app.get('/user/friend_list',function(req,res){
	let data = [req.query.user_id],
		sql = "select * from user_table where id in(select friend_id from friend_table where user_id=?)";
	db.insert(sql,data,function(err,result){
		if (err) {
			res.send(err);
		}else{
			res.json(result);
		}
	})
})

// 获取聊天记录
app.get('/chat',function(req,res,next){
	let param = req.query,
		uid = param.user_id,
		chat_id = param.chat_id,
		data = [uid,chat_id,uid,chat_id],
		sql = 'select * from chat_record where user_id in(?,?) and chat_id in(?,?) order by create_time asc';
	if (!chat_id && !uid) {
		res.json({code:0,msg:'缺少参数'})
		return;
	}
	db.insert(sql,data,function(err,result){
		if (err) {
			res.send(err);
			next();
		}else{
			res.json(result)
		}
	})
})

// 新增聊天记录
app.post("/chat",function(req,res){
	let param = req.body,
		uid = param.user_id,
		chat_id = param.chat_id,
		msg = param.message,
		data = [uid,chat_id,msg],
		sql = 'insert into chat_record (user_id,chat_id,message) value (?,?,?)';
	if (!chat_id && !uid && !msg) {
		res.json({code:0,msg:'缺少参数'})
		return;
	}
	db.insert(sql,data,function(err,result){
		if (err) {
			res.send(err);
		}else{
			res.json({code:1,msg:'新增成功'})
		}
	})
})

/*app.post("/user",function(req,res,next){
	let sql = "inster into number (string) value (?)";
	let param2 = req.body;
	let param1 = req.param;
	res.send(param2);
})
*/

/*app.use('/',function(req,res){
	res.send("hello world");
	console.log('连接成功');
});*/


app.listen(8080,function(){
	console.log('连接8080');
})
