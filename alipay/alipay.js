var pm = require('./../models/publicModel.js')
var AlipayNotify = require('./alipay_notify.class').AlipayNotify;
var AlipaySubmit = require('./alipay_submit.class').AlipaySubmit;
var  assert = require('assert');
var url = require('url');
var pahtString=__dirname;
var inherits = require('util').inherits,
	EventEmitter = require('events').EventEmitter;

var DOMParser = require('xmldom').DOMParser;
var moment = require('moment');

// var o=require('../goodsOrderRoute.js');
// var profitRoute=require('../profitRoute.js');
// var g=require('../goodsRoute.js');
var ObjectID = require('mongodb').ObjectID;
// var grantRoute=require('../grantRoute.js');
// var giftRoute=require('../giftRoute.js');
var prod=process.env.NODE_ENV === 'production'?'':'dev';
// console.log('prod='+prod);

var config=require('./../config/'+prod+'config.js');
// var goodsOrders=require('../../models/goodsOrders.js');
// var gorder = new goodsOrders();

// app_id 2016032801247432
var default_alipay_config = {
	partner:config.alipay.partner //合作身份者id，以2088开头的16位纯数字
	,key:config.alipay.key
	//安全检验码，以数字和字母组成的32位字符
	,seller_email:config.alipay.seller_email //卖家支付宝帐户 必填
	,host:config.alipay.host //域名
	,cacert:pahtString+'/cacert.pem'//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
	,cert_file:pahtString+'/alipay_public_key.pem'
	,private_key:pahtString+'/rsa_private_key.pem'
	,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
	,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
	,sign_type:"RSA"//签名方式 不需修改
};

var Alipay=function(alipay_config){

	for(var key in alipay_config){
		default_alipay_config[key] = alipay_config[key];
	}
}



/**
 * 支付回调
 * @param req
 * @param res
 */
Alipay.prototype.alipayNotify = function(req, res){
	var self = this;

	var _POST = req.body;
	console.log('接收到支付回调 alipayNotify');
	console.log(JSON.stringify(_POST));

	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(default_alipay_config);
	//验证消息是否是支付宝发出的合法消息
	alipayNotify.verifyNotify(_POST, function(verify_result){
		console.log(verify_result);
		if(verify_result) {//验证成功
			//商户订单号
			var out_trade_no = _POST['out_trade_no'];
			//支付宝交易号
			var trade_no = _POST['trade_no'];
			//交易状态
			var trade_status = _POST['trade_status'];
			//退款状态
			var refund_status = _POST['refund_status'];

			if(trade_status  == 'TRADE_FINISHED'){

			}else if(trade_status == 'TRADE_SUCCESS'){
				var wxmessage=_POST;

				var payMsg = {payType: 'appAliPay', payInfo: {}};//支付处理数据
				payMsg.payInfo = wxmessage;

				//if(payMsg.payInfo.out_trade_no.indexOf('AG_')>-1){//供应商
				//	profitRoute.checkAgentUpd(payMsg,payMsg.payInfo.out_trade_no);
				//}else if(payMsg.payInfo.out_trade_no.indexOf('GF_')>-1){//虚拟币充值
				//	giftRoute.toUpd(payMsg);
				//}else{//订单
				//	//支付宝接口的回调处理
				//	o.checkGOrderByPayNo(payMsg.payInfo.out_trade_no,payMsg.payType,payMsg.payInfo,function(re,order){////核查支付宝支付回调
				//		console.log(order);
				//		if(re.code==200){
				//			o.updateOrderAllPay(payMsg.payInfo.out_trade_no,payMsg.payInfo,order);//拆分订单
				//			g.updateStockByPayNo(payMsg.payInfo.out_trade_no,order,function(re){//减库存
				//				console.log("END="+re);
				//				//res.success();
				//			});
				//		}else{
				//			console.log(re);
				//			console.log(payMsg);
				//		}
				//	});
				//}
				//o.checkOrderByPayNo(out_trade_no,wxmessage,function(re){////核查支付宝支付回调
				//	if(re.code==200){
				//		o.updateOrderPay(out_trade_no,wxmessage);//统一订单
                //
				//		//var fee=req.wxmessage.total_fee;//收益金额/分
				//		g.updateStockByPayNo(out_trade_no,function(re){//减库存
				//			console.log("END="+re);
				//			//res.success();
				//		});
				//	}else{
				//		console.log(re);
				//		console.log(wxmessage);
				//	}
				//});
			}
			if(refund_status=='REFUND_SUCCESS'){//退款成功
				var refundMsg=_POST;
				o.aliRefundUpdOrder(refundMsg);
			}


			console.log("success");
			res.send("success");		//请不要修改或删除
		}
		else {
			console.log("fail");
			//验证失败
			self.emit("verify_fail");
			res.send("fail");
		}
	});
};

/**
 * 打赏回调
 * @param req
 * @param res
 */
Alipay.prototype.grantnotify = function(req, res){
	var self = this;

	var _POST = req.body;
	console.log(JSON.stringify(_POST));

	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(default_alipay_config);
	//验证消息是否是支付宝发出的合法消息
	alipayNotify.verifyNotify(_POST, function(verify_result){
		console.log(verify_result);
		if(verify_result) {//验证成功
			//商户订单号
			var out_trade_no = _POST['out_trade_no'];
			//支付宝交易号
			var trade_no = _POST['trade_no'];
			//交易状态
			var trade_status = _POST['trade_status'];

			if(trade_status  == 'TRADE_FINISHED'){

			}else if(trade_status == 'TRADE_SUCCESS'){
				var wxmessage=_POST;
				grantRoute.upd(out_trade_no,true,wxmessage);//修改打赏信息；
			}
			console.log("success");
			res.send("success");		//请不要修改或删除
		}
		else {
			console.log("fail");
			//验证失败
			self.emit("verify_fail");
			res.send("fail");
		}
	});
}

/**
 * 退款回调
 * @param req
 * @param res
 */
Alipay.prototype.refundnotify = function(req, res){
	var self = this;

	var _POST = req.body;
	console.log(JSON.stringify(_POST));

	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(default_alipay_config);
	//验证消息是否是支付宝发出的合法消息
	alipayNotify.verifyNotify(_POST, function(verify_result){
		console.log(verify_result);
		if(verify_result) {//验证成功
			//商户订单号
			var out_trade_no = _POST['out_trade_no'];
			//支付宝交易号
			var trade_no = _POST['trade_no'];
			//交易状态
			var trade_status = _POST['trade_status'];

			if(trade_status  == 'TRADE_FINISHED'){

			}else if(trade_status == 'TRADE_SUCCESS'){
				var wxmessage=_POST;
				//修改退款信息；
			}
			console.log("success");
			res.send("success");		//请不要修改或删除
		}
		else {
			console.log("fail");
			//验证失败
			self.emit("verify_fail");
			res.send("fail");
		}
	});
};

/**
 * 下单
 * @param order
 * @param req
 * @param res
 * @returns {*}
 */
Alipay.prototype.appOrders = function(order,req,res){
	//if(!order.payNo){
	//
	//	order.payNo=new ObjectID().toString();
	//}
	var fee=Number(order.countAll);
	//fee=fee*100;
	//var reOrder=o.saveOrder(order);//多商品单订单
	//var reOrder=o.splitOrder(order);//拆分单订单
	//if(!order.body){
	//	if(order.orderGoods&&order.orderGoods.length>0){
	//		order.body=order.orderGoods[0].showGood.goodsName;
	//	}
	//}
	var re={
		payType:"appAliPay",
		trade_no:order.payNo,
		call_back_url:config.payCallBackIp+"/app/alipay/paynotify",
		product_name:order.body,
		amount:fee,
		partner_id:"",
		prepay_id:"",
		noncestr:"",
		timestamp:"",
		package:"",
		sign:""
	};
	console.log("下发app 支付宝支付信息:");
	// console.log(re);
	return res.json({code: 200, msg: '统一下单成功',data:re});
};


/**
 * 充值
 * @param order
 * @param req
 * @param res
 * @returns {*}
 */
Alipay.prototype.appRecharge = function(order,req,res){
	var fee=Number(order.money);
	var recharge = new pm('reCharge');
	order.orderStatus = 0;
	order.name = '支付宝充值';
	recharge.save(order,function(result){})
	var re={
		payType:"appAliPay",
		trade_no:order.payNo,
		call_back_url:config.payCallBackIp+"/mkps/alipay/reChargeCb",
		product_name:order.body,
		amount:fee,
		partner_id:"",
		prepay_id:"",
		noncestr:"",
		timestamp:"",
		package:"",
		sign:""
	};
	console.log("下发app 支付宝支付信息:");
	return res.json({code: 200, msg: '统一下单成功',data:re});
};

Alipay.prototype.reChargeCb = function(req, res){
	var self = this;

	var _POST = req.body;
	console.log('接收到支付回调 alipayNotify');
	console.log(JSON.stringify(_POST));

	//计算得出通知验证结果
	var alipayNotify = new AlipayNotify(default_alipay_config);
	//验证消息是否是支付宝发出的合法消息
	alipayNotify.verifyNotify(_POST, function(verify_result){
		console.log(verify_result);
		if(verify_result) {//验证成功
			//商户订单号
			var out_trade_no = _POST['out_trade_no'];
			//支付宝交易号
			var trade_no = _POST['trade_no'];
			//交易状态
			var trade_status = _POST['trade_status'];
			//退款状态
			var refund_status = _POST['refund_status'];

			if(trade_status  == 'TRADE_FINISHED'){

			}else if(trade_status == 'TRADE_SUCCESS'){
				var wxmessage=_POST;
				var recharge = new pm('reCharge');
				var mywallet = new pm('myWallet');
				var query = {payNo:wxmessage.out_trade_no};
				var setModel = {"$set":{orderStatus:1,payInfo:wxmessage}};
				recharge.update(query,setModel,function(result){});
				recharge.findOne(query,result=>{
					if(result.status>0&&result.items.payNo){
						mywall.findOne({userId:result.items.userId},re=>{
							if(re.status>0){
								if(re.items.userId){
									mywallet.update({userId:result.items.userId},{"$inc":{money:Number(re.items.money)}},reD=>{})
								}else{
									const body = {userId:result.items.userId,money:Number(re.items.money),integrals:0};
									mywallet.save(body,reDate=>{})
								}
							}
						})
					}
				})
			}
			// if(refund_status=='REFUND_SUCCESS'){//退款成功
			// 	var refundMsg=_POST;
			// 	o.aliRefundUpdOrder(refundMsg);
			// }


			console.log("success");
			res.send("success");		//请不要修改或删除
		}
		else {
			console.log("fail");
			//验证失败
			self.emit("verify_fail");
			res.send("fail");
		}
	});
};


//订单列表支付宝支付接口
Alipay.prototype.appOrderPay = function(order,req,res){
	if(!order.payNo){
		order.payNo=config.payNoKey+new ObjectID().toString();
	}
	var fee=Number(order.countAll);
	//fee=fee*100;
	//var reOrder=o.saveOrder(order);//多商品单订单
	var re={
		payType:"appAliPay",
		trade_no:order.payNo,
		call_back_url:config.payCallBackIp+"/mkps/alipay/paynotify",
		product_name:order.body,
		amount:fee,
		partner_id:"",
		prepay_id:"",
		noncestr:"",
		timestamp:"",
		package:"",
		sign:""
	};
	return res.json({code: 200, msg: '请支付',data:re});
};


/**
 * 打赏
 * @param grant
 * @param req
 * @param res
 * @returns {*}
 */
Alipay.prototype.appGrant = function(grant,req,res){
	if(!grant.payNo){
		grant.payNo=new ObjectID().toString();
	}
	var fee=Number(grant.totalFee);
	//fee=fee*100;
	grantRoute.save({fromId:grant.fromId,toId:grant.toId,payNo:grant.payNo,fee:fee,start:false,payType:grant.payType,roomid:grant.roomid,body:grant.body});
	var re={
		payType:"appAliPay",
		trade_no:grant.payNo,
		call_back_url:config.payCallBackIp+"/mkps/alipay/grantnotify",
		product_name:grant.body,
		amount:fee,
		roomid:grant.roomid,
		partner_id:"",
		prepay_id:"",
		noncestr:"",
		timestamp:"",
		package:"",
		sign:""
	};
	return res.json({code: 200, msg: '统一下单成功',data:re});
};


Alipay.prototype.aliRefund = function(req,res){



};

/**
 * 获取 支付宝 退款url
 * @param req
 * @param res
 */
Alipay.prototype.aliRefundUrl = function(aliOrder){
	var p={
		service:'refund_fastpay_by_platform_pwd',
		partner:default_alipay_config.partner,
		_input_charset:'utf-8',
		sign_type:'RSA',
		notify_url:config.payCallBackIp+"/mkps/alipay/refundnotify",
		seller_user_id:default_alipay_config.partner,
		refund_date:moment().format("YYYY-MM-DD HH:mm:ss"),
		batch_no:moment().format("YYYYMMDD")+new ObjectID().toString(),//
		batch_num:aliOrder.batch_num,
		detail_data:aliOrder.detail_data
	};
	console.log('batch_no='+ p.batch_no);
	//计算得出通知验证结果
	var alipaySubmit = new AlipaySubmit(default_alipay_config);
	var url=alipaySubmit.getRefundUrl(p);
	return url;
};

/**
 * 获取 支付宝 批量付款url
 * @param req
 * @param res
 */
Alipay.prototype.aliBatchPayUrlTest = function(){
	var p={
		service:'batch_trans_notify',
		partner:default_alipay_config.partner,
		_input_charset:'utf-8',
		sign_type:'RSA',
		notify_url:config.payCallBackIp+"/mkps/alipay/refundnotify",
		account_name:config.alipay.seller_email,//付款账号名
		email:config.alipay.seller_email,//付款账号
		pay_date:moment().format("YYYYMMDD"),//支付日期
		batch_no:moment().format("YYYYMMDD")+new ObjectID().toString(),//批次号
		batch_num:1,//付款总笔数
		batch_fee:0.01,//付款总金额
		detail_data:'20160428123456789^hehuafly@126.com^何华^0.01^test'//付款的详细数据，最多支持1000笔。 格式为：流水号1^收款方账号1^收款账号姓名1^付款金额1^备注说明1|流水号2^收款方账号2^收款账号姓名2^付款金额2^备注说明2。 每条记录以“|”间隔。
	};
	console.log('batch_no='+ p.batch_no);
	//计算得出通知验证结果
	var alipaySubmit = new AlipaySubmit(default_alipay_config);
	var url=alipaySubmit.getRefundUrl(p);
	return url;
};


/**
 * 手机端 支付宝 web 支付
 * @param req
 * @param res
 */
Alipay.prototype.telWebPay = function(order){

	if(!order.payNo){
		order.payNo=config.payNoKey+new ObjectID().toString();
	}
	var fee=Number(order.countAll);
	//fee=fee*100;
	//var reOrder=o.saveOrder(order);//多商品单订单
	var reOrder=o.splitOrder(order);//拆分单订单
	var p={
		service:'alipay.wap.create.direct.pay.by.user',//手机WEB支付
		partner:default_alipay_config.partner,
		_input_charset:'utf-8',
		sign_type:'RSA',
		notify_url:config.payCallBackIp+"/mkps/alipay/paynotify",
		return_url:'http://'+order.userKey+'.shop.truty.cn/#/index',//	支付宝处理完请求后，当前页面自动跳转到商户网站里指定页面的http路径。
		out_trade_no:order.payNo,//商户网站唯一订单号
		subject:order.body,//商品名称
		total_fee:fee,//交易金额 元
		seller_id:default_alipay_config.partner,//卖家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字。
		payment_type:'1',//支付类型
		show_url:'http://'+order.userKey+'.shop.truty.cn/#/index'//商品展示网址
	};
	//计算得出通知验证结果
	var alipaySubmit = new AlipaySubmit(default_alipay_config);
	var url=alipaySubmit.telWebPay(p,function(body){
	});
	var redata = {url:url,payNo:order.payNo,fee:fee};
	return redata;
};

//代理商 充值
Alipay.prototype.agentWebPay = function(agent){
	if(!agent.id){
		agent.id=config.payNoKey+'AG_'+new ObjectID().toString();
	}

	var fee=Number(agent.profit);
	//fee=fee*100;
	profitRoute.saveAgent(agent);//插入 收益；

	var p={
		service:'create_direct_pay_by_user',//及时到账
		partner:default_alipay_config.partner,
		_input_charset:'utf-8',
		sign_type:'RSA',
		notify_url:config.payCallBackIp+"/mkps/alipay/paynotify",
		return_url:'http://www.geegot.com/zbgAgency',//	支付宝处理完请求后，当前页面自动跳转到商户网站里指定页面的http路径。
		out_trade_no:agent.id,//商户网站唯一订单号
		subject:agent.name,//商品名称
		total_fee:fee,//交易金额 元
		seller_id:default_alipay_config.partner,//卖家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字。
		payment_type:'1',//支付类型
		//show_url:'http://'+10000+'.shop.truty.cn/#/index'//商品展示网址
	};
	//计算得出通知验证结果
	var alipaySubmit = new AlipaySubmit(default_alipay_config);
	var url=alipaySubmit.telWebPay(p,function(body){
		console.log(body);
	});
	console.log(url);
	return url;
};

//代理商 充值 二维码
Alipay.prototype.agentByNative = function(agent){
	if(!agent.id){
		agent.id=config.payNoKey+'AG_'+new ObjectID().toString();
	}

	var fee=Number(agent.profit);
	//fee=fee*100;
	profitRoute.saveAgent(agent);//插入 收益；

	var p={
		method:'alipay.trade.precreate',
		partner:default_alipay_config.partner,
		charset:'utf-8',
		sign_type:'RSA',
		notify_url:config.payCallBackIp+"/mkps/alipay/paynotify",
		out_trade_no:agent.payNo,//商户网站唯一订单号
		subject:agent.body,//商品名称
		total_amount:fee,//交易金额 元
		timeout_express:'60m',
		seller_id:default_alipay_config.partner,//卖家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字。
		show_url:'http://'+10000+'.shop.truty.cn/#/index'//商品展示网址
	};
	//计算得出通知验证结果
	var alipaySubmit = new AlipaySubmit(default_alipay_config);
	var url=alipaySubmit.telWebPay(p,function(body){
		console.log(body);
	});
	return url;
};



/**
 * 虚拟币充值
 * @param order
 * @param req
 * @param res
 * @returns {*}
 */
Alipay.prototype.appGift = function(gift,req,res){
	if(!gift.payNo){
		gift.payNo=config.payNoKey+'GF_'+new ObjectID().toString();
	}
	var fee=Number(gift.payMoney);
	giftRoute.toSave(gift);//保存收益，回调是变更状态

	var re={
		payType:"appAliPay",
		trade_no:gift.payNo,
		call_back_url:config.payCallBackIp+"/mkps/alipay/paynotify",
		product_name:'充值',
		amount:fee,
		partner_id:"",
		prepay_id:"",
		noncestr:"",
		timestamp:"",
		package:"",
		sign:""
	};
	console.log("下发app 支付宝支付信息:");
	console.log(re);
	res.json({code: 200, msg: '充值下单成功',data:re});
};




module.exports = Alipay;
    



