var urllib = require('urllib');
var util = require('./util');
var crypto = require('crypto');
var wrapper = util.wrapper;

var INVALID_TICKET_CODE = -1;
var Ticket = function (ticket, expireTime) {
    if (!(this instanceof Ticket)) {
        return new Ticket(ticket, expireTime);
    }
    this.ticket = ticket;
    this.expireTime = expireTime;
};

Ticket.prototype.isValid = function () {
    return !!this.ticket && (new Date().getTime()) < this.expireTime;
};
xports.registerTicketHandle = function (getTicketToken, saveTicketToken) {
    if (!getTicketToken && !saveTicketToken) {
        this.ticketStore = {};
    }
    this.getTicketToken = getTicketToken || function (type, callback) {
            if (typeof type === 'function') {
                callback = type;
                type = 'jsapi';
            }
            callback(null, this.ticketStore[type]);
        };

    this.saveTicketToken = saveTicketToken || function (type, ticketToken, callback) {
            // ���¼���
            if (typeof ticketToken === 'function') {
                callback = ticketToken;
                ticketToken = type;
                type = 'jsapi';
            }

            this.ticketStore[type] = ticketToken;
            if (process.env.NODE_ENV === 'production') {
                console.warn("Dont save ticket in memory, when cluster or multi-computer!");
            }
            callback(null);
        };
};
exports.getTicket = function (type, callback) {
    this.preRequest(this._getTicket, arguments);
};

exports._getTicket = function (type, callback) {
    if (typeof type === 'function') {
        callback = type;
        type = 'jsapi';
    }
    var that = this;
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + this.token.accessToken + '&type=' + type;
    urllib.request(url, {dataType: 'json'}, wrapper(function(err, data) {
        if (err) {
            return callback(err);
        }
        // ����ʱ�䣬�������ӳٵȣ���ʵ�ʹ���ʱ����ǰ10�룬�Է�ֹ�ٽ��
        var expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
        var ticket = new Ticket(data.ticket, expireTime);
        that.saveTicketToken(type, ticket, function (err) {
            if (err) {
                return callback(err);
            }
            callback(err, ticket);
        });
    }));
};
/*!
 * ��������ַ���
 */
var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

/*!
 * ����ʱ���
 */
var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000, 0) + '';
};

/*!
 * �����ѯ�ַ���
 */
var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    return string.substr(1);
};

/*!
 * ǩ���㷨
 *
 * @param {String} nonceStr ����ǩ���������
 * @param {String} jsapi_ticket ����ǩ����jsapi_ticket
 * @param {String} timestamp ʱ���
 * @param {String} url ����ǩ����url��ע����������JSAPIʱ��ҳ��URL��ȫһ��
 */
var sign = function (nonceStr, jsapi_ticket, timestamp, url) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: nonceStr,
        timestamp: timestamp,
        url: url
    };
    var string = raw(ret);
    var shasum = crypto.createHash('sha1');
    shasum.update(string);
    return shasum.digest('hex');
};

/*!
 * ��ȯcard_ext���ǩ���㷨
 *
 * @name signCardExt
 * @param {String} api_ticket ����ǩ������ʱƱ�ݣ���ȡ��ʽ��2.��ȡapi_ticket��
 * @param {String} card_id ���ɿ�ȯʱ��õ�card_id
 * @param {String} timestamp ʱ������̻����ɴ�1970 ��1 ��1 ����΢�ſ�ȯ�ӿ��ĵ�00:00:00 ���������,����ǰ��ʱ��,��������Ҫת��Ϊ�ַ�����ʽ;���̻����ɺ��롣
 * @param {String} code ָ���Ŀ�ȯcode �룬ֻ�ܱ���һ�Ρ�use_custom_code �ֶ�Ϊtrue �Ŀ�ȯ������д�����Զ���code ������д��
 * @param {String} openid ָ����ȡ�ߵ�openid��ֻ�и��û�����ȡ��bind_openid �ֶ�Ϊtrue �Ŀ�ȯ������д�����Զ���code ������д��
 * @param {String} balance ������Է�Ϊ��λ��������ͣ�LUCKY_MONEY�����������ȯ���Ͳ����
 */
var signCardExt = function(api_ticket, card_id, timestamp, code, openid, balance) {
    var values = [api_ticket, card_id, timestamp, code || '',  openid || '', balance || ''];
    values.sort();

    var string = values.join('');
    var shasum = crypto.createHash('sha1');
    shasum.update(string);
    return shasum.digest('hex');
};
/*!
 *
 * ��api.preRequest���ƣ�ǰ������Ҫjs api ticket�ķ���
 * @param {Function} method ��Ҫ��װ�ķ���
 * @param {Array} args ������Ҫ�Ĳ���
 */
var preRequestJSApi = function (method, args, retryed) {
    var that = this;
    var callback = args[args.length - 1];
    // �����û�����Ļ�ȡticket���첽���������ticket֮��ʹ�ã�������������
    that.getTicketToken('jsapi', function (err, cache) {
        if (err) {
            return callback(err);
        }
        var ticket;
        // ��ticket����ticket��Чֱ�ӵ���
        if (cache && (ticket = new Ticket(cache.ticket, cache.expireTime)).isValid()) {
            // ��ʱ����ticket
            that.jsTicket = ticket;
            if (!retryed) {
                var retryHandle = function (err, data, res) {
                    // ����
                    if (data && data.errcode && data.errcode === INVALID_TICKET_CODE) {
                        return preRequestJSApi.call(that, method, args, true);
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
            // ��΢�Ŷ˻�ȡticket
            that.getTicket(function (err, ticket) {
                // ��������ͨ���ص���������
                if (err) {
                    return callback(err);
                }
                // ��ʱ����ticket
                that.jsTicket = ticket;
                method.apply(that, args);
            });
        }
    });
};

/*!
 *
 * ��api.preRequest���ƣ�ǰ������Ҫjs wx_card ticket�ķ���
 * @param {Function} method ��Ҫ��װ�ķ���
 * @param {Array} args ������Ҫ�Ĳ���
 */
var preRequestWxCardApi = function(method, args, retryed) {
    var that = this;
    var callback = args[args.length - 1];

    that.getTicketToken('wx_card', function (err, cache) {
        if (err) {
            return callback(err);
        }
        var ticket;
        // ��ticket����ticket��Чֱ�ӵ���
        if (cache && (ticket = new Ticket(cache.ticket, cache.expireTime)).isValid()) {
            // ��ʱ����ticket
            that.wxCardTicket = ticket;
            if (!retryed) {
                var retryHandle = function (err, data, res) {
                    // ����
                    if (data && data.errcode && data.errcode === INVALID_TICKET_CODE) {
                        return preRequestWxCardApi.call(that, method, args, true);
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
            // ��΢�Ŷ˻�ȡticket
            that.getTicket('wx_card', function (err, ticket) {
                // ��������ͨ���ص���������
                if (err) {
                    return callback(err);
                }
                // ��ʱ����ticket
                that.wxCardTicket = ticket;
                method.apply(that, args);
            });
        }
    });
};

/**
 * ��ȡ΢��JS SDK Config���������
 *
 * Examples:
 * ```
 * var param = {
 *  debug: false,
 *  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 *  url: 'http://www.xxx.com'
 * };
 * api.getJsConfig(param, callback);
 * ```
 *
 * Callback:
 * - `err`, ����ʧ��ʱ�õ����쳣
 * - `result`, ��������ʱ�õ���js sdk config�������
 *
 * @param {Object} param ����
 * @param {Function} callback �ص�����
 */
exports.getJsConfig = function (param, callback) {
    preRequestJSApi.call(this, this._getJsConfig, arguments);
};
exports._getJsConfig = function (param, callback) {
    var that = this;
    var nonceStr = createNonceStr();
    var jsAPITicket = this.jsTicket.ticket;
    var timestamp = createTimestamp();
    var signature = sign(nonceStr, jsAPITicket, timestamp, param.url);
    var result = {
        debug: param.debug,
        appId: that.appid,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: param.jsApiList
    };
    callback(null, result);
};

/**
 * ��ȡ΢��JS SDK Config���������
 *
 * Examples:
 * ```
 * var param = {
 *  card_id: 'p-hXXXXXXX',
 *  code: '1234',
 *  openid: '111111',
 *  balance: 100
 * };
 * api.getCardExt(param, callback);
 * ```
 *
 * Callback:
 * - `err`, ����ʧ��ʱ�õ����쳣
 * - `result`, ��������ʱ�õ���card_ext���󣬰����������
 *
 * @name getCardExt
 * @param {Object} param ����
 * @param {Function} callback �ص�����
 */
exports.getCardExt = function (param, callback) {
    preRequestWxCardApi.call(this, this._getCardExt, arguments);
};

exports._getCardExt = function (param, callback) {
    var apiTicket = this.wxCardTicket.ticket;
    var timestamp = createTimestamp();
    var signature = signCardExt(apiTicket, param.card_id, timestamp, param.code, param.openid, param.balance);
    var result = {
        timestamp: timestamp,
        signature: signature
    };

    result.code = param.code || '';
    result.openid = param.openid || '';

    if (param.balance) {
        result.balance = param.balance;
    }
    callback(null, result);
};

/**
 * ��ȡ���µ�js api ticket
 *
 * Examples:
 * ```
 * api.getLatestTicket(callback);
 * ```
 * Callback:
 *
 * - `err`, ��ȡjs api ticket�����쳣ʱ���쳣����
 * - `ticket`, ��ȡ��ticket
 *
 * @param {Function} callback �ص�����
 */
exports.getLatestTicket = function (callback) {
    preRequestJSApi.call(this, this._getLatestTicket, arguments);
};
exports._getLatestTicket = function (callback) {
    callback(null, this.jsTicket);
};