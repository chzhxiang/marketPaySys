/**
 * Created by Youhn on 2015/8/22.
 * API:http://mp.weixin.qq.com/wiki/3/ecfed6e1a0a03b5f35e5efac98e864b7.html
 */
var util = require('./util');
var methods = [
    // 用户分析数据接口
    'getUserSummary', // 获取用户增减数据
    'getUserCumulate', // 获取累计用户数据
    // 图文分析数据接口
    'getArticleSummary', // 获取图文群发每日数据
    'getArticleTotal', // 获取图文群发总数据
    'getUserRead', // 获取图文统计数据
    'getUserReadHour', // 获取图文统计分时数据
    'getUserShare', // 获取图文分享转发数据
    'getUserShareHour', // 获取图文分享转发分时数据
    // 消息分析数据接口
    'getUpstreamMsg', //获取消息发送概况数据
    'getUpstreamMsgHour', // 获取消息分送分时数据
    'getUpstreamMsgWeek', // 获取消息发送周数据
    'getUpstreamMsgMonth', // 获取消息发送月数据
    'getUpstreamMsgDist', // 获取消息发送分布数据
    'getUpstreamMsgDistWeek', // 获取消息发送分布周数据
    'getUpstreamMsgDistMonth', // 获取消息发送分布月数据
    // 接口分析数据接口
    'getInterfaceSummary', // 获取接口分析数据
    'getInterfaceSummaryHour' // 获取接口分析分时数据
];
/**
 * // 用户分析数据接口
 * api.getUserSummary(startDate, endDate, callback); // 获取用户增减数据
 * api.getUserCumulate(startDate, endDate, callback); // 获取累计用户数据
 * // 图文分析数据接口
 * api.getArticleSummary(startDate, endDate, callback); // 获取图文群发每日数据
 * api.getArticleTotal(startDate, endDate, callback); // 获取图文群发总数据
 * api.getUserRead(startDate, endDate, callback); // 获取图文统计数据
 * api.getUserReadHour(startDate, endDate, callback); // 获取图文统计分时数据
 * api.getUserShare(startDate, endDate, callback); // 获取图文分享转发数据
 * api.getUserShareHour(startDate, endDate, callback); // 获取图文分享转发分时数据
 * // 消息分析数据接口
 * api.getUpstreamMsg(startDate, endDate, callback); // 获取消息发送概况数据
 * api.getUpstreamMsgHour(startDate, endDate, callback); // 获取消息分送分时数据
 * api.getUpstreamMsgWeek(startDate, endDate, callback); // 获取消息发送周数据
 * api.getUpstreamMsgMonth(startDate, endDate, callback); // 获取消息发送月数据
 * api.getUpstreamMsgDist(startDate, endDate, callback); // 获取消息发送分布数据
 * api.getUpstreamMsgDistWeek(startDate, endDate, callback); // 获取消息发送分布周数据
 * api.getUpstreamMsgDistMonth(startDate, endDate, callback); // 获取消息发送分布月数据
 * // 接口分析数据接口
 * api.getInterfaceSummary(startDate, endDate, callback); // 获取接口分析数据
 * api.getInterfaceSummaryHour(startDate, endDate, callback); // 获取接口分析分时数据
 */
methods.forEach(function (method) {
    exports[method] = function (begin, end, callback) {
        var that=this;
        this.preRequest(function (begin, end, callback) {
            var data = {
                begin_date: begin,
                end_date: end
            };
            var url = 'https://api.weixin.qq.com/datacube/' + method.toLowerCase() + '?access_token=' + this.token.accessToken;
            that.request(url, util.postJSON(data), util.wrapper(callback));
        }, arguments);
    };
});