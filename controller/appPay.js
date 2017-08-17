/**
 * Created by terry on 15/12/22.
 */
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var moment = require('moment');
var wxpay=require('../wxpay.js');
var goods=require('../goodsRoute.js');
var alipay=require('../alipay/index.js');
var order=require('../goodsOrderRoute.js');
var user=require('../users.js');
var gift=require('../giftRoute.js');
var orderRoute=require('../goodsOrderRoute.js');
var orders = require('./../../models/goodsOrders.js');
var os = new orders();
var config=require('../../config/config.js');
var agentConfig=require('../../config/agentConfig.js');
var good=require('../../models/goods.js');
var g = new good();
var contract=require('../../models/contract.js');
var c = new contract();
var goodsShopCart=require('../goodsShopCartRoute.js');
//订单列表支付接口
exports.OrderPay = function(req,res)
{
    console.log(' 订单列表支付接口 ----1----');
    var orderId = req.body.orderId || '';
    if(orderId == '')
    {
        return res.json({code:400,msg:'缺少参数'});
    }
    console.log('----2----');
    os.sel({orderId:orderId},function(data)
    {
        console.log('----3----');
        if(data.status > 0 && data.items.length > 0)
        {
            console.log('----4----');
            goods.checkAppGoods( data.items[0].orderGoods,function(cRe){//校验
                console.log('----5----');
                var order=data.items[0];
                console.log(cRe);
                if(cRe.length>0){
                    var msg = msgArray(cRe);
                    res.send({code:401,msg:msg,data:cRe});
                }else{
                    console.log('----6----');
                    orderRoute.checkOrder(order,-1,function(data){//校验 订单
                        console.log('----7----');
                        console.log(data);
                        console.log('----8----');
                        if(data.code==400){
                            res.send({code:400,msg:data.msg});
                        }else{
                            if(order.payType.indexOf('WxPay')>-1){
                                order.payType='appWxPay';
                            }
                            if(order.payType.indexOf('AliPay')>-1){
                                order.payType='appAliPay';
                            }

                            if(order.payType=='appWxPay'){
                                wxpay.appOrders(order,req,res);
                            }else if(order.payType=='appAliPay'){
                                alipay.appOrders(order,req,res);
                            }else{
                                res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
                            }
                        }
                    });
                }
            });
        }
        else
        {
            return res.json({code:400,msg:'订单不存在'});
        }
    })
};


function msgArray(cRe)
{
    var msg = '';

    for(var i = 0, len = cRe.length; i<len; i++)
    {
        var spec = '';
        if(cRe[i].showGood.formHead && cRe[i].showGood.formHead.length > 0)
        {
            cRe[i].showGood.formHead.forEach(function(e)
            {
                spec += e;
            });
        }
        if(i<len-1)
        {
            msg += cRe[i].showGood.goodsName + '('+'规格：'+spec+')'+ cRe[i].showGood.msg + '、';
        }
        else if(i==len-1)
        {
            msg += cRe[i].showGood.goodsName + '('+'规格：'+spec+')'+ cRe[i].showGood.msg;
        }

    }
    return msg;
};


var orderPackage = function(data,order)
{
    data.items.forEach(function(d)
    {
        order.orderGoods.forEach(function(e)
        {
            if(d.id == e.showGood.goodId && d.goodsType == 'make')
            {
                if(d.contract)
                {
                    e.showGood.contractId =d.contract.id||'';//代理商合约信息，
                    e.showGood.contractEditId =d.contract.editId||'';//代理商合约信息，
                    e.showGood.supplyGoodsPriceAgio = d.contract.supplyGoodsPriceAgio; //供货价合约折扣
                }
                e.showGood.cutPercentage = d.cutPercentage||0;
                e.showGood.userKey= d.userKey||'';//商品所以者wxu
                e.showGood.userId = d.userId||'';//商品所以者id;
                e.showGood.supplyUserId =  d.supply.userId||'';//供货商id
                e.showGood.supplyWxu =  d.supply.wxu;//供货商wxu
                e.showGood.marketType = d.marketType;//商品来源
                if(0 == e.showGood.specType)
                {
                    e.showGood.supplyPrice= d.specs.spec0.supplyPrice||'';//供货价格
                }
                else if(1 == e.showGood.specType)
                {
                    e.showGood.supplyPrice= d.specs.spec1FormBody[e.showGood.spec1FormBodyNo].supplyPrice||'';//供货价格
                }
                e.showGood.supplyGoodsId = d.supply.supplyGoodsId||'';//供货商品id
                e.showGood.supplyGoodsEditId = d.supply.supplyGoodsEditId||'';//供货商品修改id
                e.showGood.supplyIsExist= d.supply.supplyIsExist||''; //供货商品是否可用
                e.showGood.goodsType = d.goodsType;
            }
            else if(d.id == e.showGood.goodId && d.goodsType != 'taoBao'&& d.goodsType != 'supply')//
            {
                //e.showGood.cutUserId =''; //分销者id
                //e.showGood.cutUserWxu = 10169; //分销者id
                e.showGood.cutPercentage = d.cutPercentage||'';
                e.showGood.userKey=d.userKey||'';//商品所以者wxu
                e.showGood.userId = d.userId||'';//商品所以者id;
                e.showGood.goodsType = d.goodsType||'self';
            }
        })
    });
    return order;
}



/**
 *
 * @param req  {order:{.....,payType:'支付类型',body:'支付描述'，buyObj:{_id:"567106684d98fde41b4dd61c","Address":"厦门", "Telephone":"18650171680", "name":"林小样"},userKey:'商家id 填wxu',openid:'用户id 填用户唯一标识 username'}}
 * @param res
 */
exports.appPay=function(req,res){
    console.log(req.body);
    //buyerid  买家userid    sellerid  卖家userid
    var userMsg=req.user.user;
    var order=req.body;
    //if(!order.openid||""===order.openid){
    order.openid=userMsg.wxu;
    order.buyerid=userMsg._id;//买家 _id;
    var custom={name:userMsg.nickname,tel:userMsg.tel};
    order.custom=custom;
    order.source = 0;
    var goodsid = [];
    var contract = [];
    order.orderGoods.forEach(function(e)
    {
            //该元素在goodsid内部不存在才允许追加
            if(goodsid.indexOf(e.showGood.goodId)==-1){
                goodsid.push(e.showGood.goodId);
            }
    });
    var query={'id':{'$in':goodsid}};
    //查询商品信息
    g.sel(query,function(data){
        console.log(data.items);
        if(data.status > 0 && data.items.length >0)
        {
            //组装订单数据结构
            order = orderPackage(data,order);
            //console.log(JSON.stringify(order));
            goods.checkAppGoods(order.orderGoods,function(cRe){//校验 商品
                if(cRe.length>0){
                    var msg = msgArray(cRe);
                    res.send({code:401,msg:msg,data:cRe});
                }else{
                    orderRoute.checkOrder(order,-1,function(data){//校验 订单
                        console.log(data);
                        if(data.code==400){
                            res.send({code:400,msg:data.msg});
                        }else{
                            goodsShopCart.delShopCartByOrder(order.orderGoods);//删除购物车
                            if(order.payType=='appWxPay'){//支付
                                wxpay.appOrders(order,req,res);
                            }else if(order.payType=='appAliPay'){
                                alipay.appOrders(order,req,res);
                            }else{
                                res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
                            }
                        }
                    });
                }
            });
            //});
        }
        else if(data.status > 0 && 0 == data.items.length)
        {
            return res.json({code:400,msg:'商品不存在'});
        }
        else
        {
            return res.json({code:400,msg:"系统错误"});
        }
    });


};


/**
 * 手机端 web 支付
 * @param req  {order:{.....,payType:'支付类型',body:'支付描述'，buyObj:{_id:"567106684d98fde41b4dd61c","Address":"厦门", "Telephone":"18650171680", "name":"林小样"},userKey:'商家id 填wxu',openid:'用户id 填用户唯一标识 username'}}
 * @param res
 */
exports.webPay=function(req,res){
    //buyerid  买家userid    sellerid  卖家userid
    var userMsg=req.user.user;
    var order=req.body;
    //if(!order.openid||""===order.openid){
    order.openid=userMsg.wxu;
    order.buyerid=userMsg._id;//买家 _id;
    var custom={name:userMsg.nickname,tel:userMsg.tel};
    order.custom=custom;
    //----改造后---------//
    order.sellerid = order.orderGoods[0].showGood.userId;
    order.userKey = order.orderGoods[0].showGood.userKey;
    goods.checkAppGoods(order.orderGoods,function(cRe){//校验
        if(cRe.length>0){
            var msg = msgArray(cRe);
            res.send({code:401,msg:msg,data:cRe});
        }else{
            orderRoute.checkOrder(order,-1,function(data){//校验 订单
                console.log(data);
                if(data.code==400){
                    res.send({code:400,msg:data.msg});
                }else{
                    if(order.payType.indexOf('WxPay')>-1){
                        order.payType='webWxPay';
                    }
                    if(order.payType.indexOf('AliPay')>-1){
                        order.payType='webAliPay';
                    }
                    if(order.payType=='webWxPay'){
                        wxpay.appOrdersByNative(order,req,res);
                    }else if(order.payType=='webAliPay'){
                        order.orderTime=moment.utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
                        alipay.telWebPay(order,res);
                    }else{
                        res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
                    }
                }
            });
        }
    });
    //----改造后---------//

    //----改造前---------//
    //if(order.wxu){//差异性处理。。专为web手机端改造
    //    order.userKey=order.wxu;
    //}
    //user.selIdByWxuAndNotYw(order.userKey,function(reId){//查询卖家_id
    //    order.sellerid=reId;//添加卖家 _id;
    //    console.log(JSON.stringify(order));
    //    goods.checkAppGoods(order.orderGoods,function(cRe){//校验
    //        if(cRe.length>0){
    //            var msg = msgArray(cRe);
    //            res.send({code:401,msg:msg,data:cRe});
    //        }else{
    //            orderRoute.checkOrder(order,-1,function(data){//校验 订单
    //                console.log(data);
    //                if(data.code==400){
    //                    res.send({code:400,msg:data.msg});
    //                }else{
    //                    if(order.payType=='webWxPay'){
    //                        wxpay.appOrdersByNative(order,req,res);
    //                    }else if(order.payType=='webAliPay'){
    //                        alipay.telWebPay(order,res);
    //                    }else{
    //                        res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
    //                    }
    //                }
    //            });
    //        }
    //    });
    //});
    //----改造前---------//
};

/*
* web版商城微信支付
*
* */
exports.webwxPay = function(req,res)
{
    var Openid = req.body.openid;
    var userMsg=req.user.user;
    var order=req.body;
    //if(!order.openid||""===order.openid){
    order.openid=userMsg.wxu;
    order.buyerid=userMsg._id;//买家 _id;
    var custom={name:userMsg.nickname,tel:userMsg.tel};
    order.custom=custom;
    //----改造后---------//
    order.sellerid = order.orderGoods[0].showGood.supplyUserId||order.orderGoods[0].showGood.userId||'';
    order.userKey = order.orderGoods[0].showGood.supplyWxu||order.orderGoods[0].showGood.userKey;
    goods.checkAppGoods(order.orderGoods,function(cRe){//校验
        if(cRe.length>0){
            var msg = msgArray(cRe);
            res.send({code:401,msg:msg,data:cRe});
        }else{
            orderRoute.checkOrder(order,-1,function(data){//校验 订单
                console.log(data);
                if(data.code==400){
                    res.send({code:400,msg:data.msg});
                }else{
                    wxpay.wxUnifiedOrder(order,Openid,req,res);
                }
            });
        }
    });
};


/**
 * 打赏
 * {body:"订单描述",totalFee:'金额',fromId:'打赏人id',toId:'被打赏人id'，payType:'支付类型'}
 * @param req
 * @param res
 */
exports.appGrant=function(req,res){
    var grant=req.body;
    var userMsg=req.user.user;
    var grant=req.body;
    if(!grant.fromId||""===grant.fromId){
        grant.fromId=userMsg.username;
    }
    if(grant.payType=='appWxPay'){
        wxpay.appGrant(grant,req,res);
    }else if(grant.payType='appAliPay'){
        alipay.appGrant(grant,req,res);
    }else{
        res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
    }
};

/**
 * app支付回调
 * {start:"1:成功 2：失败 0：取消"，payType:"",trade_no:""}
 * @param req
 * @param res
 */
exports.appCallback=function(req,res){
    var pay=req.body;
    console.log(order);
    res.send({code:200,msg:'app支付回调成功'});
    if(pay.payType=='appWxPay'){
        //wxpay.appGrant(grant,req,res);
    }else if(pay.payType='appAliPay'){
        //alipay.appGrant(grant,req,res);
    }else{
        res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
    }
};

/**
 * 获取总收益（profit）与 总打赏（grant） 单位元
 * var re=    {profit:0,          grant:0};
 * @param req
 * @param res
 */
exports.getProfitInfo=function(req,res){
    user.getProfitInfo(req.user.user._id,function(re){

        re.profit=parseFloat(re.profit).toFixed(2);//总收益 取2位有效数字 四舍五入
        re.order=parseFloat(re.order).toFixed(2);//直销收益 取2位有效数字 四舍五入
        re.proxy=parseFloat(re.proxy).toFixed(2);//代理收益 取2位有效数字 四舍五入
        re.cut=parseFloat(re.cut).toFixed(2);//分销 取2位有效数字 四舍五入
        re.grant=parseFloat(re.grant).toFixed(2);//总打赏 取2位有效数字 四舍五入

        re.assets=Number(re.profit)+Number(re.grant);//总资产
        re.assets=parseFloat(re.assets).toFixed(2);//取2位有效数字 四舍五入

        re.dayProfit=parseFloat(re.dayProfit).toFixed(2);// 单日收益 取2位有效数字 四舍五入
        var cashNum=Number(config.cashNum);

        if(re.payProfit){//已支付但交易未完成订单金额
            re.cash=parseFloat(re.assets-Number(re.payProfit))-parseFloat(re.assets-Number(re.payProfit))%cashNum;//提现金额
        }else{
            re.cash=parseFloat(re.assets)-parseFloat(re.assets)%cashNum;//提现金额
        }

        re.cash=parseFloat(re.cash).toFixed(2);// 取2位有效数字 四舍五入

        re.cashProfit=parseFloat(re.profit)-parseFloat(re.profit)%cashNum;//提现金额
        re.cashGrant=parseFloat(re.grant)-parseFloat(re.grant)%cashNum;//提现金额

        re.cashProfit=parseFloat(re.cashProfit).toFixed(2);//直销收益 取2位有效数字 四舍五入
        re.cashGrant=parseFloat(re.cashGrant).toFixed(2);//代理收益 取2位有效数字 四舍五入

        orderRoute.selDayRefund(req.user.user._id,function(reDate){
            re.dayRefund=reDate.rBAL||0;//今日退款
            re.dayRefund=parseFloat(re.dayRefund).toFixed(2);//取2位有效数字 四舍五入

            re.dayExpect=reDate.eBAL||0;//今日预收益
            re.dayExpect=parseFloat(re.dayExpect).toFixed(2);//取2位有效数字 四舍五入

            gift.getGiftCashInfoById(req.user.user._id,function(giftData){//获取虚拟币余额
                re.money=giftData.allMoney||0;
                re.cashMoney=giftData.cashMoney||0;
                console.log('---'+req.user.user.wxu+'收益信息---');
                console.log(re);
                res.send({code:200,msg:'获取成功',data:re});
            });
        });

    });
};

exports.getProfitInfoByApi=function(_id,cb){
    user.getProfitInfo(_id,function(re){

        re.profit=parseFloat(re.profit).toFixed(2);//总收益 取2位有效数字 四舍五入
        re.grant=parseFloat(re.grant).toFixed(2);//总打赏 取2位有效数字 四舍五入

        re.assets=Number(re.profit)+Number(re.grant);//总资产
        re.assets=parseFloat(re.assets).toFixed(2);//取2位有效数字 四舍五入

        var cashNum=Number(config.cashNum);

        re.cash=parseFloat(re.assets)-parseFloat(re.assets)%cashNum;//提现金额
        re.cashProfit=parseFloat(re.profit)-parseFloat(re.profit)%cashNum;//提现金额
        re.cashGrant=parseFloat(re.grant)-parseFloat(re.grant)%cashNum;//提现金额
        re.cash=parseFloat(re.cash).toFixed(2);// 取2位有效数字 四舍五入
        cb(re);
    });
};


exports.getProfitInfoTest=function(){

    user.getProfitInfo('56fa040548f418e7227837c7',function(re){
        //re.profit;//总收益
        //re.grant;//总打赏
        re.assets=(re.profit*10+re.grant*10)/10;//总资产
        console.log(re.assets);
        re.assets=parseFloat(re.assets).toFixed(2);
        console.log(re.assets);
        var cashNum=Number(config.cashNum);
        re.cash=re.assets-re.assets%cashNum;//提现金额

        orderRoute.selDayRefund('56fa040548f418e7227837c7',function(reDate){
            re.dayRefund=reDate.rBAL||0;//今日退款
            re.dayExpect=reDate.eBAL||0;//今日预收益
            console.log(re);
            //res.send({code:200,msg:'获取成功',data:re});
        });

    });
};

/**
 * app 退款
 * @param req
 * @param res
 * @constructor
 */
exports.AppRefundOrder=function(req,res){
    var orderD=req.body;

    orderRoute.selByOrderId(orderD.orderId,function(redata){
        if(redata.payType=='appWxPay'){
            if(redata){
                //退款 整个订单一起退
                var body={order:redata};
                body.refundRmb=redata.countAll;
                var index=[];
                redata.orderGoods.forEach(function(d,i){
                    index.push(i);
                });
                body.index=index;
                wxpay.AppRefundOrder(body,res);
            }else{
                res.send({code:400,msg:'无效的订单'});
            }
        }else if(redata.payType='appAliPay'){
            //alipay.appGrant(grant,req,res);
            res.send({code:400,msg:'暂时不支持支付宝退款'});
        }else{
            res.send({code:400,msg:'暂时不支持'+order.payType+'支付类型'});
        }
    });
};


/**
 * app 退款 多订单退款
 * [order1,order2,order2]
 * @param req
 * @param res
 * @constructor
 */
exports.appRefundOrderAll=function(req,res){
    console.log('----int ----');
    var orderIds=req.body;

    var aliOrder= {batch_num:0,detail_data:''};
    var wxOrder=[];

    var re={msg:'订单状态不正确，无法退款！'};

    order.selInOrderId(orderIds,function(orderD){
        if(orderD&&orderD.length>0){
            orderD.forEach(function(d){
                if((d.payType=='appAliPay'||d.payType=='webAliPay')&&d.orderState==8){//支付宝支付
                    var temp= d.payInfo.trade_no+'^'+d.payInfo.total_fee+'^协商退款';
                    if(aliOrder.batch_num==0){
                        aliOrder.detail_data=temp;
                    }else{
                        aliOrder.detail_data=aliOrder.detail_data+'#'+temp;
                    }
                    aliOrder.batch_num++;
                }else if((d.payType=='appWxPay'||d.payType=='webWxPay')&&d.orderState==8){//微信支付
                    wxOrder.push(d);
                    var redata=d;
                    if(redata){
                        //退款 整个订单一起退
                        var body={order:redata};
                        body.refundRmb=redata.countAll;
                        var index=[];
                        redata.orderGoods.forEach(function(dd,i){
                            index.push(i);
                        });
                        body.index=index;
                        wxpay.AppRefundOrder(body);
                    }
                }
            });
            re.msg='';
            if(wxOrder.length>0){
                re.msg='微信退款将自动完成';
            }

            console.log(aliOrder);
            if(aliOrder.batch_num>0){
                re.msg=re.msg+' 支付宝退款请在之后支付宝退款页面确认退款！';
                re.url=alipay.aliRefundUrl(aliOrder);
            }
            return res.json(200,re);
        }else{
            re.msg='无效的订单';
            return res.json(200,re);
        }
    });
};


/**
 *  平台 维权退款
 * [order1,order2,order2]
 * @param req
 * @param res
 * @constructor
 */
exports.appRefundRights=function(req,res){
    console.log('----int ----');
    var orderIds=req.body;

    var aliOrder= {batch_num:0,detail_data:''};
    var wxOrder=[];

    var re={msg:''};

    order.selInOrderId(orderIds,function(orderD){
        if(orderD&&orderD.length>0){
            orderD.forEach(function(d){
                if(d.payType=='appAliPay'&&d.orderState!=3){//支付宝支付/ 确认收货后 不走退款逻辑
                    var temp= d.payInfo.trade_no+'^'+d.payInfo.total_fee+'^协商退款';
                    if(aliOrder.batch_num==0){
                        aliOrder.detail_data=temp;
                    }else{
                        aliOrder.detail_data=aliOrder.detail_data+'#'+temp;
                    }
                    aliOrder.batch_num++;
                }else if(d.payType=='appWxPay'&&d.orderState!=3){//微信支付 确认收货后 不走退款逻辑
                    wxOrder.push(d);
                    var redata=d;
                    if(redata){
                        //退款 整个订单一起退
                        var body={order:redata};
                        body.refundRmb=redata.countAll;
                        var index=[];
                        redata.orderGoods.forEach(function(dd,i){
                            index.push(i);
                        });
                        body.index=index;
                        wxpay.AppRefundOrder(body,res);
                    }
                }
            });

            if(wxOrder.length>0){
                re.msg='微信退款将自动完成';
            }

            console.log(aliOrder);
            if(aliOrder.batch_num>0){
                re.msg=re.msg+' 支付宝退款请在之后支付宝退款页面确认退款！';
                re.url=alipay.aliRefundUrl(aliOrder);
            }
            return res.json(200,re);
        }else{
            re.msg='无效的订单';
            return res.json(200,re);
        }
    });
};

/**
 * 代理商充值
 * @param req
 * @param res
 */
exports.agentPay=function(req,res){
    var body=req.body;
    var userInfo=req.user.user;
    body.profit=parseFloat(parseFloat(body.profit).toFixed(4));//保留4位有效数字

    var profit={userId:userInfo._id.toString(),wxu:userInfo.wxu,profit:body.profit,type:'agent',name:'充值',start:'1'};//开设账户费用信息
    if(body.payType=='webWxPay'){
        wxpay.agentByNative(profit,req,res);
    }else if(body.payType=='webAliPay'){
        alipay.agentWebPay(profit,res);
    }else{
        res.send({code:400,msg:'暂时不支持'+body.payType+'支付类型'});
    }
};

/**
 * 虚拟货币充值
 * @param req
 * @param res
 */
exports.giftPay=function(req,res){
    var body=req.body;
    var userInfo=req.user.user;
    console.log(body);
    console.log(agentConfig.getMapStandard());
    var standard=agentConfig.getMapStandard()[body.money];
    console.log(standard);
    if(!standard){
        res.json({code:400,msg:'无效的金额'});
    }else{
        var giftMsg={userId:userInfo._id,money:standard.diamond,payMoney:standard.money,type:'giftPay',eventName:'充值',start:'1'};
        if(body.payType=='appWxPay'){
            wxpay.appGift(giftMsg,req,res);
        }else if(body.payType=='appAliPay'){
            alipay.appGift(giftMsg,req,res);
        }else{
            res.send({code:400,msg:'暂时不支持'+body.payType+'支付类型'});
        }
    }
};
