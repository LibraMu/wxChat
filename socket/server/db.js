let mysql = require('mysql'),
	db = {};

db.query = function(sql,callback){
	let pool = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'root',
		database:'web'
	});
	// 连接数据库
	pool.connect(function(err){
		if (err) {
			callback(err);
			return;
		}
	});
	// 查询
	pool.query(sql,function(err,result,fields){
		if (err) {
			callback(err);
			return;
		}
		callback(null,result);
	});
	// 结束
	pool.end(function(err){
		if (err) {
			callback(err);
			return;
		}
	})
}

db.insert = function(sql,data,callback){
	let pool = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'root',
		database:'web'
	});
	// 连接数据库
	pool.connect(function(err){
		if (err) {
			callback(err);
			return;
		}
	});
	// 查询
	pool.query(sql,data,function(err,result,fields){
		if (err) {
			callback(err);
			return;
		}
		callback(null,result);
	});
	// 结束
	pool.end(function(err){
		if (err) {
			callback(err);
			return;
		}
	})
}
module.exports = db;