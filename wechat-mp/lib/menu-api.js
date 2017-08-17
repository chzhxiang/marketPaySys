/**
 * Created by Youhn on 2015/8/14.
 */

/**
 *  创建自定义菜单
 * @param {Object} menu 菜单对象
 * @param {Function} callback
 */
exports.createMenu = function (menu, callback) {
    var that=this;
    this.preRequest(function(menu,callback){
        var url ='https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + this.token.accessToken;
        that.CommonJsonPostSend(url,menu,callback)
    }, arguments);
};
/**
 * 获取当前菜单
 * @param callback
 */
exports.getMenu = function (callback) {
    var that=this;
    this.preRequest(function(callback){
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback)
    }, arguments);
};
/**
 * 删除菜单
 * @param callback
 */
exports.deleteMenu = function (callback) {
    var that=this;
    this.preRequest(function(callback){
        var url='https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=' + this.token.accessToken;
        that.CommonJsonGetSend(url,callback)
    }, arguments);
};
/**
 * 获取自定义菜单配置接口
 * @param callback
 */
exports.getMenuConfig = function (callback) {
    var that=this;
    this.preRequest(function (callback) {
        var url ='https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=' + this.token.accessToken;
        that.CommonJSONGetSend(url,callback)
    }, arguments);
};