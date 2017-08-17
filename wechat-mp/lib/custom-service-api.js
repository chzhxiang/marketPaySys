/**
 * Created by Youhn on 2015/8/9.
 * http://mp.weixin.qq.com/wiki/9/6fff6f191ef92c126b043ada035cc935.html
 */
var util = require('./util');
var wrapper=util.wrapper;
var path=require('path');
var fs = require('fs');
var formstream = require('formstream');
/**
 * 获取客服聊天记录
 * @param opts
 * @param callback
 */
exports.getRecords = function (opts, callback) {
    var that=this;
    this.preRequest(function (opts, callback) {
        var url = 'https://api.weixin.qq.com/customservice/msgrecord/getrecord?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,opts,callback);
    }, arguments);
};
/**
 * 获取客服基本信息
 * @param callback
 */
exports.GetCustomBasicInfo = function (callback) {
    var that=this;
    this.preRequest(function (callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    },arguments);
};
/**
 *获取在线客服接待信息
 * @param callback
 */
exports.GetCustomOnlineInfo = function (callback) {
    var that=this;
    this.preRequest(function (callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    },arguments);
};
/**
 *添加客服账号
 * @param account 完整客服账号，格式为：账号前缀@公众号微信号
 * @param nick  昵称
 * @param password 密码 (明文传递,模块自动加密)
 * @param callback
 * @constructor
 */
exports.AddCustom = function (account, nick, password, callback) {
    var that=this;
    this.preRequest(function (account, nick, password, callback) {
        var url ='https://api.weixin.qq.com/customservice//kfaccount/add?access_token=' + this.token.accessToken;
        var data = {
            "kf_account": account,
            "nickname": nick,
            "password": util.md5(password)
        };
        that.CommonJsonPostSend(url,data,callback)
        }, arguments);
};
/**
 * 设置客服账号
 * @param account 完整客服账号，格式为：账号前缀@公众号微信号
 * @param nick 昵称
 * @param password 密码 (明文传递,模块自动加密)
 * @param callback
 * @constructor
 */
exports.UpdateCustom = function (account, nick, password, callback) {
    var that=this;
    this.preRequest(function (account, nick, password, callback) {
        var url = 'https://api.weixin.qq.com/customservice/kfaccount/update?access_token=' + this.token.accessToken;
        var data = {
            "kf_account": account,
            "nickname": nick,
            "password": util.md5(password)
        };
        that.CommonJsonPostSend(url,data,callback);
        }, arguments);
};
/**
 * 删除客服账号
 * @param account 完整客服账号，格式为：账号前缀@公众号微信号
 * @param callback
 */
exports.DeleteCustom = function (account, callback) {
    var that=this;
    this.preRequest(function (account, callback) {
        var url = 'https://api.weixin.qq.com/customservice/kfaccount/del?access_token=' + this.token.accessToken + '&kf_account=' + account;
        that.CommonJsonGetSend(url, callback);
    }, arguments);
};
/**
 *上传客服头像
 * @param account 完整客服账号，格式为：账号前缀@公众号微信号
 * @param file form-data中媒体文件标识，有filename、filelength、content-type等信息
 * @param callback
 */
exports.UploadCustomHeadimg = function (account, file, callback) {
    this.preRequest(this._UploadCustomHeadimg, arguments);
};

/*!
 * 上传多媒体文件
 * @param account 完整客服账号，格式为：账号前缀@公众号微信号
 * @param file form-data中媒体文件标识，有filename、filelength、content-type等信息
 * @param callback
 */
exports._UploadCustomHeadimg = function (account, file, callback) {
    var that = this;
    fs.stat(filepath, function (err, stat) {
        if (err) {
            return callback(err);
        }
        var form = formstream();
        form.file('media', filepath, path.basename(filepath), stat.size);
        var url ='http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=' + that.token.accessToken + '&kf_account=' + account;
        var opts = {
            dataType: 'json',
            type: 'POST',
            timeout: 60000, // 60秒超时
            headers: form.headers(),
            stream: form
        };
        that.request(url, opts, wrapper(callback));
    });
};
/**
 *创建会话
 * @param openId 客户openid
 * @param kfAccount  完整客服账号，格式为：账号前缀@公众号微信号
 * @param text 附加信息，文本会展示在客服人员的多客服客户端(非必须)
 * @param callback
 */
exports.CreateSession=function(openId,kfAccount,text,callback){
    var that=this;
    this.preRequest(function(openId,kfAccount,text,callback){
        var url="https://api.weixin.qq.com/customservice/kfsession/create?access_token="+this.token._accessToken;
        if (typeof text === 'function') {
            callback = text;
            text = '';
        }
        var data= {
            "openid": openId,
            "kf_account": kfAccount,
            "text": text
        };
        that.CommonJsonPostSend(url,data,callback);
        }, arguments);
};
/**
 *关闭会话
 * @param openId 客户openid
 * @param kfAccount  完整客服账号，格式为：账号前缀@公众号微信号
 * @param text 附加信息，文本会展示在客服人员的多客服客户端(非必须,默认为空)
 * @param callback
 */
exports.CloseSession=function(openId,kfAccount,text,callback){
    var that=this;
    this.preRequest(function(openId,kfAccount,text,callback) {
        var url = "https://api.weixin.qq.com/customservice/kfsession/close?access_token=" + this.token._accessToken;
        var data = {
            "openid": openId,
            "kf_account": kfAccount,
            "text": text != null ? text : null
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * 获取客户的会话状态
 * @param openid
 * @param callback
 * @constructor
 */
exports.GetSessionState=function(openid,callback){
    var that=this;
    this.preRequest(function(openid,callback) {
        var url="https://api.weixin.qq.com/customservice/kfsession/getsession?access_token="+this.token._accessToken;
        that.CommonJsonGetSend(url,callback)
    }, arguments);
};
/**
 *获取客服的会话列表
 * @param kfAccount 完整客服账号，格式为：账号前缀@公众号微信号，账号前缀最多10个字符，必须是英文或者数字字符。
 * @param callback
 * @constructor
 */
exports.GetSessionList=function(kfAccount,callback){
    var that=this;
    this.preRequest(function(kfAccount,callback) {
        var url = "https://api.weixin.qq.com/customservice/kfsession/getsessionlist?access_token=" + this.token._accessToken + "&kf_account=" + kfAccount;
        that.CommonJSONGetSend(url, callback)
    }, arguments);
};
/**
 * 获取未接入会话列表
 * @param callback
 * @constructor
 */
exports.GetWaitCase=function(callback){
    var that=this;
    this.preRequest(function(callback){
        var url="https://api.weixin.qq.com/customservice/kfsession/getwaitcase?access_token="+this.token._accessToken;
        that.CommonJsonGetSend(url,callback);
    }, arguments);
};
