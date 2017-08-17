/**
 * Created by Youhn on 2015/8/15.
 * API:http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
 */
var util = require('./util');
var urllib = require('urllib');
var wrapper = util.wrapper;
var extend = require('util')._extend;
var querystring = require('querystring');

var AccessToken = function (data) {
    if (!(this instanceof AccessToken)) {
        return new AccessToken(data);
    }
    this.data = data;
};

/**
 * ����Ƿ����(��Ч)
 */
AccessToken.prototype.isValid = function () {
    return !!this.data.access_token && (new Date().getTime()) < (this.data.create_at + this.data.expires_in * 1000);
};

/**
 * ����token�����¹���ʱ��
 */
var processToken = function (that, callback) {
    return function (err, data, res) {
        if (err) {
            return callback(err, data);
        }
        data.create_at = new Date().getTime();
        // �洢token
        that.saveToken(data.openid, data, function (err) {
            callback(err, AccessToken(data));
        });
    };
};

/**
 * ��ȡƾ֤�ӿ�
 * @param {String} appid �ڹ���ƽ̨������õ���appid
 * @param {String} appsecret �ڹ���ƽ̨������õ���app secret
 * @param {Function} getToken ���ڻ�ȡtoken�ķ���
 * @param {Function} saveToken ���ڱ���token�ķ���
 */
var OAuth = function (appid, appsecret, getToken, saveToken) {
    this.appid = appid;
    this.appsecret = appsecret;
    // token�Ļ�ȡ�ʹ洢
    this.store = {};
    this.getToken = getToken || function (openid, callback) {
            callback(null, this.store[openid]);
        };
    if (!saveToken && process.env.NODE_ENV === 'production') {
        console.warn("Please dont save oauth token into memory under production");
    }
    this.saveToken = saveToken || function (openid, token, callback) {
            this.store[openid] = token;
            callback(null);
        };
    this.defaults = {};
};

/**
 * ��������urllib��Ĭ��options
 *
 * Examples:
 * ```
 * oauth.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts Ĭ��ѡ��
 */
OAuth.prototype.setOpts = function (opts) {
    this.defaults = opts;
};

/*!
 * urllib�ķ�װ
 * @param {String} url ·��
 * @param {Object} opts urllibѡ��
 * @param {Function} callback �ص�����
 */
OAuth.prototype.request = function (url, opts, callback) {
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
 * ��ȡ��Ȩҳ���URL��ַ
 * @param {String} redirect ��Ȩ��Ҫ��ת�ĵ�ַ
 * @param {String} state �����߿��ṩ������
 * @param {String} scope ���÷�Χ��ֵΪsnsapi_userinfo��snsapi_base��ǰ�����ڵ���������������ת
 */
OAuth.prototype.getAuthorizeURL = function (redirect, state, scope) {
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    var info = {
        appid: this.appid,
        redirect_uri: redirect,
        response_type: 'code',
        scope: scope || 'snsapi_base',
        state: state || ''
    };

    return url + '?' + querystring.stringify(info) + '#wechat_redirect';
};

/**
 * ������Ȩ��ȡ����code����ȡaccess token��openid
 * @param {String} code ��Ȩ��ȡ����code
 * @param {Function} callback �ص�����
 */
OAuth.prototype.getAccessToken = function (code, callback) {
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    var info = {
        appid: this.appid,
        secret: this.appsecret,
        code: code,
        grant_type: 'authorization_code'
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    this.request(url, args, wrapper(processToken(this, callback)));
};


OAuth.prototype.getAppUrl = function (accessToken,sceneId,callback) {
    var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token='+accessToken;
    //https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=TOKEN
    //{"expire_seconds": 604800, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": 123}}}
    var info = {
        //expire_seconds: 1000,
        'action_name': 'QR_SCENE',
        'action_info':{'scene':{'scene_id': sceneId}}
    };
    var args = {
        data: info,
        dataType: 'json',
        contentType:'json',
        method:'POST'
    };
    this.request(url, args, callback);
};



OAuth.prototype.getAppToken = function (callback) {
    //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx031073cd6681cec7&secret=c7f77c39557be806905caa633ec6f767
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
        +this.appid+'&secret='+this.appsecret;
    //var url = 'https://api.weixin.qq.com/cgi-bin/token';
    var info = {
        grant_type:'client_credential',
        appid: this.appid,
        secret: this.appsecret
    };
    var args = {
        //data: info,
        dataType: 'json'
    };
    this.request(url, args, callback);
};

OAuth.prototype.getAppTicket = function (accessToken,callback) {
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
    var info = {
        access_token: accessToken,
        type: 'jsapi'
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    this.request(url, args, callback);
};


/**
 * ����refresh token��ˢ��access token������getAccessToken������?
 * @param {String} refreshToken ͨ��access_token��ȡ����refresh_token����
 * @param {Function} callback
 */
OAuth.prototype.refreshAccessToken = function (refreshToken, callback) {
    var url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
    var info = {
        appid: this.appid,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    this.request(url, args, wrapper(processToken(this, callback)));
};

OAuth.prototype._getUser = function (options, accessToken, callback) {
    var url = 'https://api.weixin.qq.com/sns/userinfo';
    var info = {
        access_token: accessToken,
        openid: options.openid,
        lang: options.lang || 'en'
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    this.request(url, args, wrapper(callback));
};

/**
 * ����openid����ȡ�û���Ϣ��
 * @param {Object|String} options ����openid���߲μ�Options
 * @param {Function} callback �ص�����
 */
OAuth.prototype.getUser = function (options, callback) {
    if (typeof options !== 'object') {
        options = {
            openid: options
        };
    }
    var that = this;
    this.getToken(options.openid, function (err, data) {
        if (err) {
            return callback(err);
        }
        // û��token����
        if (!data) {
            var error = new Error('No token for ' + options.openid + ', please authorize first.');
            error.name = 'NoOAuthTokenError';
            return callback(error);
        }
        var token = AccessToken(data);
        if (token.isValid()) {
            that._getUser(options, token.data.access_token, callback);
        } else {
            that.refreshAccessToken(token.data.refresh_token, function (err, token) {
                if (err) {
                    return callback(err);
                }
                that._getUser(options, token.access_token, callback);
            });
        }
    });
};

OAuth.prototype.checkToken  = function (openid, accessToken, callback) {
    var url = 'https://api.weixin.qq.com/sns/auth';
    var info = {
        access_token: accessToken,
        openid: openid
    };
    var args = {
        data: info,
        dataType: 'json'
    };
    this.request(url, args, wrapper(callback));
};

/**
 * ����code����ȡ�û���Ϣ��
 * @param {String} code ��Ȩ��ȡ����code
 * @param {Function} callback �ص�����
 */
OAuth.prototype.getUserByCode = function (code, callback) {
    var that = this;
    this.getAccessToken(code, function (err, result) {
        if (err) {
            return callback(err);
        }
        that.getUser(result.data.openid, callback);
    });
};

module.exports = OAuth;
