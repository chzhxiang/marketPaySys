/**
 * Created by Youhn on 2015/8/21.
 * API:http://mp.weixin.qq.com/wiki/0/2ad4b6bfd29f30f71d39616c2a0fcedc.html
 */

/**
 * 获取微信服务器IP地址
 * @param callback
 */
exports.getWxIp = function (callback) {
    var that=this;
    this.preRequest(function (callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    }, arguments);
};