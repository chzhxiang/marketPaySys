/**
 * Created by Youhn on 2015/8/16.
 */
var WeChatAPI = require('./lib/common-api');
//客服消息管理
WeChatAPI.mixin(require('./lib/custom-api'));
//客服管理
WeChatAPI.mixin(require('./lib/custom-service-api'));
//分组管理
WeChatAPI.mixin(require('./lib/groups-api'));
//菜单管理
WeChatAPI.mixin(require('./lib/menu-api'));
//用户管理
WeChatAPI.mixin(require('./lib/user-api'));
//数据统计分析管理
WeChatAPI.mixin(require('./lib/data-analysis-api'));
//群发消息管理
WeChatAPI.mixin(require('./lib/mass-message-api'));
//临时素材管理
WeChatAPI.mixin(require('./lib/media-api'));
//永久素材管理
WeChatAPI.mixin(require('./lib/material-api'));
//二维码管理
WeChatAPI.mixin(require('./lib/qrcode-api'));
//短链接管理
WeChatAPI.mixin(require('./lib/short-url-api'));
//模板消息管理
WeChatAPI.mixin(require('./lib/template-message-api'));
//微信IP地址管理
WeChatAPI.mixin(require('./lib/wxip-api'));

module.exports = WeChatAPI;