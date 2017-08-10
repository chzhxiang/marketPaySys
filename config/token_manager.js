var redisClient = require('./redis_database').redisClient;
var TOKEN_EXPIRATION = 60*60*24;//一天
var TOKEN_EXPIRATION_SEC =  60;
var secret = require('./secret.js');
// Middleware for token verification
exports.verifyToken = function (req, res, next) {
	var token = getToken(req.headers);
	next();
};
exports.saveRoomHT=function(key,key_value){
	redisClient.set('roomHT_'+key,key_value);

};
exports.getRoomHT=function(key,cb){
	redisClient.get('roomHT_'+key,function(err,data){
		if(data){
			cb(data);
		}else{
			cb();
		}
	});
};
exports.delRoomHT=function(key,cb){
	redisClient.del('roomHT_'+key);
};
exports.expireToken = function(headers) {
	var token = getToken(headers);
	
	if (token != null) {
		redisClient.set(token, { is_expired: true });
    	redisClient.expire(token, TOKEN_EXPIRATION_SEC);
	}
};
exports.saveTone=function(headers){
	var token = getToken(headers);
}
var getToken = function(headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];
			return part[1];
		}
		else {
			return {code:400};
		}
	}
	else {
		return {code:400};
	}
};
exports.saveAppSig=function(key,key_value,expire_sec){
	savekey('appSig_'+key,key_value,expire_sec);
}
exports.verifyAppSig=function(key,cb){
	verifySig('appSig_'+key,function(data){
		cb(data);
	});
}
exports.saveUserVercode=function(key,key_value,expire_sec){
	savekey('UserVercode_'+key,key_value,expire_sec);
}
exports.getUserVercode=function(key,cb){
	verifySig('UserVercode_'+key,function(data){
		cb(data);
	});
}
exports.saveWxSig=function(key,key_value,expire_sec){
	savekey('wx_'+key,key_value,expire_sec);
}
exports.verifyWxSig=function(key,cb){
	verifySig('wx_'+key,function(data){
		cb(data);
	})
}
exports.savemvSig=function(key,key_value,expire_sec){
	savekey('mv_'+key,key_value,expire_sec);
}
exports.verifymvSig=function(key,cb){
	verifySig('mv_'+key,function(data){
		cb(data);
	})
}


var savekey=function(key,key_value,expire_sec){
	redisClient.set(key,key_value);
	redisClient.expire(key,expire_sec);
}
var verifySig=function(key,cb){
	return redisClient.get(key,function(err,data){
		cb(data);
	});
}
exports.saveLiveNum=function(roomid,addNum,cb){
	redisClient.get("livelove_"+roomid, function (err, reply) {
		 if(reply) {
			 var curnum=parseInt(reply);
			 var newcurnum=curnum+parseInt(addNum);
			 redisClient.set("livelove_" + roomid,newcurnum);
			 cb(newcurnum);
		 }else{
			 redisClient.set("livelove_" + roomid,  addNum);
			 cb(addNum);
		 }
	});
}
exports.saveTopicLoveNum=function(topicid,addNum,cb){
	redisClient.get("topiclove_"+topicid, function (err, reply) {
		if(reply) {
			var curnum=parseInt(reply);
			var newcurnum=curnum+parseInt(addNum);
			redisClient.set("topiclove_" + topicid,newcurnum);
			cb(newcurnum);
		}else{
			redisClient.set("topiclove_" + topicid,  addNum);
			cb(addNum);
		}
	});
}
exports.getTopicLoveNum=function(topicid,cb){
	redisClient.get("topiclove_"+topicid, function (err, reply) {
		if(reply) {
			cb(reply);
		}else{
			cb(0)
		}
	});
}
exports.saveTopicCommentNum=function(topicid,addNum,cb){
	redisClient.get("topicComment_"+topicid, function (err, reply) {
		if(reply) {
			var curnum=parseInt(reply);
			var newcurnum=curnum+parseInt(addNum);
			redisClient.set("topicComment_" + topicid,newcurnum);
			cb(newcurnum);
		}else{
			redisClient.set("topicComment_" + topicid,  addNum);
			cb(addNum);
		}
	});
}
exports.getTopicCommentNum=function(topicid,cb){
	redisClient.get("topicComment_"+topicid, function (err, reply) {
		if(reply) {
			cb(reply);
		}else{
			cb(0)
		}
	});
}
exports.getLiveNum=function(roomid,cb){
	redisClient.get("live_"+roomid, function (err, reply) {
		cb(reply);
	});
};
exports.saveLiveUser=function(roomid,userlist){
	redisClient.get("liveuser_"+roomid, function (err, reply) {
		redisClient.set("liveuser_" + roomid, JSON.stringify(userlist),function(a,b,v){
					console.log(a);
				});
	});
};
exports.getLiveUser=function(roomid,cb){
	redisClient.get("liveuser_"+roomid, function (err, reply) {
		cb(JSON.parse(reply));
	});
};
exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;