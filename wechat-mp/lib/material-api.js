/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html
 */
var util = require('./util');
var path = require('path');
var fs = require('fs');

var formstream = require('formstream');
/**
 * �ϴ�ͼ����Ϣ�ڵ�ͼƬ��ȡURL
 * @param filepath ͼƬ��֧��jpg/png��ʽ����С������1MB���¡�
 * @param callback
 */
exports.uploadForeverImg = function (filepath, callback) {
    var that=this;
    this.preRequest(function (filepath, callback) {
        fs.stat(filepath, function (err, stat) {
            if (err) {
                return callback(err);
            }
            var form = formstream();
            form.file('media', filepath, path.basename(filepath), stat.size);
            var url ='https://api.weixin.qq.com/cgi-bin/media/uploadimg??access_token=' + this.token.accessToken;
            var opts = {
                dataType: 'json',
                type: 'POST',
                timeout: 60000, // 60�볬ʱ
                headers: form.headers(),
                stream: form
            };
            this.request(url, opts, util.wrapper(callback));
        });
    }, arguments);
};
/**
 * ��������ͼ���ز�
 * @param news ͼ����Ϣ��
 * @param callback
 * @constructor
 */
exports.UploadNews = function (news, callback) {
    var that=this;
    this.preRequest(function (news, callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=' + this.token.accessToken;
        var data= {
            "articles":news
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};

/**
 *�����������������ز�(ͼƬ��image����������voice��������ͼ��thumb��)
 * @param filepath
 * @param type
 * @param callback
 */
exports.uploadForeverMedia = function (filepath, type, callback) {
    this.preRequest(function (filepath, type, callback) {
        var that=this;
        fs.stat(filepath, function (err, stat) {
            if (err) {
                return callback(err);
            }
            var form = formstream();
            form.file('media', filepath, path.basename(filepath), stat.size);
            var url = 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=' + that.token.accessToken + '&type=' + type;
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
['image', 'voice', 'thumb'].forEach(function (type) {
    var method = 'upload' + type[0].toUpperCase() + type.substring(1) + 'Material';
    exports[method] = function (filepath, callback) {
        this.uploadForeverMedia(filepath, type, callback);
    };
});
/**
 * ����������Ƶ�ز�
 * @param filepath
 * @param title
 * @param introduction
 * @param callback
 */
exports.uploadForeverVideo = function (filepath,title, introduction, callback) {
    this.preRequest(function (filepath, description, callback) {
        var that = this;
        fs.stat(filepath, function (err, stat) {
            if (err) {
                return callback(err);
            }
            var description={
                "title":title,
                "introduction":introduction
            };
            var form = formstream();
            form.file('media', filepath, path.basename(filepath), stat.size);
            form.field('description', description);
            var url ='https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=' + that.token.accessToken + '&type=video';
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
 * ��ȡ����ͼ���ز�
 * @param mediaId
 * @param callback
 */
exports.getForeverNews = function (mediaId, callback) {
    this.preRequest(function (mediaId, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=' + this.token.accessToken;
        var opts = {
            type: 'POST',
            data: {'media_id': mediaId},
            headers: {
                'Content-Type': 'application/json'
            }
        };
        opts.timeout = 60000; // 60�볬ʱ
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
                        err.name = 'APIError';
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
/**
 *  ɾ�������ز�
 * @param mediaId
 * @param callback
 * @constructor
 */
exports.DeleteForeverMedia = function (mediaId, callback) {
    var that=this;
    this.preRequest(function (mediaId, callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/material/del_material?access_token=' + this.token.accessToken;
        var data={'media_id': mediaId};
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * �޸�����ͼ���ز�
 * @param mediaId Ҫ�޸ĵ�ͼ����Ϣ��id
 * @param index Ҫ���µ�������ͼ����Ϣ�е�λ�ã���ͼ����Ϣʱ�����ֶβ������壩����һƪΪ0
 * @param news ͼ���ز�
 * @param callback
 */
exports.UpdateForeverNews = function (mediaId,index,news, callback) {
    var that=this;
    this.preRequest(function (mediaId,index,news, callback){
        var url='https://api.weixin.qq.com/cgi-bin/material/update_news?access_token='+ this.token.accessToken;
        var data={
            "media_id":mediaId,
            "index":index,
            "articles":news
        }
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * ��ȡ�ز�����
 * �����زĵ�������Ҳ����㹫��ƽ̨�����زĹ����е��ز�
 * ͼƬ��ͼ����Ϣ�زģ�������ͼ�ĺͶ�ͼ�ģ�����������Ϊ5000�������زĵ���������Ϊ1000
 * @param callback
 */
exports.getMaterialCount = function (callback) {
    var that=this;
    this.preRequest(function (callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    }, arguments);
};
/**
 * ��ȡͼ���ز��б�
 * @param type �زĵ����ͣ�ͼƬ��image������Ƶ��video�������� ��voice����ͼ�ģ�news��
 * @param offset ��ȫ���زĵĸ�ƫ��λ�ÿ�ʼ���أ�0��ʾ�ӵ�һ���ز� ����
 * @param count �����زĵ�������ȡֵ��1��20֮��
 * @param callback
 */
exports.getMaterials = function (type, offset, count, callback) {
    var that=this;
    this.preRequest(function (type, offset, count, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=' + this.token.accessToken;
        var data = {
            type: type,
            offset: offset,
            count: count
        };
       that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};