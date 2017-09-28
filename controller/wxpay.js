/**
 * Created by Youhn on 2015/10/11.
 */
var WXPay = require('./../wechat-mp/wxpay');
// var Donor=require('../models/donor.js');
// var o=require('./goodsOrderRoute.js');
// var profitRoute=require('./profitRoute.js');
// var g=require('./goodsRoute.js');
// var grantRoute=require('./grantRoute.js');
// var giftRoute=require('./giftRoute.js');
// var u=require('./users.js');
var ObjectID = require('mongodb').ObjectID;
var fs=require('fs');
var prod=process.env.NODE_ENV === 'production'?'':'dev';
var config=require('../config/'+prod+'config.js');
// var tool=require('./tool/tool.js');

var wxpayUtil= WXPay({});


const pm = require('./../models/publicModel');

//var wxpay = WXPay({
//    appid: 'wx031073cd6681cec7',
//    mch_id: '1266074001',
//    partner_key: 'TRUTYmaker201506TRUTYmaker201506',
//
//    //appid: 'wx87bd4cde9a2e1157',
//    //mch_id: '1227636702',
//    //partner_key: 'SAALOVEsaalove13599543001saalove',
//    key:fs.readFileSync('./wechat-mp/apiclient_key.pem'),
//    cert:fs.readFileSync('./wechat-mp/apiclient_cert.pem'),
//    ca:fs.readFileSync('./wechat-mp/rootca.pem'),
//    pfx: fs.readFileSync('./wechat-mp/apiclient_cert.p12')
//});

/**
 * 根据交易类型 获取 微信支付对象
 * @param type
 * @param cb
 */
var getWxPayByType = function (type,cb) {
    if(type=='webWxPay'){
        u.getWebWxPay(function(wxpay){
            cb(wxpay);
        });
    }else {
        u.getAppWxPay(function(wxpay){
            cb(wxpay);
        });
    }
};

exports.UnifiedOrder = function(req,res) {
    var order=req.body;
    var reqHander={
        body:order.body,
        attach:'',
        out_trade_no:order.donor_no,
        total_fee: order.total_fee*100,
        spbill_create_ip: req.connection.remoteAddress,
        trade_type: 'JSAPI',
        notify_url: config.payCallBackIp+'/wxpay/PayNotifyUrl',
        openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs'
    };

    u.getWxPay(order.userKey,function(wxpay){
        wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
            return res.json({data:result});
        })
    });
};

/*
 *  web商城微信支付
 * */
exports.wxUnifiedOrder = function(order,openid,req,res)
{
    if(!order.payNo){
        order.payNo=config.payNoKey+new ObjectID().toString();
    }
    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:order.body,
        attach:'',
        out_trade_no:order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'JSAPI',
        notify_url: config.payCallBackIp+'/wxpay/AppOrderPayUrl',
        openid: openid//'ouZTDtyQCas0X-NwMwGx29DosChs'
    };
    console.log(reqHander);

    u.getWebWxPay(function(wxpay,user){
        wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
            console.log('---------- 微信支付 返回的信息 start ----------');
            console.log(err);
            console.log('---------- 上面是 err 信息 ----------');
            console.log(result);
            console.log('---------- 上面是 result 信息 ----------');
            if(err){
                return res.json({code: 400, msg: '统一下单失败'});
            }
            //生成订单信息
            //var reOrder=o.saveAll({body:order});//一个商品一个订单
            //var reOrder=o.saveOrder(order);//多商品单订单
            var reOrder=o.splitOrder(order);//拆分订单
            return res.json({code: 200, msg: '统一下单成功',data:result});
        })
    });
}

/*
 *  小程序微信支付
 * */
exports.WxAppletPay = function(order,req,res){
    if(!order.payNo){
        order.payNo=new ObjectID().toString();
    }
    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:order.body,
        attach:'',
        out_trade_no:order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'JSAPI',
        notify_url: config.payCallBackIp+'/wxpay/AppOrderPayUrl',
        openid: order.openid||'oy7oQ0d9GXGx9Qs1bMRKtW3ZhkT0'
    };
    // console.log(reqHander);
    const wxpay = WXPay(config.wxAppletPay);
    wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
        // console.log('---------- 微信支付 返回的信息 start ----------');
        // console.log(err);
        // console.log('---------- 上面是 err 信息 ----------');
        // console.log(result);
        // console.log('---------- 上面是 result 信息 ----------');
        if(err){
            return res.json({code: 400, msg: '统一下单失败'});
        }
        //生成订单信息
        //var reOrder=o.saveAll({body:order});//一个商品一个订单
        //var reOrder=o.saveOrder(order);//多商品单订单
        //var reOrder=o.splitOrder(order);//拆分订单
        // console.log(result)
        return res.json({code: 200, msg: '统一下单成功',data:result});
    })
};


exports.goodsOrder = function(req,res) {
    console.log("-----goodsOrder---------");

    var order=req.body;
    if(!order.payNo){
        order.payNo=config.payNoKey+new ObjectID().toString();
    }

    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }

    var reqHander={
        body:order.body,
        attach:'',
        out_trade_no:order.payNo,
        //nonce_str: order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'JSAPI',
        notify_url:  config.payCallBackIp+'/wxpay/OrderPayNotifyUrl',
        openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs'
    };
    console.log(reqHander);

    u.getWxPay(order.userKey,function(wxpay){
        wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
            console.log('to save order !!!');
            console.log(err);
            console.log(result);
            //生成订单信息
            //var reOrder=o.saveAll({body:order});//一个商品一个订单
            var reOrder=o.saveOrder(order);//多商品单订单

            return res.json({data:result,order:reOrder});
        })
    });



};


//订单微信支付
exports.appWxpay = function(order,req,res) {
    console.log("------ appOrder--------");

    //var order=req.body;
    if(!order.payNo){
        order.payNo=config.payNoKey+new ObjectID().toString();
    }

    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:order.body,
        out_trade_no:order.payNo,
        //nonce_str: order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'APP',
        notify_url:  config.payCallBackIp+'/wxpay/AppOrderPayUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //app不用 openid
    };
    console.log(reqHander);

    u.getAppWxPay(function(wxpay,user){
        wxpay.getAppBrandWCPayRequestParams(reqHander,function(err,result,data){
            console.log(err);
            console.log(result);
            console.log(data);
            if(err){
                return res.json({code: 400, msg: '微信支付失败'});
            }
            var re={
                payType:"appWxPay",
                amount:tRmb,
                appid:result.appid,
                trade_no:order.payNo,
                partner_id:result.partnerid,
                prepay_id:result.prepayid,
                noncestr:result.noncestr,
                timestamp:result.timestamp,
                package:result.package,
                sign:result.sign,
                call_back_url:"",
                product_name:""
            };
            return res.json({code: 200, msg: '请支付',data:re});
        })
    });
};

/**
 * app 微信统一下单接口
 * {body:"订单描述"，orderId:"订单id",totalFee:'金额'}
 *
 * @param req {body:"测试",orderId:"123123123123123",totalFee:0.01}
 * @param res {"code":200,"msg":"统一下单成功","data":{"appid":"wx320ce7e9ee6f915c","partner_id":"1327289001","prepay_id":"wx20160331142217f6422b555f0653319495","noncestr":"u6E9tbrdouf4AslJ","timestamp":"1459405338","package":"Sign=WXPay","sign":"F53D8EFB64DFAE3A88A390D808EE9C24"}}
 */
exports.appOrders = function(order,req,res) {
    console.log("------ appOrder--------");

    //var order=req.body;
    //if(!order.payNo){//微信支付 重复payNo 校验出错
   // order.payNo=config.payNoKey+new ObjectID().toString();
    //}
    //order.payNo=new ObjectID().toString();

    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    //if(!order.body){
    //    if(order.orderGoods&&order.orderGoods.length>0){
    //        order.body=order.orderGoods[0].showGood.goodsName;
    //    }
    //}
    //order.body=order.goodsName;
    var reqHander={
        body:order.body,
        out_trade_no:order.payNo,
        //nonce_str: order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'APP',
        notify_url:  config.payCallBackIp+'/wxpay/AppOrderPayUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //app不用 openid
    };
    // console.log(reqHander);

    const wxpay = WXPay(config.wxApppay);

    wxpay.getAppBrandWCPayRequestParams(reqHander,function(err,result,data){
        // console.log('---------- 向微信下单返回的信息 start ----------');

        // console.log(err);
        // console.log('---------- 上面是 err 信息 ----------');
        // console.log(result);
        // console.log('---------- 上面是 result 信息 ----------');
        // //console.log(data);
        if(err){
            return res.json({code: 400, msg: '统一下单失败'});
        }
        //生成订单信息
        //var reOrder=o.saveAll({body:order});//一个商品一个订单
        //var reOrder=o.splitOrder(order);//拆分订单
        var re={
            payType:"appWxPay",
            amount:tRmb,
            appid:result.appid,
            trade_no:order.payNo,
            partner_id:result.partnerid,
            prepay_id:result.prepayid,
            noncestr:result.noncestr,
            timestamp:result.timestamp,
            package:result.package,
            sign:result.sign,
            call_back_url:"",
            product_name:""
        };
        return res.json({code: 200, msg: '统一下单成功',data:re});
    })
};

//二维码支付下单
exports.appOrdersByNative = function(order,req,res) {
    if(!order.payNo){
        order.payNo=config.payNoKey+new ObjectID().toString();
    }
    var tRmb=Number(order.countAll);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:order.body,
        out_trade_no:order.payNo,
        product_id:order.payNo,//商品id
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'NATIVE',//二维码支付
        notify_url:  config.payCallBackIp+'/mkps/wxpay/AppOrderPayUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //二维码支付 不用 openid
    };
    console.log(reqHander);

    u.getWebWxPay(function(wxpay,user){
        wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
            console.log('---------- 微信 二维码支付 返回的信息 start ----------');
            console.log(err);
            console.log('---------- 上面是 err 信息 ----------');
            console.log(result);
            console.log('---------- 上面是 result 信息 ----------');
            if(err){
                return res.json({code: 400, msg: '统一下单失败'});
            }
            //生成订单信息
            //var reOrder=o.saveAll({body:order});//一个商品一个订单
            //var reOrder=o.saveOrder(order);//多商品单订单
            var reOrder=o.splitOrder(order);//拆分订单
            console.log(result.codeUrl);
            tool.createQRcode(req.user.user.wxu,result.codeUrl,function(url){

                var re={
                    payType:"webWxPay",
                    amount:tRmb,
                    appid:result.appid,
                    trade_no:order.payNo,
                    partner_id:result.partnerid,
                    prepay_id:result.prepayid,
                    noncestr:result.noncestr,
                    timestamp:result.timestamp,
                    package:result.package,
                    sign:result.sign,
                    codeUrl:url//二维码地址
                };
                console.log(re);
                return res.json({code: 200, msg: '统一下单成功',data:re});
            });
        })
    });
};

//代理商 充值 二维码支付
exports.agentByNative = function(agent,req,res) {
    if(!agent.id){
        agent.id=config.payNoKey+'AG_'+new ObjectID().toString();
    }
    var tRmb=Number(agent.profit);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:agent.name,
        out_trade_no:agent.id,
        product_id:agent.id,//商品id
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'NATIVE',//二维码支付
        notify_url:  config.payCallBackIp+'/mkps/wxpay/AppOrderPayUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //二维码支付 不用 openid
    };
    console.log(reqHander);

    u.getWebWxPay(function(wxpay,user){
        wxpay.getBrandWCPayRequestParams(reqHander,function(err,result){
            console.log('---------- 微信 二维码支付 返回的信息 start ----------');
            console.log(err);
            console.log('---------- 上面是 err 信息 ----------');
            console.log(result);
            console.log('---------- 上面是 result 信息 ----------');
            if(err){
                return res.json({code: 400, msg: '统一下单失败'});
            }
            profitRoute.saveAgent(agent);//插入 收益；

            console.log(result.codeUrl);
            tool.createQRcode(req.user.user.wxu,result.codeUrl,function(url){

                var re={
                    payType:"webWxPay",
                    amount:tRmb,
                    appid:result.appid,
                    trade_no:agent.id,
                    partner_id:result.partnerid,
                    prepay_id:result.prepayid,
                    noncestr:result.noncestr,
                    timestamp:result.timestamp,
                    package:result.package,
                    sign:result.sign,
                    codeUrl:url//二维码地址
                };
                console.log(re);
                return res.json({code: 200, msg: '统一下单成功',data:re});
            });
        })
    });
};

//代理商 线下充值
exports.agentPayByLine = function(req,res){
    if(!req.body.id){
        req.body.id=config.payNoKey+'AG_'+new ObjectID().toString();
    }
    profitRoute.saveAgent(req.body);//插入 收益；
    return res.json({code:200,msg:'充值成功'});
};
/**
 * app 打赏下单
 * {body:"订单描述",totalFee:'金额',fromId:'打赏人id',toId:'被打赏人id'}
 * @param req
 * @param res
 */
exports.appGrant = function(grant,req,res) {
    console.log("------ 打赏下单--------");

    if(!grant.payNo){
        grant.payNo=config.payNoKey+new ObjectID().toString();
    }

    var tRmb=Number(grant.totalFee);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:grant.body,
        out_trade_no:grant.payNo,
        //nonce_str: order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'APP',
        notify_url:  config.payCallBackIp+'/mkps/wxpay/GrantUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //app不用 openid
    };
    console.log(reqHander);

    u.getAppWxPay(function(wxpay,user){
        wxpay.getAppBrandWCPayRequestParams(reqHander,function(err,result){

            if(err){
                return res.json({code: 400, msg: '打赏下单失败'});
            }
            grantRoute.save({fromId:grant.fromId,toId:grant.toId,payNo:grant.payNo,fee:tRmb,start:false,payType:grant.payType,roomid:grant.roomid,body:grant.body});
            console.log(err);
            console.log(result);
            var re={
                payType:"appWxPay",
                amount:tRmb,
                roomid:grant.roomid,
                trade_no:grant.payNo,
                appid:result.appid,
                partner_id:result.partnerid,
                prepay_id:result.prepayid,
                noncestr:result.noncestr,
                timestamp:result.timestamp,
                package:result.package,
                sign:result.sign,
                call_back_url:"",
                product_name:""
            };
            return res.json({code: 200, msg: '打赏下单成功',data:re});
        })
    });
};


/**
 * 企业付 {openid：“用户openid”，tRmb：“金额”，desc:" 企业付款描述信息"}
 * @param req
 * @param res
 */
exports.appTransFers=function(req,res){

    var openid=req.body.openid;
    var tRmb=req.body.tRmb;
    var desc=req.body.desc;
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }

    u.getAppWxPay(function(wxpay,user){
        var reqHander={
            mch_appid:user.app.wxAppId,//公众账号appid
            mchid:user.app.wxMchId,//商户号
            partner_trade_no:new ObjectID().toString(),//商户订单号
            openid:openid,//用户openid
            check_name:"NO_CHECK",//校验用户姓名选项  NO_CHECK：不校验真实姓名
            amount: tRmb*100,//企业付款金额，单位为分
            desc: desc,//企业付款描述信息
            spbill_create_ip: ip//调用接口的机器Ip地址
        };
        wxpay.TransFers(reqHander,function(err,result){
            console.log(err);
            console.log(result);
            console.log('------------');
            if(result.return_code=='SUCCESS'&&result.result_code=='SUCCESS'){//退款成功
                return res.json({code: 200, msg: '企业付成功',data:result});
            }else{
                return res.json({code: 400, msg: '企业付失败',data:result});
            }
        })
    });

};



/**
 * 退款
 * @param req
 * @param res
 */
exports.refundOrder = function(req,res) {

    var order=req.body.order;
    var refundRmb=req.body.refundRmb;
    var index = req.body.index;

    var tRmb=Number(order.countAll);
    var reqHander={
        out_trade_no:order.payNo,//订单号
        out_refund_no:new ObjectID().toString(),//退款单号
        total_fee: tRmb*100,//订单金额
        refund_fee: refundRmb*100,//退款金额
        op_user_id: order.userKey//操作员
    };
    console.log(reqHander);

    u.getWxPay(order.userKey,function(wxpay){
        wxpay.Refund(reqHander,function(err,result){
            console.log('to refundOrder !!!');
            //console.log(err);
            //console.log(result);
            console.log('------------');
            if(result.return_code=='SUCCESS'&&result.result_code=='SUCCESS'){//退款成功

                var orderRefund={};//退款信息

                order.orderGoods[index].orderState=8;//已退款
                //orderRefund.goodsMsg=order.orderGoods[index];
                orderRefund.heander=reqHander;
                orderRefund.result=result;

                order.orderRefund.push(orderRefund);
                //console.log(order);
                o.editOrderInApi(order);
            }
            //console.log('----- out end  -------');
            //console.log(order);
            return res.json({code: 200, msg: '退款成功',data:{refundRmb:refundRmb}});
        })
    });



};


/**
 *  app 退款
 * @param req
 * @param res
 */
exports.AppRefundOrder = function(body,res) {
    var order=body.order;
    var refundRmb=body.refundRmb;
    var index = body.index;

    var tRmb=Number(order.countAll);
    var reqHander={
        out_trade_no:order.payNo,//订单号
        out_refund_no:new ObjectID().toString(),//退款单号
        total_fee: tRmb*100,//订单金额
        refund_fee: refundRmb*100,//退款金额
        op_user_id: order.userKey//操作员
    };
    console.log(reqHander);

    //根据交易类型 获取 微信支付对象
    getWxPayByType(order.payType,function(wxpay,user){
        wxpay.Refund(reqHander,function(err,result){
            console.log('to refundOrder !!!');
            //console.log(err);
            console.log(result);
            console.log('------------');
            var msg='微信支付退款失败！';
            if(result.return_code=='SUCCESS'&&result.result_code=='SUCCESS'){//退款成功
                if(!order.orderRefund){
                    order.orderRefund=[];
                }

                var orderRefund={};//退款信息

                var goodsMsg=[];
                index.forEach(function(d){
                    order.orderGoods[d].orderState=9;//已退款
                    goodsMsg.push(order.orderGoods[d]);
                });
                orderRefund.goodsMsg=goodsMsg;
                orderRefund.heander=reqHander;
                orderRefund.result=result;
                order.orderState=9;//已退款完成
                order.refundAll=refundRmb;


                order.orderRefund.push(orderRefund);
                //console.log(order);
                //o.editOrderInApi(order);
                o.wsRefundUpdOrder(order);//重写退款状态
                msg='微信支付退款成功!';
            }
            //console.log('----- out end  -------');
            //console.log(order);
            if(res){
                return res.json(200,{data:result,order:order,msg:msg});
            }

        })
    });
};


//打赏回调
exports.GrantUrl=wxpayUtil.useWXCallback(function(msg, req, res, next){
    if("SUCCESS"===req.wxmessage.return_code){
        if("SUCCESS"===req.wxmessage.result_code){
            grantRoute.upd(req.wxmessage.out_trade_no,true,req.wxmessage);//修改打赏信息；
            res.success();
        }else{
            res.fail();
        }
    }else{
        res.fail();
    }

});

exports.OrderPayNotifyUrl=wxpayUtil.useWXCallback(function(msg, req, res, next){
    console.log('-------  wx 支付 回调 ----------');
    console.log(req.wxmessage);
    if("SUCCESS"===req.wxmessage.return_code){
        if("SUCCESS"===req.wxmessage.result_code){

            const wxmessage=req.wxmessage;

            const payMsg = {payType: 'appWxPay', payInfo: {}};//支付处理数据
            payMsg.payInfo = wxmessage;

            //修改店铺收益
            const mkOrder = new pm('mkOrder');
            const mkProfit = new pm('mkProfits');
            const query = {payNo:payMsg.payInfo.out_trade_no};
            mkOrder.find(query,oData=>{
                if(oData.status>0&&oData.items.length>0){
                    const pquery = {shopId:oData.items[0].shopId};
                    const rquery = {}
                    mkProfit.find(pquery,pData=>{
                        if(pData.status>0&&pData.items.length>0){
                            mkProfit.update(pquery,{"$inc":{countAll:oData.items[0].countAll}},data=>{});
                        }else if(pData.status>0&&pData.items.length===0){
                            mkProfit.save({shopId:oData.items[0].shopId,countAll:oData.items[0].countAll},data=>{});
                        }
                    })
                }
            })

            // if(payMsg.payInfo.out_trade_no.indexOf('AG_')>-1){//供应商
            //     profitRoute.checkAgentUpd(payMsg,payMsg.payInfo.out_trade_no);
            // }else{//订单
            //     //微信接口的回调处理
            //     o.checkGOrderByPayNo(payMsg.payInfo.out_trade_no,payMsg.payType,payMsg.payInfo,function(re,order){////核查微信回调
            //         console.log(order);
            //         if(re.code==200){
            //             o.updateOrderAllPay(payMsg.payInfo.out_trade_no,payMsg.payInfo,order);//拆分订单
            //             g.updateStockByPayNo(payMsg.payInfo.out_trade_no,order,function(re){//减库存
            //                 console.log("END="+re);
            //                 //res.success();
            //             });
            //         }else{
            //             console.log(re);
            //             console.log(payMsg);
            //         }
            //     });
            // }

            //o.checkOrderByPayNo(req.wxmessage.out_trade_no,req.wxmessage,function(re){////核查支付宝支付回调
            //    if(re.code==200){
            //        o.updateOrderPay(req.wxmessage.out_trade_no,req.wxmessage);//统一订单
            //        g.updateStockByPayNo(req.wxmessage.out_trade_no,function(re){
            //            console.log("END="+re);
            //            //res.success();
            //        });
            //    }else{
            //        console.log(re);
            //        console.log(req.wxmessage);
            //    }
            //});
            res.success();
        }
    }else{
        res.fail();
    }

});

exports.AppOrderPayUrl=wxpayUtil.useWXCallback(function(msg, req, res, next){
    console.log('-------  wx 支付 回调 ----------');
    console.log(req.wxmessage);
    if("SUCCESS"===req.wxmessage.return_code){
        if("SUCCESS"===req.wxmessage.result_code){
            //var wxmessage=req.wxmessage;
            //
            //var payMsg = {payType: 'appWxPay', payInfo: {}};//支付处理数据
            //payMsg.payInfo = wxmessage;

            //if(payMsg.payInfo.out_trade_no.indexOf('AG_')>-1){//供应商
            //    profitRoute.checkAgentUpd(payMsg,payMsg.payInfo.out_trade_no);
            //}else if(payMsg.payInfo.out_trade_no.indexOf('GF_')>-1){//虚拟币充值
            //    giftRoute.toUpd(payMsg);
            //}else{//订单
            //    //微信接口的回调处理
            //    o.checkGOrderByPayNo(payMsg.payInfo.out_trade_no,payMsg.payType,payMsg.payInfo,function(re,order){//核查微信回调
            //        console.log(order);
            //        if(re.code==200){
            //            o.updateOrderAllPay(payMsg.payInfo.out_trade_no,payMsg.payInfo,order);//拆分订单
            //            g.updateStockByPayNo(payMsg.payInfo.out_trade_no,order,function(re){//减库存
            //                console.log("END="+re);
            //                //res.success();
            //            });
            //        }else{
            //            console.log(re);
            //            console.log(payMsg);
            //        }
            //    });
            //}
            //o.checkOrderByPayNo(req.wxmessage.out_trade_no,req.wxmessage,function(re){////核查支付宝支付回调
            //    if(re.code==200){
            //        o.updateOrderPay(req.wxmessage.out_trade_no,req.wxmessage);//统一订单
            //        g.updateStockByPayNo(req.wxmessage.out_trade_no,function(re){
            //            console.log("END="+re);
            //            //res.success();
            //        });
            //    }else{
            //        console.log(re);
            //        console.log(req.wxmessage);
            //    }
            //});
            res.success();
        }
    }else{
        res.fail();
    }
});

exports.PayNotifyUrl=wxpayUtil.useWXCallback(function(msg, req, res, next){
    if("SUCCESS"===req.wxmessage.return_code){
        if("SUCCESS"===req.wxmessage.result_code){
            var donor=new Donor();
            var query={"donor_no":req.wxmessage.out_trade_no};
            donor.finddonor(query, function(data){
                if (data.items.length>0)
                {
                    var entity=data.items[0];
                    if(entity.pay_state=="1"){
                        res.success();
                    }else{
                        entity.pay_state="1";
                        entity.create_time=new Date();
                        entity.openid=req.wxmessage.openid;
                        donor.updatedonor(query,{"$set":{"pay_state":"1","create_time":entity.create_time,"openid":msg.openid}}, function(data){
                            if (data.status > 0)
                            {
                                res.success();
                            }
                            else
                            {
                                res.fail();
                            }
                        });
                    }
                }

            });
        }
    }else{
        res.fail();
    }
});

/**
 *  虚拟币 充值
 * @param req
 * @param res
 */
exports.appGift = function(gift,req,res) {
    console.log("------ 虚拟币 充值 下单--------");

    if(!gift.payNo){
        gift.payNo=config.payNoKey+'GF_'+new ObjectID().toString();
    }

    var tRmb=Number(gift.payMoney);
    var ip=req.connection.remoteAddress;
    if(ip.indexOf('ff')>0){
        ip=ip.substr(7,ip.length);
    }
    var reqHander={
        body:gift.eventName,
        out_trade_no:gift.payNo,
        //nonce_str: order.payNo,
        total_fee: tRmb*100,
        spbill_create_ip: ip,
        trade_type: 'APP',
        notify_url:  config.payCallBackIp+'/mkps/wxpay/AppOrderPayUrl'
        //openid: order.openid//'ouZTDtyQCas0X-NwMwGx29DosChs' //app不用 openid
    };
    console.log(reqHander);

    u.getAppWxPay(function(wxpay,user){
        wxpay.getAppBrandWCPayRequestParams(reqHander,function(err,result){
            if(err){
                return res.json({code: 400, msg: '虚拟币充值下单失败'});
            }
            giftRoute.toSave(gift);//保存收益，回调是变更状态
            console.log(err);
            console.log(result);
            var re={
                payType:"appWxPay",
                amount:tRmb,
                trade_no:gift.payNo,
                appid:result.appid,
                partner_id:result.partnerid,
                prepay_id:result.prepayid,
                noncestr:result.noncestr,
                timestamp:result.timestamp,
                package:result.package,
                sign:result.sign,
                call_back_url:"",
                product_name:""
            };
            return res.json({code: 200, msg: '虚拟币充值下单成功',data:re});
        })
    });
};