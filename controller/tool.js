/**
 * Created by Administrator on 2016-08-04.
 */

//var QRcode = require('./QRcode/QRcode.js');
//var file = require('../file.js');
var moment = require('moment');
//var redis=require('../../config/redis_monitor.js');
//var client = redis.client;
//var bcrypt = require('bcryptjs');

/**
 * ���ɶ�ά�뷵�ض�ά���ַ
 *
 * @param wxu  10000 �û���ʶ
 * @param urlStr 'weixin://wxpay/bizpayurl?pr=meUREIb' ��ά����Ϣ
 * @param cb  �ص��������� ��ά���ַ
 */
exports.createQRcode = function createQRcode(wxu,urlStr,cb){
    QRcode.createQRcodeReBuffer(urlStr,function(fileBuffer){//���ɶ�ά��
        file.uploadQRcode(wxu,fileBuffer,function(imageUrl){//�ϴ���7N
            cb(imageUrl);
        })
    });
}

exports.getDate=function(){
    return moment.utc().zone(-8);
};

exports.getDateStr=function(){
    return moment.utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
};

exports.getTime=function(){
    return parseFloat(moment.utc().zone(-8).format('x'));
};

var getTimeObject=function(data){
    if(!data.time){
        data.time=new Date();
    }
    if(!data.times){
        data.times=parseFloat(moment.utc().zone(-8).format('x'));
    }
    if(!data.timeStr){
        data.timeStr=moment.utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
    }
    return data;
};

//datetype = year/month/day/hours/minutes/seconds
exports.getTimeType = function(data,year,datetype)
{
    data.time=new Date();
    data.times=parseFloat(moment.utc().zone(-8).format('x'));
    data.timeStr=moment.utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
    data.overtimeStr = moment(data.time).add(year, datetype).zone(-8).format('YYYY-MM-DD HH:mm:ss');
    data.overtimes = moment(data.time).add(year, datetype).zone(-8).format('x');
    return data;
};

exports.getRobotMsgCif=function(){
    var HH=moment.utc().zone(-8).format('HH');
    var msg={1:'msgArray22',2:'msgArray22',3:'msgArray22',4:'msgArray22'
        ,5:'msgArray22',6:'msgArray',7:'msgArray06',8:'msgArray06',9:'msgArray06',10:'msgArray'
        ,11:'msgArray12',12:'msgArray12',13:'msgArray12',14:'msgArray12',15:'msgArray'
        ,16:'msgArray',17:'msgArray17',18:'msgArray17',19:'msgArray17'
        ,20:'msgArray17',21:'msgArray17',22:'msgArray',23:'msgArray22',24:'msgArray22'};
    console.log(msg[HH]);
    return msg[HH];
};

//发送消息至房间 //消息类型 type:'业务类型: gift = 送礼 buy = 充值购买 red =红包 ptSend=平台赠送' hostMoney='主播虚拟币变革' robotIn='虚拟用户进房间' robotOut='虚拟用户出房' robotTalk='用户发言' appUserTalk='app用户发言'
//{
//    "userId": "576c9fd8757a8df31e35d28c",
//    "userNickname": "吃瓜小丸子",
//    "userPic": "http://images.truty.cn/%40%2Fimages%2F10000%2F1466736596472.jpg"
//    msg:'你好'
//}
var pushMsgToRoom=function(type,roomid,data){
    var sendMsg={};
    sendMsg.type=type;
    sendMsg.roomid=roomid;
    sendMsg.data=data;
    //console.log(JSON.stringify(sendMsg));
    client.publish('roomMsg',JSON.stringify(sendMsg));
};

var getUserMsg=function(req){
    var userInfo=req.user.user;
    var userMsg={userId:userInfo._id,userNickname:userInfo.nickname,userPic:userInfo.pic};
    userMsg=getTimeObject(userMsg);
    return userMsg;
};

var pushMsgToRoomByUser=function(type,roomid,msg,req){
    var data=getUserMsg(req);
    data.msg=msg;
    pushMsgToRoom(type,roomid,data);
};

var getPassword=function(){
    var password=Math.random().toString();
    var len=password.length;
    password=password.substring(len-8,len);
    var salt=bcrypt.genSaltSync(10);
    var mPassword=bcrypt.hashSync(password,salt);
    return {password:password,mPassword:mPassword};
};

exports.pushMsgToRoom=pushMsgToRoom;
exports.getPassword=getPassword;
exports.pushMsgToRoomByUser=pushMsgToRoomByUser;
exports.getTimeObject=getTimeObject;
