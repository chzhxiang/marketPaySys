var alipay=require('./alipay.js');
var alipayservice=new alipay({});

exports.alipayNotify=function(req,res){
    alipayservice.alipayNotify(req,res);
};
exports.grantnotify=function(req,res){
    alipayservice.grantnotify(req,res);
};
exports.appOrders=function(order,req,res){
    alipayservice.appOrders(order,req,res);
};
exports.appGift=function(gift,req,res){//充值
    alipayservice.appGift(gift,req,res);
};

exports.appOrderPay=function(order,req,res){
    alipayservice.appOrderPay(order,req,res);
};

exports.appGrant=function(grant,req,res){
    alipayservice.appGrant(grant,req,res);
};
exports.refundnotify=function(req,res){
    alipayservice.refundnotify(req,res);
};
exports.aliRefundUrl=function(order){
    return alipayservice.aliRefundUrl(order);
};
exports.aliBatchPayUrlTest=function(req,res){
    var url=alipayservice.aliBatchPayUrlTest();
    console.log('reUrl='+url);
    return res.json({code: 200, msg: '请支付',data:url});
};
exports.telWebPay=function(order,res){
    var redata=alipayservice.telWebPay(order);
    redata.orderTime = order.orderTime;
    res.json({code: 200, msg: '请支付',data:redata.url,redata:redata});
};
//代理商 充值
exports.agentWebPay=function(profit,res){
    var url=alipayservice.agentWebPay(profit);
    res.json({code: 200, msg: '请支付',data:url});
};
