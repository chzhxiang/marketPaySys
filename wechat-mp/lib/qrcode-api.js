/**
 * Created by Youhn on 2015/8/18.
 * API:http://mp.weixin.qq.com/wiki/18/28fc21e7ed87bec960651f0ce873ef8a.html
 */
var util = require('./util');
var CommonJSONGetSend=util.CommonJsonSend;
var CommonJSONPostSend=util.CommonJsonPostSend;
/**
 * 创建二维码
 * @param sceneId 场景值ID，临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000）
 * @param expireSeconds 该二维码有效时间，以秒为单位。 最大不超过604800（即7天）。0 时为永久二维码
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
 * 用字符串类型创建二维码
 * @param sceneStr  场景值ID，字符串形式的ID，字符串类型，长度限制为1到64，仅永久二维码支持此字段
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
 * 获取下载二维码的地址(通过ticket换取二维码)
 * @param ticket
 * @returns {string} 二维码的URL地址
 */
exports.showQRCodeURL = function (ticket) {
    return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
};