/**
 * Created by Youhn on 2015/10/10.
 */
var OAuth=require('./../wechat-mp/oauth2');
var ObjectID = require('mongodb').ObjectID;
var tm=require('../config/token_manager.js');
var u=require('./users.js');



var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
var sign = function (jsapi_ticket,nonceStr,timestamp, url) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: nonceStr,
        timestamp: timestamp,
        url: url
    };
    var string = raw(ret);
    jsSHA = require('jssha');
    //shaObj = new jsSHA(string, 'TEXT');
    //ret.signature = shaObj.getHash('SHA-1', 'HEX');

    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(string);
    ret.signature= shaObj.getHash("HEX");

    return ret.signature;
};

exports.getAuthorizeURL = function(req,res) {
    //var auth = new OAuth('wx031073cd6681cec7','c7f77c39557be806905caa633ec6f767');
    var auth = new OAuth('wx4014e5ef589698bd', '91b80771360be2c27901e04febeb704e');//即客
    var url= auth.getAuthorizeURL(req.body.RUrl,"1","");
    return res.json({url:url});
};

exports.getUserInfoBuyId = function(req,res) {

    var key='userTemp_'+req.body.id;
    tm.verifyWxSig(key,function(data) {
        return res.json(data);
    });
};

exports.getAccessToken = function(req,res) {
    console.log('getAccessToken');
    u.getWxApi(req.body.wxu,function(wxApi){
        var url= wxApi.getAccessToken(req.body.code,function(err,data){
            console.log(data);
            return res.json({data:data});
        });
    });
};
exports.getMYWebAuthorizeURL = function(req,res) {
    //var auth = new OAuth('wx2ab140b9ca337917', '9dbab5a35bc1dec49eff0f758007899a');//即播购
    //var scope = req.body.scope||'';
    //var scope = 'snsapi_login'; //应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
    var auth = new OAuth('wx4014e5ef589698bd', '91b80771360be2c27901e04febeb704e');//即客
    var scope = 'snsapi_userinfo'; //应用授权作用域，拥有多个作用域用逗号（,）分隔
    var url= auth.getAuthorizeURL(req.body.RUrl,"1",scope);
    return res.json({url:url});
};

exports.getMYWebAccessToken = function(req,res) {
    //var auth = new OAuth('wx2ab140b9ca337917', '9dbab5a35bc1dec49eff0f758007899a');//即播购
    var auth = new OAuth('wx4014e5ef589698bd', '91b80771360be2c27901e04febeb704e');//即客
    auth.getAccessToken(req.query.code,function(err,data){
        //console.log(data.data);
        if(!err&&data&&data.data&&data.data.openid){
            var body = {openid:data.data.openid,lang:'zh_CN'};
            var token = data.data.refresh_token;
            auth._getUser(body,data.data.access_token,function(err,userData)
            {
                if(!userData.errorCode)
                {
                    userData.token = token;
                    return res.json({code:200,data:userData});

                }
                else
                {
                    return res.json({code:userData.errorCode});
                }
            });
        }else{
            return res.json({code:400,msg:'openid undefind'});
        }

    });
};

exports.getWebAccessToken = function(req,res) {
    //var auth = new OAuth('wx031073cd6681cec7', 'c7f77c39557be806905caa633ec6f767');
    var auth = new OAuth('wx4014e5ef589698bd', '91b80771360be2c27901e04febeb704e');//即客
    var url= auth.getAccessToken(req.body.code,function(err,data){
        return res.json({data:data});
    });
};
exports.getAppUrl=function(req,res){
    u.getWxApi(req.body.wxu,function(wxApi){
        tm.verifyWxSig('AppToken'+req.body.wxu,function(appToken) {
            if(appToken && appToken!=null){
                wxApi.getAppUrl(appToken,req.body.id,function (err,data){
                    console.log(appToken);
                    console.log(wxApi);
                    console.log(data);
                    if(data){
                        if(data.errcode&&(data.errcode=='42001'||data.errcode=='40001')){
                            wxApi.getAppToken(function(err,data1,ress){
                                if(data1&&data1.access_token) {
                                    //缓存AppToken
                                    tm.saveWxSig("AppToken" + req.body.wxu, data1.access_token, 3000);
                                    wxApi.getAppUrl(data1.access_token,req.body.id,function (err,data2){
                                        res.json(data2);
                                    });
                                }else{
                                    res.json({})
                                }
                            });
                        }else{
                            res.json(data);
                        }
                    }

                });
            }else{

                wxApi.getAppToken(function(err,data){
                    console.log(err);
                    console.log(data);
                    if(data&&data.access_token) {
                        //缓存AppToken
                        console.log('saveWxSig start');
                        tm.saveWxSig("AppToken" + req.body.wxu, data.access_token, 3000);
                        console.log('saveWxSig end');
                        wxApi.getAppUrl(data.access_token,req.body.id,function (err,data){
                            console.log('re appUrl---');
                            console.log(data);
                            res.json(data);
                        });
                    }else{
                        res.json({})
                    }
                });

            }
        });
    });
};

/**
 * 获取js-sdk注册配置
 * @param req
 * @param res
 */
exports.getJsSdkCfg = function(req,res) {
    console.log(req);
    var nonceStr=createNonceStr();
    var timestamp=createTimestamp();
    var reCfg={debug: false,nonceStr:nonceStr,timestamp:timestamp,jsApiList: ['chooseWXPay','onMenuShareAppMessage','onMenuShareTimeline']};

    var auth = new OAuth('wx2ab140b9ca337917', '9dbab5a35bc1dec49eff0f758007899a');//即播购

    auth.getAppToken(function(err,data) {
        //console.log(data.data);
        //var body = {openid: data.data.openid, lang: 'zh_CN'};
        var token = data.access_token;
        console.log('token==='+token);
       reCfg.appId='wx2ab140b9ca337917';
        auth.getAppTicket(token,function(err,data){
            if(data&&data.ticket){
                reCfg.signature=sign(data.ticket,nonceStr,timestamp,req.body.url);
                return res.json(reCfg);
            }else{
                reCfg.signature='getAppTokenError';
                return res.json(reCfg);
            }
        });
    });
};
//exports.getJsSdkCfg = function(req,res) {
//    console.log(req);
//    var nonceStr=createNonceStr();
//    var timestamp=createTimestamp();
//    var reCfg={debug: false,nonceStr:nonceStr,timestamp:timestamp,jsApiList: ['chooseWXPay','onMenuShareAppMessage','onMenuShareTimeline']};
//    var userId="";
//    if(req.body.wxUnionid){
//        userId=req.body.wxUnionid;
//    }
//    if(req.body.wxu){
//        userId=req.body.wxu;
//    }
//   // u.getWxApi(userId,function(wxApi){    var auth = new OAuth('wx2ab140b9ca337917', '9dbab5a35bc1dec49eff0f758007899a');//即播购
//
//    var wxApi = new OAuth('wx2ab140b9ca337917', '9dbab5a35bc1dec49eff0f758007899a');
//        reCfg.appId='wx2ab140b9ca337917';
//        tm.verifyWxSig('AppTicket'+userId,function(appTicket){
//            if(appTicket && appTicket!=null){
//                //签名
//                reCfg.signature=sign(appTicket,nonceStr,timestamp,req.body.url);
//                return res.json(reCfg);
//            }else{
//                tm.verifyWxSig('AppToken'+req.body.wxu,function(appToken) {
//
//                    if(appToken && appToken!=null){
//                        wxApi.getAppTicket(appToken,function (err,data){
//                            console.log('获取缓存TOKEN');
//                            if(data&&data.ticket){
//                                //缓存AppTicket
//                                tm.saveWxSig("AppTicket"+userId,data.ticket,7000);
//                                //签名
//                                reCfg.signature=sign(appTicket,nonceStr,timestamp,req.body.url);
//                            }else{
//                                console.log('获取缓存TOKEN出错');
//                                reCfg.signature='getAppTicketError';
//                            }
//                            return res.json(reCfg);
//                        })
//                    }else{
//                        console.log('缓存TOKEN不存在');
//                        wxApi.getAppToken(function(err,data){
//                            console.log('缓存TOKEN错误'+JSON.stringify(data));
//                            if(data&&data.access_token){
//                                //缓存AppTicket
//                                tm.saveWxSig("AppToken"+userId,data.access_token,7000);
//                                //获取AppTicket
//                                wxApi.getAppTicket(appToken,function(data,a,b,c){
//                                    console.log('测试参数');
//                                    console.log(JSON.stringify(a))
//                                    console.log(JSON.stringify(b))
//                                    console.log(JSON.stringify(c))
//                                    if(data&&data.ticket){
//                                        //缓存AppTicket
//                                        tm.saveWxSig("AppTicket"+userId,data.ticket,7000);
//                                        //签名
//                                        reCfg.signature=sign(appTicket,nonceStr,timestamp,req.body.url);
//                                    }else{
//                                        console.log('缓存TICKET错误'+data);
//                                        reCfg.signature='getAppTicketError';
//                                    }
//                                    return res.json(reCfg);
//                                })
//                            }else{
//                                reCfg.signature='getAppTokenError';
//                                return res.json(reCfg);
//                            }
//                        })
//                    }
//                });
//            }
//        });
//   // });
//};



exports.getUserInfo = function(req,res) {
    u.getWxApi(req.body,function(wxApi){
        var url= wxApi.getUserByCode(req.query.code,function(err,data){
            console.log(data);
            return res.json({data:data});
        });
    });
};


exports.getAuthorizeURLorNo = function(req,res) {
    var auth = new OAuth('wx031073cd6681cec7', 'c7f77c39557be806905caa633ec6f767');

    if(!req.body.no){
        req.body.no=new ObjectID().toString();
    }

    var url= auth.getAuthorizeURL(req.body.RUrl+req.body.no,"1","");
    return res.json({url:url,no:req.body.no});
};

