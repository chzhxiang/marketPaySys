/**
 * Created by Youhn on 2015/8/9.
 */
/*!
 * 对返回结果的一层封装，如果遇见微信返回的错误，将返回一个错误
 * 参见：http://mp.weixin.qq.com/wiki/index.php?title=返回码说明
 */
var crypto = require('crypto');
var xml2js = require('xml2js');
exports.wrapper = function (callback) {
  return function (err, data, res) {
    callback = callback || function () {};
    if (err) {
      return callback(err, data, res);
    }
    if (data && data.errcode) {
      err = new Error(data.errmsg);
      err.name = 'error';
      err.code = data.errcode;
      return callback(err, data, res);
    }
    callback(null, data, res);
  };
};
/*!
 * 对提交参数一层封装，当POST JSON，并且结果也为JSON时使用
 */
exports.postJSON = function (data) {
  return {
    dataType: 'json',
    type: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

exports.make = function (host, name, fn) {
  host[name] = function () {
    this.preRequest(this['_' + name], arguments);
  };
  host['_' + name] = fn;
};
/**
 * MD5加密
 * @param input
 * @returns {*}
 */
exports.md5 = function (input) {
  var hash = crypto.createHash('md5');
  return hash.update(input).digest('hex');
};
exports.buildXML = function(json){
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
};

exports.parseXML = function(xml, fn){
  var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
  parser.parseString(xml, fn||function(err, result){});
};

exports.pipe = function(stream, fn){
  var buffers = [];
  stream.on('data', function (trunk) {
    buffers.push(trunk);
  });
  stream.on('end', function () {
    fn(null, Buffer.concat(buffers));
  });
  stream.once('error', fn);
};

exports.mix = function(){
  var root = arguments[0];
  if (arguments.length==1) { return root; }
  for (var i=1; i<arguments.length; i++) {
    for(var k in arguments[i]) {
      root[k] = arguments[i][k];
    }
  }
  return root;
};

exports.GetNoncestr = function(){
  return Math.random().toString(36).substr(2, 32);
};
exports.GetTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

