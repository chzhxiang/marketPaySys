/**
 * Created by Youhn on 2015/8/10.
 * API��ַ��http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html
 */

/**
 * �������� ���֧�ִ���100������
 * @param name �������֣�30���ַ����ڣ�
 * @param callback
 */
exports.createGroup = function (name, callback) {
    var that=this;
    this.preRequest(function (name, callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/groups/create?access_token=' + this.token.accessToken;
        var data = {
            "group": {"name": name}
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * ��ȡ�����б�
 * @param callback
 */
exports.getGroups = function (callback) {
    var that=this;
    this.preRequest(function(callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/groups/get?access_token='+this.token.accessToken;
        that.CommonJSONGetSend(url,callback)
    }, arguments);
};
/**
 * ��ѯ�û����ڷ���
 * @param openid
 * @param callback
 */
exports.getWhichGroup = function (openid, callback) {
    var that=this;
    this.preRequest(function (openid, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/groups/getid?access_token=' + this.token.accessToken;
        var data = {
            "openid": openid
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 *  �޸ķ�����
 * @param id ����id����΢�ŷ���
 * @param name �������֣�30���ַ����ڣ�
 * @param callback
 */
exports.updateGroup = function (id, name, callback) {
    var that=this;
    this.preRequest(function (id, name, callback) {
        var url = 'https://api.weixin.qq.com/cgi-bin/groups/update?access_token=' + this.token.accessToken;
        var data = {
            "group": {"id": id, "name": name}
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * �ƶ��û�����
 * @param openid
 * @param groupId������id
 * @param callback
 * @constructor
 */
exports.memberUpdateGroup = function (openid, groupId, callback) {
    var that=this;
    this.preRequest(function (openid, groupId, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=' + this.token.accessToken;
        var data = {
            "openid": openid,
            "to_groupid": groupId
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * �����ƶ��û�����
 * @param openIds �û�Ψһ��ʶ��openid���б�size���ܳ���50��
 * @param groupId ����id
 * @param callback
 */
exports.batchMemberUpdateGroup = function (openIds, groupId, callback) {
    var that=this;
    this.preRequest(function (openid, groupId, callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate?access_token=' + this.token.accessToken;
        var data = {
            "openid_list": openIds,
            "to_groupid": groupId
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
/**
 * ɾ������
 * @param groupId �����id
 * @param callback
 */
exports.removeGroup = function (groupId, callback) {
    var that=this;
    this.preRequest(function (groupId, callback) {
        var url = this.prefix + 'groups/delete?access_token=' + this.token.accessToken;
        var data = {
            "group": { id: groupId}
        };
        that.CommonJsonPostSend(url,data,callback);
    }, arguments);
};
