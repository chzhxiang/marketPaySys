/**
 * Created by Youhn on 2015/8/18.
 * API:http://mp.weixin.qq.com/wiki/18/28fc21e7ed87bec960651f0ce873ef8a.html
 */
var util = require('./util');
var CommonJSONGetSend=util.CommonJsonSend;
var CommonJSONPostSend=util.CommonJsonPostSend;
/**
 * ������ά��
 * @param sceneId ����ֵID����ʱ��ά��ʱΪ32λ��0���ͣ����ö�ά��ʱ���ֵΪ100000��Ŀǰ����ֻ֧��1--100000��
 * @param expireSeconds �ö�ά����Чʱ�䣬����Ϊ��λ�� ��󲻳���604800����7�죩��0 ʱΪ���ö�ά��
 * @param callback
 */
exports.createQRCode = function (sceneId, expireSeconds, callback) {
    var that=this;
    this.preRequest(function(sceneId,expireSeconds,callback){
        var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + this.token.accessToken;
        var data = null;
        if(expireSeconds>0){
            data={
                "expire_seconds": expireSeconds,
                "action_name": "QR_SCENE",
                "action_info": {"scene": {"scene_id": sceneId}}
            };
        }else{
            data = {
                "action_name": "QR_LIMIT_SCENE",
                "action_info": {"scene": {"scene_id": sceneId}}
            };
        }
        that.CommonJsonPostSend(url,data,callback)
    }, arguments);
};
/**
 * ���ַ������ʹ�����ά��
 * @param sceneStr  ����ֵID���ַ�����ʽ��ID���ַ������ͣ���������Ϊ1��64�������ö�ά��֧�ִ��ֶ�
 * @param callback
 */
exports.createQRCodeByStr = function (sceneStr, callback) {
    var that=this;
    this.preRequest(function(sceneStr,callback){
        var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + this.token.accessToken;
        var data = {
            "action_name": "QR_LIMIT_STR_SCENE",
            "action_info": {"scene": {"scene_str": sceneStr}}
        };
        that.CommonJsonPostSend(url,data,callback)
    }, arguments);
};
/**
 * ��ȡ���ض�ά��ĵ�ַ(ͨ��ticket��ȡ��ά��)
 * @param ticket
 * @returns {string} ��ά���URL��ַ
 */
exports.showQRCodeURL = function (ticket) {
    return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
};