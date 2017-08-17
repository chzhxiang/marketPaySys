/**
 * Created by Youhn on 2015/8/17.
 * API��ַ��http://mp.weixin.qq.com/wiki/1/70a29afed17f56d537c833f89be979c9.html
 */
const URL_FORMAT='https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=';
/**
 * �����ı���Ϣ
 * @param openid
 * @param text
 * @param callback
 */
exports.sendText = function (openid, text,callback) {
    var that=this;
    this.preRequest(function(openid,text,callback){
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype": "text",
            "text": {
                "content": text
            }
        };
        that.CommonJsonPostSend(url,data,callback)
    }, arguments);
};
/**
 * ����ͼƬ��Ϣ
 * @param openid
 * @param mediaId ���͵�ͼƬý��ID
 * @param callback
 * @constructor
 */
exports.SendImage = function (openid, mediaId, callback) {
    var that=this;
    this.preRequest(function (openid, mediaId, callback) {
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype": "image",
            "image": {
                "media_id": mediaId
            }
        }
        that.CommonJsonPostSend(url,data,callback)
        }, arguments);



};
/**
 * ����������Ϣ
 * @param openid
 * @param mediaId ������ý��ID
 * @param callback
 * @constructor
 */
exports.SendVoice = function (openid, mediaId, callback) {
   var that=this;
    this.preRequest(function (openid, mediaId, callback) {
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype": "voice",
            "voice": {
                "media_id": mediaId
            }
        }
        that.CommonJsonPostSend(url,data,callback)
        }, arguments);
};
/**
 * ������Ƶ��Ϣ
 * @param openid
 * @param mediaId ��Ƶ��ý��ID
 * @param thumbMediaId ����ͼ��ý��ID
 * @param title ����
 * @param description ��Ϣ������
 * @param callback
 * @constructor
 */
exports.SendVideo = function (openid, mediaId,thumbMediaId,title,description, callback) {
    var that=this;
    this.preRequest(function (openid, mediaId,thumbMediaId,title,description, callback) {
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype": "video",
            "video": {
                "media_id": mediaId,
                "thumb_media_id": thumbMediaI,
                "title": title,
                "description": description
            }
        }
        that.CommonJsonPostSend(url,data,callback);
        }, arguments);
};
/**
 *����������Ϣ
 * @param openid
 * @param title ���ֱ��⣨�Ǳ��룩
 * @param description �����������Ǳ��룩
 * @param musicUrl ��������
 * @param hqMusicUrl ��Ʒ���������ӣ�wifi��������ʹ�ø����Ӳ�������
 * @param thumbMediaId ��Ƶ����ͼ��ý��ID
 * @param callback
 */
exports.sendMusic = function (openid, title,description,musicUrl,hqMusicUrl,thumbMediaId, callback) {
   var that=this;
    this.preRequest(function (openid, title,description,musicUrl,hqMusicUrl,thumbMediaId, callback) {
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype": "music",
            "music": music
        }
        that.CommonJsonPostSend(url,data,callback);
        }, arguments);
};
/*!
 *����ͼ����Ϣ ͼ����Ϣ����������10�����ڣ�ע�⣬���ͼ��������10���򽫻�����Ӧ��
 * @param openid
 * @param {Objects} articles
 * @param callback
 * @constructor
 *
 * {
 *  "touser":"OPENID",
 *    "msgtype":"news",
 *    "news":{
 *       "articles": [
 *        {
 *           "title":"Happy Day",
 *           "description":"Is Really A Happy Day",
 *           "url":"URL",  //ͼ����Ϣ���������ת������
 *           "picurl":"PIC_URL" //ͼ����Ϣ��ͼƬ���ӣ�֧��JPG��PNG��ʽ���Ϻõ�Ч��Ϊ��ͼ640*320��Сͼ80*80
 *     },
 *       {
 *            "title":"Happy Day",
 *            "description":"Is Really A Happy Day",
 *            "url":"URL",
 *            "picurl":"PIC_URL"
 *       }
 *       ]
 *   }
 *}
 */
exports.sendNews = function (openid, articles, callback) {
    var that=this;
    this.preRequest(function (openid, articles, callback) {
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype":"news",
            "news": {
                "articles": articles
            }
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/*!
 * ���Ϳ�ȯ
 * @param openid
 * @param cardid
 * @param {Object}cardtext
 * @param callback
 * @constructor
 * {
 * "touser":"OPENID",
 *"msgtype":"wxcard",
 * "wxcard":{
 *          "card_id":"123dsdajkasd231jhksad",
 *          "card_ext": "{\"code\":\"\",\"openid\":\"\",\"timestamp\":\"1402057159\",\"signature\":\"017bb17407c8e0058a66d72dcc61632b70f511ad\"}"
 *           },
 *}
 */
exports.sendCard = function (openid, cardid,cardtext, callback) {
    var that=this;
    this.preRequest(function(openid, cardid,cardtext, callback){
        var url = URL_FORMAT + this.token.accessToken;
        var data = {
            "touser": openid,
            "msgtype":"news",
            "wxcard": {
                "card_id":cardid,
                "card_ext": cardtext
            }
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
