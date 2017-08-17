/**
 * Created by Youhn on 2015/8/10.
 */
var urllib = require('urllib');
var util = require('./util');
var extend = require('util')._extend;
var wrapper = util.wrapper;

var AccessToken = function (accessToken, expireTime) {
    if (!(this instanceof AccessToken)) {
        return new AccessToken(accessToken, expireTime);
    }
    this.accessToken = accessToken;
    this.expireTime = expireTime;
};

/**
 * ����Ƿ����(��Ч)
 * @returns {boolean}
 */
AccessToken.prototype.isValid = function () {
    return !!this.accessToken && (new Date().getTime()) < this.expireTime;
};

var API = function (appid, appsecret, getToken, saveToken) {
    this.appid = appid;
    this.appsecret = appsecret;
    this.getToken = getToken || function (callback) {
            console.log( this.store);
            callback(null, this.store);
        };
    console.log(saveToken);
    this.saveToken = saveToken || function (token, callback) {
            this.store = token;
            if (process.env.NODE_ENV === 'production') {
                console.warn('Don\'t save token in memory, when cluster or multi-computer!');
            }
            callback(null);
        };
    this.defaults = {};
    //this.registerTicketHandle();
};
/**
 *��������urllib��Ĭ��options
 * @param opts
 */
API.prototype.setOpts = function (opts) {
    this.defaults = opts;
};
/**
 * ����urllib��hook
 * @param url
 * @param opts
 * @param callback
 */
API.prototype.request = function (url, opts, callback) {
    var options = {};
    extend(options, this.defaults);
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }
    for (var key in opts) {
        if (key !== 'headers') {
            options[key] = opts[key];
        } else {
            if (opts.headers) {
                options.headers = options.headers || {};
                extend(options.headers, opts.headers);
            }
        }
    }
    urllib.request(url, options, callback);
};
/**
 * ����ҪAccessToken��API������Ϣ�Ĺ�������(GET)
 * @param url
 * @param callback
 * @constructor
 */
API.prototype.CommonJsonGetSend = function (url,callback) {
    this.request(url, {dataType: 'json'}, wrapper(callback));
};
/**
 * ����ҪAccessToken��API������Ϣ�Ĺ�������(POST)
 * @param url
 * @param opts ����
 * @param callback
 * @constructor
 */
API.prototype.CommonJsonPostSend=function(url,opts,callback){
    this.request(url, util.postJSON(opts), wrapper(callback));
};
/**
 * ��ȡƾ֤�ӿ�
 * @param callback
 * @returns {API}
 */
API.prototype.getAccessToken = function (callback) {
    var that = this;
    var url ='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.appsecret;
    this.request(url, {dataType: 'json'}, wrapper(function (err, data) {
        if (err) {
            callback(err,null);
        }
        // ����ʱ�䣬�������ӳٵȣ���ʵ�ʹ���ʱ����ǰ10�룬�Է�ֹ�ٽ��
        var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
        var token = AccessToken(data.access_token, expireTime);
        that.saveToken(token, function (err) {
            if (err) {
                callback(err,null);
            }
            callback(err, token);
        });
    }));
    return this;
};
/**
 *��ȡ���õ�token
 * @param method
 * @param args
 * @param retryed
 */
API.prototype.preRequest = function (method, args, retryed) {
    var that = this;
    var callback = args[args.length - 1];
    // �����û�����Ļ�ȡtoken���첽���������token֮��ʹ�ã�������������
    that.getToken(function (err, token) {
        if (err) {
            return callback(err);
        }
        var accessToken;
        // ��token����token��Чֱ�ӵ���
        if (token && (accessToken = AccessToken(token.accessToken, token.expireTime)).isValid()) {
            // ��ʱ����token
            that.token = accessToken;
            if (!retryed) {
                var retryHandle = function (err, data, res) {
                    // 40001 ����
                    if (data && data.errcode && data.errcode === 40001) {
                        return that.preRequest(method, args, true);
                    }
                    callback(err, data, res);
                };
                // �滻callback
                var newargs = Array.prototype.slice.call(args, 0, -1);
                newargs.push(retryHandle);
                method.apply(that, newargs);
            } else {
                method.apply(that, args);
            }
        } else {
            // ʹ��appid/appsecret��ȡtoken
            that.getAccessToken(function (err, token) {
                // ��������ͨ���ص���������
                if (err) {
                    return callback(err);
                }
                // ��ʱ����token
                that.token = token;
                method.apply(that, args);
            });
        }
    });
};
/**
 *��ȡ���µ�token
 * @param callback
 */
API.prototype.getLatestToken = function (callback) {
    var that = this;
    // �����û�����Ļ�ȡtoken���첽���������token֮��ʹ�ã�������������
    that.getToken(function (err, token) {
        if (err) {
            return callback(err);
        }
        var accessToken;
        // ��token����token��Чֱ�ӵ���
        if (token && (accessToken = AccessToken(token.accessToken, token.expireTime)).isValid()) {
            callback(null, accessToken);
        } else {
            // ʹ��appid/appsecret��ȡtoken
            that.getAccessToken(callback);
        }
    });
};
/**
 * ����֧�ֶ���ϲ���������ϲ���API.prototype�ϣ�ʹ���ܹ�֧����չ
 * @param obj Ҫ�ϲ��Ķ���
 */
API.mixin = function (obj) {
    for (var key in obj) {
        if (API.prototype.hasOwnProperty(key)) {
            throw new Error('Don\'t allow override existed prototype method. method: '+ key);
        }
        API.prototype[key] = obj[key];
    }
};

API.AccessToken = AccessToken;

module.exports = API;