/**
 * Created by Youhn on 2015/8/21.
 * API:http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html
 */
var util = require('./util');
/**
 * �ϴ�ͼ����Ϣ�ڵ�ͼƬ��ȡURL
 * @param filepath ͼƬ��֧��jpg/png��ʽ����С������1MB���¡�
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
                timeout: 60000, // 60�볬ʱ
                headers: form.headers(),
                stream: form
            };
            this.request(url, opts, util.wrapper(callback));
        });
    }, arguments);
};
/**
 * �ϴ�ͼ����Ϣ�ز�
 * @param news ͼ����Ϣ��
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
 * �ϴ���Ƶ��Ϣ
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
 * @param {Object} opts �˴�media_id��ͨ������֧���е��ϴ����ض�ý���ļ����õ�(media-api.js)
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
 * ����GroupId����Ⱥ���ı���Ϣ�����ĺ���������֤������á�
 * @param mediaIdOrContent ����Ⱥ������Ϣ��media_id�����ı���ϢContent
 * @param type Ⱥ������Ϣ���ͣ�ͼ����ϢΪmpnews���ı���ϢΪtext������Ϊvoice��ͼƬΪimage����ƵΪmpvideo����ȯΪwxcard(��ȯ����֤����������)
 * @param groupIdOrIsToAll Ⱥ�����ķ����group_id���μ��û��������û�����ӿڣ���is_to_allֵΪtrue���ɲ���дgroup_id
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
 * ����OpenId����Ⱥ�� �����ĺŲ����ã��������֤����á�
 * @param mediaIdOrContent mediaIdOrContent ����Ⱥ������Ϣ��media_id�����ı���ϢContent
 * @param type Ⱥ������Ϣ���ͣ�ͼ����ϢΪmpnews���ı���ϢΪtext������Ϊvoice��ͼƬΪimage����ƵΪmpvideo����ȯΪwxcard(��ȯ����֤����������)
 * @param openIds openId�ַ������飬OpenID����2�������10000��
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
 * Ⱥ����Ƶ��video����Ϣ�����Զ������زģ�
 * @param mediaId ����֧���е��ϴ����ض�ý���ļ��õ�media id
 * @param {String|boolean|Array}receives һ��Ⱥ��group_id������IsToAll(boolean),����openid�ַ�����
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
 * ɾ��Ⱥ�������ĺ���������֤������á�
 * @param msgId ���ͳ�ȥ����ϢID
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
//Ԥ���ӿڡ����ĺ���������֤������á�
/****************************************************/
/**
 *��Ԥ���ӿ�
 * @param openid  ������Ϣ�û���Ӧ�ù��ںŵ�openid,�����û�΢�ź�
 * @param type��Ⱥ������Ϣ���ͣ�ͼ����ϢΪmpnews���ı���ϢΪtext������Ϊvoice��ͼƬΪimage����ƵΪmpvideo
 * @param mediaId������Ⱥ������Ϣ��media_id�����߷����ı���Ϣʱ�ı�������
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
 * ��ѯȺ����Ϣ����״̬
 * @param msgId Ⱥ����Ϣ�󷵻ص���Ϣid
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