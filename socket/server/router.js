let express  = require('express'),
	router = express.Router();

router.get('/',function(req,res,next){
	res.send("进入路由1");
	next()
});

router.post("/",function(req,res,next){
	
	// res.send('进入路由12');
	// next();
});

module.exports = router;