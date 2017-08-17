/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/17/304c1885ea66dbedf7dc170d84999a9d.html
 */
/**
 * ����������ҵ
 * @param industryId1 ���ں�ģ����Ϣ������ҵ���
 * @param industryId2 ���ں�ģ����Ϣ������ҵ���
 * @param callback
 */
exports.setIndustry = function(industryId1,industryId2, callback){
    var that=this;
    this.preRequest(function (industryIds, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=' + this.token.accessToken;
        var data= {
            "industry_id1":industryId1,
            "industry_id2":industryId2
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * ���ģ��ID
 * @param templateIdShort ģ�����ģ��ı�ţ��С�TM**���͡�OPENTMTM**������ʽ
 * @param callback
 */
exports.addTemplate = function(templateIdShort, callback){
    var that=this;
    this.preRequest(function (templateIdShort, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=' + this.token.accessToken;
        var data = {
            template_id_short: templateIdShort
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * ����ģ����Ϣ
 * @param openid
 * @param templateId  ģ��ID
 * @param url ���ģ����Ϣ��ת�����ӣ���Ϊ��
 * @param topColor ������ɫ
 * @param data
 * @param callback
 */
exports.sendTemplate = function (openid, templateId, url, topColor, data, callback) {
    var that=this;
    this.preRequest(function (openid, templateId, url, topColor, data, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + this.token.accessToken;
        var data = {
            touser: openid,
            template_id: templateId,
            url: url,
            topcolor: topColor,
            data: data
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};


/**
 * 获得模板列表
 * @param callback
 */
exports.getTemplateList = function(callback){
    var that=this;
    this.preRequest(function (callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,callback);
    }, arguments);
};


/**
 * 删除模板
 * @param template_id
 * @param callback
 */
exports.delTemplate = function(template_id, callback){
    var that=this;
    this.preRequest(function (template_id, callback) {
        var url ='https://api,weixin.qq.com/cgi-bin/template/del_private_template?access_token=' + this.token.accessToken;
        var data = {
            template_id: template_id
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};