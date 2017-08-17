/**
 * Created by Youhn on 2015/9/20.
 */
var WXPayAPI = require('./tenpaylib/tenpayv3');

WXPayAPI.mix('Util', require('./tenpaylib/util'));

module.exports = WXPayAPI;