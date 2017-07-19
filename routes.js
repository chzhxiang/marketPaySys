/**
 * Created by terry on 16/5/17.
 */
var jwt = require('./filter/index.js');
var secret = require('./config/secret');
var tokenManager = require('./config/token_manager');

exports.config = function (app) {

 var routes = {};

 //用户接口
 routes.users = require('./controller/user.js');
 app.post('user/appLogIn', routes.users.appLogIn);
 app.post('user/isLogIn', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.isLogIn);
 app.post('user/logOut', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.logOut);
 app.post('user/setUserInfo', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.setUserInfo);
 app.post('user/getUserInfo', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.getUserInfo);
 app.post('user/getVerCode', routes.users.getVerCode);


};