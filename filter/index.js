var jwt = require('jsonwebtoken');
var UnauthorizedError = require('./errors/UnauthorizedError');
var reqParam = require('../config/requestParam.json');
var _ = require("lodash");

module.exports = function (options) {
    if (!options || !options.secret) throw new Error('secret should be set');


    return function (req, res, next) {
        var token;
        Array.minus = function (a, b) {
            return a.uniquelize().each(function (o) {
                return b.contains(o) ? null : o
            });
        };
        if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
            for (var ctrlReqs = req.headers['access-control-request-headers'].split(','), i = 0;
                 i < ctrlReqs.length; i++) {
                if (ctrlReqs[i].indexOf('authorization') != -1)
                    return next();
            }
        }

        if (typeof options.skip !== 'undefined') {
            if (options.skip.indexOf(req.url) > -1) {
                return next();
            }
        }

        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0]
                    , credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            } else {
                return next(new UnauthorizedError('credentials_bad_format', {message: 'Format is Authorization: Bearer [token]'}));
            }
        } else {
            return next(new UnauthorizedError('credentials_required', {message: 'No Authorization header was found'}));
        }
        var reqParams = [];
        var configParams = [];
        var pushParams=function(type,objString){
            if (type == 1) {
                reqParams.push(objString);
            } else {
                configParams.push(objString);
            }
        }
        var getParamList = function (obj, type) {
            if (obj.constructor == Array) {
                obj.forEach(function (d) {
                    getParamList(d, type);
                });
            } else {
                for (var p in obj) {
                    if(obj[p]==null){
                        pushParams(type,p);
                    }else{
                        if (obj[p].constructor == Object) {
                            pushParams(type,p);
                            getParamList(obj[p], type);
                        }
                        else if (obj[p].constructor == Array) {
                            pushParams(type,p);
                            obj[p].forEach(function (d) {
                                getParamList(obj[p], type);
                            })
                        }
                        else {
                            pushParams(type,p);
                        }
                    }

                }
            }

        };

        var pmlist = reqParam.list;
        reqParam.list.forEach(function (urls) {
            if (urls.url == req.url) {
                getParamList(urls.params, 0);
                return;
            }
        });
        getParamList(req.body, 1);
        var newArray = _.differenceWith(configParams, reqParams);
        if (newArray.length > 0) {
            var prams=""
            newArray.forEach(function(s){
                prams=prams+","+s;
            })
            return next(new UnauthorizedError('params_required', {message: '参数错误:'+prams}));
        }

        jwt.verify(token, options.secret, options, function (err, decoded) {
            if (err) return next(new UnauthorizedError('invalid_token', err));

            req.user = decoded;
            next();
        });
    };
};
