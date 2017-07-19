var redis = require('redis');
var config=require('./config.js');
var monitorClient = redis.createClient(config.redisProt,config.redisIp,{});
monitorClient.auth(config.redisAuth);

var client = redis.createClient(config.redisProt,config.redisIp,{});
client.auth(config.redisAuth);
monitorClient.on('error', function (err) {
    console.log('Error ' + err);
});

monitorClient.on('connect', function () {
});

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on('connect', function () {
});
monitorClient.subscribe("__keyevent@0__:expired", function(aa) {
    //... 订阅频道成功
});

exports.redis = redis;
exports.monitorClient = monitorClient;
exports.client = client;



// 监听从 `过期队列` 来的消息  请放到具体的业务逻辑中监听
//redisClient.on("message", function(channel, key){
//    var body=key.split('_');
//    if(body.length <3){
//        return ;
//    }
//    var table=body[0];
//    var doIt=body[1];
//    var value=body[2];
//
//    if(table!='orderList'){//orderList_LREM_111122233344
//        return ;
//    }
//});