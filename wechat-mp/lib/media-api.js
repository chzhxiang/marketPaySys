/**
 * Created by Youhn on 2015/8/18.
 * �ӿ����飺http://mp.weixin.qq.com/wiki/5/963fc70b80dc75483a271298a76a8d59.html
 */
var path = require('path');
var fs = require('fs');
var formstream = require('formstream');
var util = require('./util');
/**
 * ������ʱ�ز�
 * @param filepath
 * @param type ý���ļ����ͣ��ֱ���ͼƬ��image����������voice������Ƶ��video��������ͼ��thumb��
 * @param callback
 */
exports.uploadMedia = function (filepath, type, callback) {
    this.preRequest(function (filepath, type, callback){
        var that=this;
        fs.stat(filepath, function (err, stat) {
            if (err) {
                return callback(err);
            }
            var form = formstream();
            form.file('media', filepath, path.basename(filepath), stat.size);
            var url = 'http://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + that.token.accessToken + '&type=' + type;
            var opts = {
                dataType: 'json',
                type: 'POST',
                timeout: 60000, // 60�볬ʱ
                headers: form.headers(),
                stream: form
            };
            that.request(url, opts, util.wrapper(callback));
        });
    }, arguments);
};
/**
 * ��ȡ��ʱ�ز�
 * @param mediaId
 * @param callback
 */
exports.getMedia = function (mediaId, callback) {
    this.preRequest(function (mediaId, callback) {
        var url='http://api.weixin.qq.com/cgi-bin/media/get?access_token=' + that.token.accessToken+ '&media_id=' + mediaId;
        var opts = {
            timeout: 60000 // 60�볬ʱ
        };
        this.request(url, opts, util.wrapper(function (err, data, res) {
            // handle some err
            if (err) {
                return callback(err);
            }
            var contentType = res.headers['content-type'];
            if (contentType === 'application/json') {
                var ret;
                try {
                    ret = JSON.parse(data);
                    if (ret.errcode) {
                        err = new Error(ret.errmsg);
                        err.name = 'Error';
                    }
                } catch (ex) {
                    callback(ex, data, res);
                    return;
                }
                callback(err, ret, res);
            } else {
                // ���Buffer����
                callback(null, data, res);
            }
        }));
    }, arguments);
};