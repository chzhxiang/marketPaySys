/**
 * Created by Administrator on 2017/7/18.
 */
var pm = require( './../models/publicModel');
var users = new pm('mkusers');
var tokenManager = require('../config/token_manager');
var secret = require('../config/secret');
var jwt = require('jsonwebtoken');
var ObjectID = require('mongodb').ObjectID;
var url = require('url');
var querystring = require('querystring');
var http = require('http');

var login = function(req,res){
    var query = {username:req.body.username};
    var user;
    var token;
    users.find(query,function(data){
        if(data.status>0 && data.items.length>0){
            user = data.items[0];
            token = jwt.sign({
                id: user._id,
                user: user,
            }, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION * 7 });
            return res.json({
                code: 200,
                data: {
                    token: token,
                    username: user.username,
                    nickname: user.nickname||'',
                    userid: user._id.toString(),
                    pic: user.pic||'',
                    openid:user.openid||req.body.openid||''
                },
                msg: '登录成功'
            });
        }else if(data.status>0 && data.items.length===0){
            req.body.vercode && delete req.body.vercode;
            users.save(req.body,function(data){
                user = data;
                token = jwt.sign({
                    id: user._id,
                    user: user,
                }, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION * 7 });
                return res.json({
                    code: 200,
                    data: {
                        token: token,
                        username: user.username,
                        nickname: user.nickname||'',
                        userid: user._id.toString(),
                        pic: user.pic||'',
                        openid:user.openid||req.body.openid||''
                    },
                    msg: '登录成功'
                });
            })
        }else {
            return res.send({ code: 404, msg: '登录失败' });
        }
    })
};


/**
 * 登陆
 * @param req = {
 * source:0, //手机号登陆
 * username:'',
 * vercode:'验证码',
 * isAuto:1自动登录 0 手动
 *
 * source:1, //微信登陆
 * username:unionid,
 * nickname:'',
 * pic:'',
 * openid:'',
 * }
 *
 */
exports.appLogIn = function(req,res){
    // console.log(req.body);
    //source=0 手机号登陆 =1 微信登陆
    if(req.body.source === 0){
        //正则校验手机号
        if((/^1[3|4|5|8][0-9]\d{4,8}$/.test(req.body.username))){
            if(req.body.isAuto === 0){
                //获取验证码
                tokenManager.getUserVercode(req.body.username,function(data){
                    if(data&&req.body.vercode.toString() == data){
                        login(req,res)
                    }else{
                        return res.json({code:400,msg:'验证码错误'})
                    }
                })
            }else{
                login(req,res)
            }
            
        } else {
            return res.json({code:400,msg:'手机号格式不正确'})
        }

    }else if(req.body.source === 1){
        login(req,res)
    }
};

var postVerCode = function(telphone,response){
    var vercode = Math.floor((Math.random() * 9 + 1) * 100000); //生成六位随机数
    var postData = {
        account: 'cf_truty',
        password: 'a123456',
        mobile: telphone,
        content: '您的验证码是：' + vercode + '。请不要把验证码泄露给其他人。',
        type: 'json',
    };
    var content = querystring.stringify(postData);
    var options = {
        host: '121.199.16.178',
        path: '/webservice/sms.php?method=Submit',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length,
        },
    };
    //使用http 发送
    var request =  http.request(options, function (res)
    {
        //设置字符编码
        //console.log(res);
        res.setEncoding('utf8');
        if (res.statusCode == 200) {
            //数据
            res.on('data', function (chunk) {
                console.log(chunk);
            }).on('end', function () {
                tokenManager.saveUserVercode(telphone, vercode, 3600);

                response.send({ code: 200, msg: '验证码已发送' });

            });
        } else
        {
            response.send({ code: 400 });
        }

    });

    request.write(content);
    request.end();
};

/*
 *获取验证码
 *  @param req = {
 *  username:'',
 * }
*
* */

exports.getVerCode = function(req,res){
    var params = url.parse(req.url, true).query;
    console.log(params);
    //正则校验手机号
    if((/^1[3|4|5|8][0-9]\d{4,8}$/.test(params.username))){
        //发送验证码
        postVerCode(params.username,res);
    } else {
        return res.json({code:400,msg:'手机号格式不正确'})
    }
};

exports.logOut = function (req, res) {
    if (req.user) {
        tokenManager.expireToken(req.headers);
        delete req.user;
        return res.json({code:200});
    } else {
        return res.json({code:400});
    }
};

exports.isLogIn = function (req, res) {
    return res.json({ code: 200});
};

/*
*设置账户信息
*@param req = {
*
* }
*
* */

exports.setUserInfo = function(req,res){
    console.log(req.user);
    var query = {_id:ObjectID(req.user.user._id)};
    req.body._id && delete req.body._id
    var setModel = {"$set":req.body};
    users.update(query,setModel,function(data){
        if(data.status>0){
            return res.json({code:200,msg:'设置成功'});
        }else{
            return res.json({code:400,msg:'网络错误'}) ;
        }
    })
};


/*
*
* 获取用户信息
*
* */

exports.getUserInfo = function(req,res){
    var query = {_id:ObjectID(req.user._id)};
    users.find(query,function(data){
        if(data.status>0&&data.items.length>0){
            return res.json({code:200,data:data.items[0],msg:'查询完成'});
        }else if(data.status>0&&data.items.length===0){
            return res.json({code:200,data:[],msg:'查询完成'});
        }else{
            return res.json({code:400,data:[],msg:'网络错误'});
        }
    })
};

