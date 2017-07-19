var path=require('path');
var config = {};

config.blogName = 'myBlog';
config.url = 'http://localhost/';
config.filepath='/public/images/';
config.tmppath='/public/tmp/';
//config.fileserverid='http://139.196.186.249:8080';
config.fileserverid='http://120.25.103.145:8080';
config.rss = {
  title:        'My RSS Feed',
  description:  'LoremIpsum',
  link:         'http://mySite.fr',
  image:        'http://mySite.fr/logo.png',
  copyright:     'Copyright © 2013 John Doe. All rights reserved'

};
config.microVideoID='AKIDQDdofFPxpcsSFTffEE6pvsHOOEAcA4Oz';

config.microVideoKey='fS8z3EXcRiSkJ92GS6JCq0h8Vax3ZXyQ';
config.microAppid='10021344';

//7N 配置
config.Access_Key='Us60SoTyFdTib7nLaUidvV3Vgacc3RujU289hafU';
config.Secret_Key='xB8gNLob1YxLQ6zCb03TUVCSX_d8G7dVQOxqD2BJ';
config.BucketName='trutyfile';
config.DomainName='http://images.truty.cn/';
//友盟推送设置
config.umPushAppid='56725998e0f55a2150001566';
config.umPushKey='mblxzg7ctsfvynhwhb6i2hubugy9rjst';
config.umproduction_mode='true';


//支付回调地址
config.payCallBackIp='http://120.25.103.145:3002';

//支付宝app支付信息
config.alipay={
    partner:'2088221532404481',//合作身份者id，以2088开头的16位纯数字
    key:'zsnkvrt1epnss1cll6a6gcs5iejpwf77',  //安全检验码，以数字和字母组成的32位字符
    seller_email:'truty@truty.cn',//支付宝帐户 必填
    name:'厦门超体创客互联科技有限公司',//支付宝帐户名 必填
    host:'http://api.truty.cn/'//域名
};

//平台提成 如 100元 平台提30 填写 0.7 即 商户所得比例   config.commissionGrant :打赏  config.commissionProfit ：订单收益
config.commissionProfit=0.94;
config.commissionGrant=0.5;

//可提现金额权值  如收益 3400 cashNum=1000 则 可提现金额为 3000  cashMinNum 单笔可提现最小 金额
config.cashNum=1;
config.cashMinNum=1;

//可提现金额权值  如收益 3400 cashNum=1000 则 可提现金额为 3000  cashMinNum 单笔可提现最小 金额
config.cashGiftNum=10000;
config.cashGiftMinNum=10000;//最小提现金额
config.cashGiftMultiple=10000;//提现的倍数  提现 10000（钻石）/cashGiftMultiple（10000）*cashGiftbase（300） =300 元
config.cashGiftbase=300;//提现的基数

//分享地址
//config.shareUrl='http://www.truty.cn/app_statelive';
//config.shareUrl='http://shop.truty.cn/#/';
//config.shareUrl='http://shop.geegot.com/#/';
config.shareUrl='http://shop.geegot.com/';
config.shareContent = '#即客#，最好玩的人、最in的好物都在这里,点击链接进入即客';

//订单默认收货时间 /秒
config.orderDefReceTime=3600*24*15;

//redis配置信息
config.redisAuth='Trutymaker201506';
config.redisIp='120.25.103.145';
config.redisProt=6379;
//config.redisAuth='Trutymaker201506';
//config.redisIp='120.25.217.213';
//config.redisProt=6379;

//管理者userid
config.messageid = '56f9e182a8fd145d1ab20289';


//注册即送虚拟币
config.giftSendMoney=1;
config.giftSendName='注册即送1688';

//每日分享、登入即送 giftShareSendMoney-分享即送  giftLogSendMoney= 登入即送{1:30,2:40,3:50,4:50,5:60,6:70,7:80} 周一至周天
config.giftShareSendMoney=1;
config.giftLogSendMoney={1:1,2:1,3:1,4:1,5:1,6:1,7:1};


//红包过期时间 /秒
config.redDefReceTime=3600*24;

config.payNoKey='GT_';//生产GG_ 测试GT_
config.payList='TPayList';//生产G_ 测试T_
module.exports = config;