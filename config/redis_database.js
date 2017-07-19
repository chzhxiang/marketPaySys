var redis = require('redis');
var prod=process.env.NODE_ENV === 'production'?'':'dev';
var config= require('./'+prod+'config.js');
var redisClient = redis.createClient(config.redisProt,config.redisIp,{});
redisClient.auth(config.redisAuth);

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

exports.redis = redis;
exports.redisClient = redisClient;
