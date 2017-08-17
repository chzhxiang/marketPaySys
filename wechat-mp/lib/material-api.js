/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html
 */
var util = require('./util');
var path = require('path');
var fs = require('fs');

var formstream = require('formstream');
/**
 * 上传图文消息内的图片获取URL
 * @param filepath 图片仅支持jpg/png格式，大小必须在1MB以下。
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
                timeout: 60000, // 60秒超时
                headers: form.headers(),
                stream: form
            };
            this.request(url, opts, util.wrapper(callback));
        });
    }, arguments);
};
/**
 * 新增永久图文素材
 * @param news 图文消息组
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
 *新增其他类型永久素材(图片（image）、语音（voice）和缩略图（thumb）)
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
                timeout: 60000, // 60秒超时
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
 * 新增永久视频素材
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
                timeout: 60000, // 60秒超时
                headers: form.headers(),
                stream: form
            };
            that.request(url, opts, util.wrapper(callback));
        });
    }, arguments);
};
/**
 * 获取永久图文素材
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
        opts.timeout = 60000; // 60秒超时
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
                // 输出Buffer对象
                callback(null, data, res);
            }
        }));
    }, arguments);
};
/**
 *  删除永久素材
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
 * 修改永久图文素材
 * @param mediaId 要修改的图文消息的id
 * @param index 要更新的文章在图文消息中的位置（多图文消息时，此字段才有意义），第一篇为0
 * @param news 图文素材
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
 * 获取素材总数
 * 永久素材的总数，也会计算公众平台官网素材管理中的素材
 * 图片和图文消息素材（包括单图文和多图文）的总数上限为5000，其他素材的总数上限为1000
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
 * 获取图文素材列表
 * @param type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
 * @param offset 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
 * @param count 返回素材的数量，取值在1到20之间
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