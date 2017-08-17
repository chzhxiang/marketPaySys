/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/10/165c9b15eddcfbd8699ac12b0bd89ae6.html
 */
/**
 * ������ת�ɶ�����
 * @param longUrl
 * @param callback
 */
exports.shortUrl = function (longUrl, callback) {
    var that=this;
    this.preRequest(function (longUrl, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/shorturl?access_token=' + this.token.accessToken;
        var data = {
            "action": "long2short",
            "long_url": longUrl
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};