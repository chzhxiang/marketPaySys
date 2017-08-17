/**
 * Created by Youhn on 2015/8/15.
 * http://mp.weixin.qq.com/wiki/0/d0e07720fc711c02a3eab6ec33054804.html
 */

/**
 * ��ȡ�û���Ϣ
 * @param openid
 * @param lang ���ع��ҵ������԰汾��zh_CN ���壬zh_TW ���壬en Ӣ��
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
 *������ȡ�û�������Ϣ
 *��post���ݸ�ʽ��
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
 * @param options openid�б����֧��һ����ȡ100��
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
 * ��ȡ��ע��OpenId��Ϣ
 * @param nextOpenid ��һ����ȡ��OPENID������Ĭ�ϴ�ͷ��ʼ��ȡ
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
 * �޸Ĺ�ע�߱�ע��Ϣ
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