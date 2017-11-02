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
    app.post('/mkps/user/appLogIn', routes.users.appLogIn);
    app.post('/mkps/user/isLogIn', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.isLogIn);
    app.post('/mkps/user/logOut', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.logOut);
    app.post('/mkps/user/setUserInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.setUserInfo);
    app.get('/mkps/user/getUserInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.getUserInfo);
    app.get('/mkps/user/getVerCode', routes.users.getVerCode);
    app.post('/mkps/user/loginOn', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.loginOn);
    app.post('/mkps/user/loginIn', routes.users.loginIn);
    app.get('/mkps/user/userList', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.users.userList);

    routes.filemanger = require('./controller/file.js');
    app.post('/mkps/filemanger/appupload', routes.filemanger.upload);

    routes.order = require('./controller/orders.js');
    app.get('/mkps/order/getOrderById', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.getOrderById);
    app.get('/mkps/order/getOrdersByPages', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.getOrdersByPages);
    app.post('/mkps/order/orderPay', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.orderPay);
    app.post('/mkps/order/createOrder', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.createOrder);
    app.post('/mkps/order/delOrder',jwt({secret:secret.secretToken}),tokenManager.verifyToken,routes.order.delOrder);
    app.post('/mkps/order/paySuccess',jwt({secret:secret.secretToken}),tokenManager.verifyToken,routes.order.paySuccess);
    app.post('/mkps/order/wxAppletPay', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.wxAppletPay);
    app.post('/mkps/order/createOrderQRcode', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.order.createOrderQRcode);

    routes.shoppingBig = require('./controller/ShoppingBag.js');
    app.post('/mkps/shoppingBig/setShoppingBag', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.shoppingBig.setShoppingBag);
    app.get('/mkps/shoppingBig/getShoppingBagInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.shoppingBig.getShoppingBagInfo);

    routes.goods = require('./controller/goods.js');
    app.get('/mkps/goods/getGoodsInfoByBarCode', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goods.getGoodsInfoByBarCode);
    app.get('/mkps/goods/getIntegralGoodByPage', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goods.getIntegralGoodByPage);

    routes.goodsCar = require('./controller/goodsCar.js');
    app.get('/mkps/goodsCar/getGoodsCarInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goodsCar.getGoodsCarInfo);
    app.post('/mkps/goodsCar/addGoodsCar', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goodsCar.addGoodsCar);
    app.post('/mkps/goodsCar/delGoodsCarInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goodsCar.delGoodsCarInfo);
    app.post('/mkps/goodsCar/delAll', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.goodsCar.delAll);

    routes.markets = require('./controller/markets.js');
    app.post('/mkps/markets/saveMaketInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.markets.saveMaketInfo);
    app.get('/mkps/markets/findById', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.markets.findById);
    app.get('/mkps/markets/selMaketInfoByPage', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.markets.selMaketInfoByPage);
    app.post('/mkps/markets/delMaketInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.markets.delMaketInfo);
    app.get('/mkps/markets/getMaketInfo', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.markets.getMaketInfo);

    routes.memberSys = require('./controller/memberSys.js');
    app.post('/mkps/memberSys/createCoupon', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.createCoupon);
    app.post('/mkps/memberSys/getCoupon', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.getCoupon);
    app.get('/mkps/memberSys/getMyCoupon', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.getMyCoupon);
    app.get('/mkps/memberSys/getCouponByShopId', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.getCouponByShopId);
    app.get('/mkps/memberSys/getCouponListByShopId', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.getCouponListByShopId);
    app.get('/mkps/memberSys/getCouponInfoById', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.memberSys.getCouponInfoById);

    routes.mywallet = require('./controller/myWallet.js');
    app.get('/mkps/mywallet/getMyMoney', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.mywallet.getMyMoney);
    app.get('/mkps/mywallet/getMyIntegrals', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.mywallet.getMyIntegrals);
    app.get('/mkps/mywallet/myWallet', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.mywallet.myWallet);


    routes.integrals = require('./controller/integrals.js');
    app.get('/mkps/integrals/getIntegralList', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.integrals.getIntegralList);

    routes.consumption = require('./controller/consumption.js');
    app.get('/mkps/consumption/getConsumptionList', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.consumption.getConsumptionList);


    routes.recharge = require('./controller/recharge.js');
    app.get('/mkps/recharge/getRechargeList', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.recharge.getRechargeList);
    app.post('/mkps/recharge/reCharge', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.recharge.reCharge);    

    // routes.menu = require('./controller/menu.js');
    // app.get('/mkps/menu', jwt({ secret: secret.secretToken }), tokenManager.verifyToken, routes.menu.menu);

    //后台首页
    // routes.dashboard = require('./controller/dashboard.js');
    // app.get('mkps/dashboard',jwt({secret: screen.secretToken}), tokenManager.verifyToken, routes.dashboard.dashboard);

    routes.alipay = require('./alipay/index.js');
    //
    //app.post('/mkps/alipay/paynotify', routes.alipay.alipayNotify);//支付宝支付回调

    app.post('/mkps/alipay/reChargeCb', routes.alipay.reChargeCb);//充值支付宝支付回调
    //
    routes.wxpay = require('./controller/wxpay.js');
    //app.post('/mkps/wxpay/AppOrderPayUrl', routes.wxpay.AppOrderPayUrl);//微信支付回调
    app.post('/mkps/wxpay/AppRechargecb', routes.wxpay.AppRechargecb);//充值微信支付回调


};

