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
 * ��ȡ�ͷ������¼
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
 * ��ȡ�ͷ�������Ϣ
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
 *��ȡ���߿ͷ��Ӵ���Ϣ
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
 *��ӿͷ��˺�
 * @param account �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param nick  �ǳ�
 * @param password ���� (���Ĵ���,ģ���Զ�����)
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
 * ���ÿͷ��˺�
 * @param account �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param nick �ǳ�
 * @param password ���� (���Ĵ���,ģ���Զ�����)
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
 * ɾ���ͷ��˺�
 * @param account �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
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
 *�ϴ��ͷ�ͷ��
 * @param account �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param file form-data��ý���ļ���ʶ����filename��filelength��content-type����Ϣ
 * @param callback
 */
exports.UploadCustomHeadimg = function (account, file, callback) {
    this.preRequest(this._UploadCustomHeadimg, arguments);
};

/*!
 * �ϴ���ý���ļ�
 * @param account �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param file form-data��ý���ļ���ʶ����filename��filelength��content-type����Ϣ
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
            timeout: 60000, // 60�볬ʱ
            headers: form.headers(),
            stream: form
        };
        that.request(url, opts, wrapper(callback));
    });
};
/**
 *�����Ự
 * @param openId �ͻ�openid
 * @param kfAccount  �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param text ������Ϣ���ı���չʾ�ڿͷ���Ա�Ķ�ͷ��ͻ���(�Ǳ���)
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
 *�رջỰ
 * @param openId �ͻ�openid
 * @param kfAccount  �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�ź�
 * @param text ������Ϣ���ı���չʾ�ڿͷ���Ա�Ķ�ͷ��ͻ���(�Ǳ���,Ĭ��Ϊ��)
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
 * ��ȡ�ͻ��ĻỰ״̬
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
 *��ȡ�ͷ��ĻỰ�б�
 * @param kfAccount �����ͷ��˺ţ���ʽΪ���˺�ǰ׺@���ں�΢�źţ��˺�ǰ׺���10���ַ���������Ӣ�Ļ��������ַ���
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
 * ��ȡδ����Ự�б�
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
