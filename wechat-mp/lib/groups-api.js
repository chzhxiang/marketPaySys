/**
 * Created by Youhn on 2015/8/10.
 * API地址：http://mp.weixin.qq.com/wiki/0/56d992c605a97245eb7e617854b169fc.html
 */

/**
 * 创建分组 最多支持创建100个分组
 * @param name 分组名字（30个字符以内）
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
 * 获取分组列表
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
 * 查询用户所在分组
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
 *  修改分组名
 * @param id 分组id，由微信分配
 * @param name 分组名字（30个字符以内）
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
 * 移动用户分组
 * @param openid
 * @param groupId　分组id
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
 * 批量移动用户分组
 * @param openIds 用户唯一标识符openid的列表（size不能超过50）
 * @param groupId 分组id
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
 * 删除分组
 * @param groupId 分组的id
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
