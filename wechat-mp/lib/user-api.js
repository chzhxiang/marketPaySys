/**
 * Created by Youhn on 2015/8/15.
 * http://mp.weixin.qq.com/wiki/0/d0e07720fc711c02a3eab6ec33054804.html
 */

/**
 * 获取用户信息
 * @param openid
 * @param lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
 * @param callback
 */
exports.info = function (openid,lang, callback) {
   var that=this;
    this.preRequest(function (openid,lang, callback) {
        if (typeof lang == 'function') {
            callback=lang;
            lang="zh_CN";
        }
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info?openid=' + openid + '&lang=' + (lang||"zh_CN") + '&access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    }, arguments);
};
/**
 *批量获取用户基本信息
 *　post数据格式：
 * options={
 *  "user_list": [
 *       {
 *          "openid": "otvxTs4dckWG7imySrJd6jSi0CWE",
 *         "lang": "zh-CN"
 *     },
 *     {
 *         "openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg",
 *         "lang": "zh-CN"
 *      }
 *  ]
 *}
 * @param options openid列表　最多支持一次拉取100条
 * @param callback
 */
exports.batchgetuserinfo = function (options, callback) {
    var that=this;
    this.preRequest(function(options,callback){
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,options,callback)
    }, arguments);
};
/**
 * 获取关注者OpenId信息
 * @param nextOpenid 第一个拉取的OPENID，不填默认从头开始拉取
 * @param callback
 */
exports.get = function (nextOpenid, callback) {
    var that=this;
    this.preRequest(function(nextOpenid,callback){
        if (typeof nextOpenid === 'function') {
            callback = nextOpenid;
            nextOpenid = '';
        }
        var url ='https://api.weixin.qq.com/cgi-bin/user/get?next_openid=' + nextOpenid + '&access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback);
    }, arguments);
};
/**
 * 修改关注者备注信息
 * @param openid
 * @param remark
 * @param callback
 */
exports.updateRemark = function (openid, remark, callback) {
    var that=this;
    this.preRequest(function (openid, remark, callback){
        var data = {
            openid: openid,
            remark: remark
        };
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,data,callback)
    }, arguments);
};