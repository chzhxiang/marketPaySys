/**
 * Created by Youhn on 2015/9/19.
 * API:https://pay.weixin.qq.com/wiki/doc/api/index.html
 */
var util = require('./util');
var request = require('request');
var md5 = require('md5');

exports = module.exports = TenPayV3;

function TenPayV3() {

    if (!(this instanceof TenPayV3)) {
        return new TenPayV3(arguments[0]);
    };

    this.options = arguments[0];
    this.tenpayID = { appid:this.options.appid, mch_id:this.options.mch_id };
};

TenPayV3.mix = function(){

    switch (arguments.length) {
        case 1:
            var obj = arguments[0];
            for (var key in obj) {
                if (TenPayV3.prototype.hasOwnProperty(key)) {
                    throw new Error('Prototype method exist. method: '+ key);
                }
                TenPayV3.prototype[key] = obj[key];
            }
            break;
        case 2:
            var key = arguments[0].toString(), fn = arguments[1];
            if (TenPayV3.prototype.hasOwnProperty(key)) {
                throw new Error('Prototype method exist. method: '+ key);
            }
            TenPayV3.prototype[key] = fn;
            break;
    }
};


TenPayV3.mix('option', function(option){
    for( var k in option ) {
        this.options[k] = option[k];
    }
});


TenPayV3.mix('sign', function(param){

    var querystring = Object.keys(param).filter(function(key){
            return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
        }).sort().map(function(key){
            return key + '=' + param[key];
        }).join("&") + "&key=" + this.options.partner_key;

    return md5(querystring).toUpperCase();
});

/**
 * ͳһ֧���ӿ�
 * �ɽ���JSAPI/NATIVE/APP ��Ԥ֧������������Ԥ֧�������š�NATIVE ֧�����ض�ά��code_url
 */
TenPayV3.mix('UnifiedOrder', function(opts, fn){

    opts.nonce_str = opts.nonce_str || util.GetNoncestr();
    util.mix(opts, this.tenpayID);
    opts.sign = this.sign(opts);
    request({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: 'POST',
        body: util.buildXML(opts),
        agentOptions: {
            //pfx: this.options.pfx,
            passphrase: this.options.mch_id
        }
    }, function(err, res, body){
        console.log(body);
        util.parseXML(body, fn);
    });
});
/**
 *Ԥ֧������
 */
TenPayV3.mix('getBrandWCPayRequestParams', function(order, fn){

    if(!order.trade_type){
        order.trade_type = "JSAPI";
    }
    var _this = this;
    this.UnifiedOrder(order, function(err, data){
        console.log(data);
        var reqparam = {
            appId: _this.options.appid,
            timeStamp: util.GetTimestamp(),
            nonceStr: data.nonce_str,
            package: "prepay_id="+data.prepay_id,
            signType: "MD5",
            codeUrl:data.code_url
        };
        reqparam.paySign = _this.sign(reqparam);
        fn(err, reqparam);
    });
});

TenPayV3.mix('getAppBrandWCPayRequestParams', function(order, fn){

    if(!order.trade_type){
        order.trade_type = "JSAPI";
    }
    var _this = this;
    this.UnifiedOrder(order, function(err, data){
        var reqparam = {
            appid: _this.options.appid,
            partnerid: _this.options.mch_id,
            prepayid: data.prepay_id,
            package: 'Sign=WXPay',
            noncestr: data.nonce_str,
            timestamp: util.GetTimestamp()
        };
        reqparam.sign = _this.sign(reqparam);
        fn(err, reqparam,data);
    });
});

/**
 * Native
 */
TenPayV3.mix('NativePay', function(param){

    param.time_stamp = param.time_stamp || util.GetTimestamp();
    param.nonce_str = param.nonce_str || util.GetNoncestr();
    util.mix(param, this.tenpayID);
    param.sign = this.sign(param);

    var query = Object.keys(param).filter(function(key){
        return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
    }).map(function(key){
        return key + "=" + encodeURIComponent(param[key]);
    }).join('&');

    return "weixin://wxpay/bizpayurl?" + query;
});

/**
 * ֧���ص�
 */
TenPayV3.mix('useWXCallback', function(fn){

    return function(req, res, next){
        var _this = this;
        res.success = function(){ res.end(util.buildXML({ xml:{ return_code:'SUCCESS' } })); };
        res.fail = function(){ res.end(util.buildXML({ xml:{ return_code:'FAIL' } })); };

        util.pipe(req, function(err, data){
            var xml = data.toString('utf8');
            util.parseXML(xml, function(err, msg){
                req.wxmessage = msg;
                fn.apply(_this, [msg, req, res, next]);
            });
        });
    };
});

/**
 * ������ѯ�ӿ�
 */
TenPayV3.mix('OrderQuery', function(query, fn){

    if (!(query.transaction_id || query.out_trade_no)) {
        fn(null, { return_code: 'FAIL', return_msg:'ȱ�ٲ���' });
    }

    query.nonce_str = query.nonce_str || util.GetNoncestr();
    util.mix(query, this.tenpayID);
    query.sign = this.sign(query);

    request({
        url: "https://api.mch.weixin.qq.com/pay/orderquery",
        method: "POST",
        body: util.buildXML({xml: query})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});

/**
 * �رն����ӿ�
 */
TenPayV3.mix('CloseOrder', function(order, fn){

    if (!order.out_trade_no) {
        fn(null, { return_code:"FAIL", return_msg:"ȱ�ٲ���" });
    }

    order.nonce_str = order.nonce_str || util.GetNoncestr();
    util.mix(order, this.tenpayID);
    order.sign = this.sign(order);

    request({
        url: "https://api.mch.weixin.qq.com/pay/closeorder",
        method: "POST",
        body: util.buildXML({xml:order})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});
/**
 * �˿��ѯ�ӿ�
 */
TenPayV3.mix('RefundQuery', function(query, fn){

    if (!(query.transaction_id|| query.out_trade_no||query.out_refund_no||query.refund_id)) {
        fn(null, { return_code:"FAIL", return_msg:"ȱ�ٲ���" });
    }

    query.nonce_str = query.nonce_str || util.GetNoncestr();
    util.mix(order, this.tenpayID);
    query.sign = this.sign(order);

    request({
        url: "https://api.mch.weixin.qq.com/pay/refundquery",
        method: "POST",
        body: util.buildXML({xml:query})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});
TenPayV3.mix('DownloadBill', function(query, fn){

    query.nonce_str = query.nonce_str || util.GetNoncestr();
    util.mix(order, this.tenpayID);
    query.sign = this.sign(query);

    request({
        url: "https://api.mch.weixin.qq.com/pay/downloadbill",
        method: "POST",
        body: util.buildXML({xml:query})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});
/**
 * ������ת���ӿ�
 */
TenPayV3.mix('ShortUrl', function(order, fn){

    order.nonce_str = order.nonce_str || util.GetNoncestr();
    util.mix(order, this.tenpayID);
    order.sign = this.sign(order);

    request({
        url: "https://api.mch.weixin.qq.com/tools/shorturl",
        method: "POST",
        body: util.buildXML({xml:order})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});

/**
 *  退款
 */
TenPayV3.mix('Refund', function(query, fn){

    if (!(query.transaction_id || query.out_trade_no)) {
        fn(null, { return_code: 'FAIL', return_msg:'errorMsg' });
    }

    query.nonce_str = query.nonce_str || util.GetNoncestr();
    util.mix(query, this.tenpayID);
    query.sign = this.sign(query);

    request({
        url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
        method: "POST",
        body: util.buildXML({xml: query}),
        agentOptions: {
            pfx: this.options.pfx,
            key: this.options.key,
            cert: this.options.cert,
            ca: this.options.ca,
            passphrase: this.options.mch_id
        }
    }, function(err, res, body){
        console.log(err);
        console.log(body);
        //console.log(res);
        util.parseXML(body, fn);
    });
});


/**
 *  企业付款
 */
TenPayV3.mix('TransFers', function(query, fn){

    query.nonce_str = query.nonce_str || util.GetNoncestr();
    util.mix(query, this.tenpayID);
    delete query.appid;
    delete query.mch_id;

    query.sign = this.sign(query);


    console.log(query);

    request({
        url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
        method: "POST",
        body: util.buildXML({xml: query}),
        agentOptions: {
            pfx: this.options.pfx,
            key: this.options.key,
            cert: this.options.cert,
            ca: this.options.ca,
            passphrase: this.options.mch_id
        }
    }, function(err, res, body){
        console.log('-------- error 退款-----------');
        console.log(err);
        console.log(body);
        //console.log(res);
        console.log('-------- error 退款-----------');
        util.parseXML(body, fn);
    });
});



/**
 * ˢ��֧��
 * �ύ��ɨ֧��
 */
TenPayV3.mix('MicroPay', function(order, fn){

    order.nonce_str = order.nonce_str || util.GetNoncestr();
    util.mix(order, this.tenpayID);
    order.sign = this.sign(order);

    request({
        url: "https://api.mch.weixin.qq.com/pay/micropay",
        method: "POST",
        body: util.buildXML({xml:order})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});