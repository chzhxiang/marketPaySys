/**
 * Created by Youhn on 2015/8/21.
 * API:http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html
 */
var util = require('./util');
/**
 * 上传图文消息内的图片获取URL
 * @param filepath 图片仅支持jpg/png格式，大小必须在1MB以下。
 * @param callback
 */
exports.uploadImg = function (filepath, callback) {
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
 * 上传图文消息素材
 * @param news 图文消息组
 * @param callback
 */
exports.uploadTemporaryNews = function (news, callback) {
    var that=this;
    this.preRequest(function (news, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=' + this.token.accessToken;
        var data={
            "articles":news
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * 上传视频消息
 * Opts:
 * ```
 * {
 *  "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
 *  "title": "TITLE",
 *  "description": "Description"
 * }
 * ```
 * Result:
 * ```
 * {
 *  "type":"video",
 *  "media_id":"IhdaAQXuvJtGzwwc0abfXnzeezfO0NgPK6AQYShD8RQYMTtfzbLdBIQkQziv2XJc",
 *  "created_at":1391857799
 * }
 * ```
 * @param {Object} opts 此处media_id需通过基础支持中的上传下载多媒体文件来得到(media-api.js)
 * @param {Function} callback
 */
exports.uploadMPVideo = function (opts, callback) {
    var that=this;
    this.preRequest(function (opts, callback) {
        var url ='https://file.api.weixin.qq.com/cgi-bin/media/uploadvideo?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,opts,callback);
    }, arguments);
};
/**
 * 根据GroupId进行群发文本信息【订阅号与服务号认证后均可用】
 * @param mediaIdOrContent 用于群发的消息的media_id或者文本消息Content
 * @param type 群发的消息类型，图文消息为mpnews，文本消息为text，语音为voice，图片为image，视频为mpvideo，卡券为wxcard(卡券待验证，保留类型)
 * @param groupIdOrIsToAll 群发到的分组的group_id，参加用户管理中用户分组接口，若is_to_all值为true，可不填写group_id
 * @param callback
 */
exports.massSendByGroupId = function (mediaIdOrContent,type,groupIdOrIsToAll, callback) {
    var that=this;
    this.preRequest(function (mediaIdOrContent,type,groupIdOrIsToAll, callback) {
        var opts=null,filter,
            url ='https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=' + this.token.accessToken;
            if (typeof groupIdOrIsToAll === 'boolean') {
                filter={
                    "is_to_all": groupIdOrIsToAll
                };
            } else {
                filter = {
                    "group_id": groupIdOrIsToAll
                };
            }
        switch(type){
            case "mpnews":
                opts={
                    "filter":filter,
                    "mpnews":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"mpnews"
                };
                break;
            case "text":
                opts= {
                    "filter": filter,
                    "text":{
                        "content":mediaIdOrContent
                    },
                    "msgtype":"text"
                };
                break;
            case "image":
                opts={
                    "filter":filter,
                    "image":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"image"
                };
                break;
            case "voice":
                opts={
                    "filter":filter,
                    "voice":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"voice"
                };
                break;
            case "mpvideo":
                opts={
                    "filter":filter,
                    "mpvideo":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"mpvideo"
                };
                break;
            case "wxcard":
                opts={
                    "filter":filter,
                    "wxcard":{
                        "card_id":mediaIdOrContent
                    },
                    "msgtype":"wxcard"
                };
                break;
            default :
                break;
        }
        that.CommonJsonPostSend(url,opts,callback);
    }, arguments);
};
/**
 * 根据OpenId进行群发 【订阅号不可用，服务号认证后可用】
 * @param mediaIdOrContent mediaIdOrContent 用于群发的消息的media_id或者文本消息Content
 * @param type 群发的消息类型，图文消息为mpnews，文本消息为text，语音为voice，图片为image，视频为mpvideo，卡券为wxcard(卡券待验证，保留类型)
 * @param openIds openId字符串数组，OpenID最少2个，最多10000个
 * @param callback
 */
exports.massSendByOpenId = function (mediaIdOrContent,type,openIds, callback) {
    var that=this;
    this.preRequest(function (mediaIdOrContent,type,openIds, callback) {
        var opts=null,
            url ='https://api.weixin.qq.com/cgi-bin/message/mass/send?access_token=' + this.token.accessToken;
        switch(type){
            case "mpnews":
                opts={
                    "touser": openids,
                    "mpnews":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"mpnews"
                };
                break;
            case "text":
                opts= {
                    "touser": openids,
                    "text":{
                        "content":mediaIdOrContent
                    },
                    "msgtype":"text"
                };
                break;
            case "image":
                opts={
                    "touser": openids,
                    "image":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"image"
                };
                break;
            case "voice":
                opts={
                    "touser": openids,
                    "voice":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"voice"
                };
                break;
            case "mpvideo":
                opts={
                    "touser": openids,
                    "mpvideo":{
                        "media_id":mediaIdOrContent
                    },
                    "msgtype":"mpvideo"
                };
                break;
            case "wxcard":
                opts={
                    "touser": openids,
                    "wxcard":{
                        "card_id":mediaIdOrContent
                    },
                    "msgtype":"wxcard"
                };
                break;
            default :
                break;
        }
        that.CommonJsonPostSend(url,opts,callback);
    }, arguments);
};
/**
 * 群发视频（video）消息，（自动生成素材）
 * @param mediaId 基础支持中的上传下载多媒体文件得到media id
 * @param {String|boolean|Array}receives 一个群组group_id，或者IsToAll(boolean),或者openid字符数组
 * @param callback
 */
exports.massSendMPVideo=function(mediaId,receives,callback){
    var that=this;
    this.uploadMPVideo(data, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (Array.isArray(receivers)) {
            that.massSendByOpenId(result.media_id,"mpvideo",receives,callback);
        } else {
            that.massSendByGroupId(result.media_id,"mpvideo",receives,callback);
        }
    });
};
/**
 * 删除群发【订阅号与服务号认证后均可用】
 * @param msgId 发送出去的消息ID
 * @param callback
 */
exports.deleteMassSend = function (msgId, callback) {
    var that=this;
    this.preRequest(function (msgId, callback) {
        var opts = {
            msg_id: msgId
        };
        var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/delete?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,opts,callback);
    }, arguments);
};
/****************************************************/
//预览接口【订阅号与服务号认证后均可用】
/****************************************************/
/**
 *　预览接口
 * @param openid  接收消息用户对应该公众号的openid,或者用户微信号
 * @param type　群发的消息类型，图文消息为mpnews，文本消息为text，语音为voice，图片为image，视频为mpvideo
 * @param mediaId　用于群发的消息的media_id，或者发送文本消息时文本的内容
 * @param callback
 */
exports.massSendPreview = function (openid,type, mediaId, callback) {
    var that=this;
    this.preRequest(function (openid,type,mediaId, callback) {
        var opts = null,wxId=openid,
            url = 'https://api.weixin.qq.com/cgi-bin/message/mass/send?access_token=' + this.token.accessToken;
        if(openid.length>=28){
            wxId="";
        }
        switch (type) {
            case "mpnews":
                opts = {
                    "towxname":wxId,
                    "touser": openid,
                    "mpnews": {
                        "media_id": mediaId
                    },
                    "msgtype": "mpnews"
                };
                break;
            case "text":
                opts = {
                    "towxname":wxId,
                    "touser": openid,
                    "text": {
                        "content": mediaId
                    },
                    "msgtype": "text"
                };
                break;
            case "image":
                opts = {
                    "towxname":wxId,
                    "touser": openid,
                    "image": {
                        "media_id": mediaId
                    },
                    "msgtype": "image"
                };
                break;
            case "voice":
                opts = {
                    "towxname":wxId,
                    "touser": openid,
                    "voice": {
                        "media_id": mediaId
                    },
                    "msgtype": "voice"
                };
                break;
            case "mpvideo":
                opts = {
                    "towxname":wxId,
                    "touser": openid,
                    "mpvideo": {
                        "media_id": mediaId
                    },
                    "msgtype": "mpvideo"
                };
                break;
            default :
                break;
        }
        that.CommonJsonPostSend(url, opts, callback);
    }, arguments);
};
/**
 * 查询群发消息发送状态
 * @param msgId 群发消息后返回的消息id
 * @param callback
 */
exports.getMassResult = function (msgId, callback) {
    var that=this;
    this.preRequest(function (msgId, callback) {
        var opts = {
            "msg_id": msgId
        };
        var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/get?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url, opts, callback);
    }, arguments);
};