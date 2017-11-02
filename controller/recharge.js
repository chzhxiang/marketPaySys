/**
 * 充值
 */
const pm = require('./../models/publicModel');
const ObjectID = require('mongodb').ObjectID;
const reCharge = new pm('reCharge');
const wxpay = require('./wxpay');
const alipay = require('./../alipay/index');

 /**
 * 分页获取充值列表
 * 
 * @params = {
 *     page_size:10,
 *     page:1;
 * }
 */

exports.getRechargeList = (req,res) => {
    const query = { userId: req.user.user._id };
    const sort = ['times', -1];
    const page_size = Number(req.params.page_size);
    const page = Number(req.params.page);

    reCharge.pagesSel(query, page_size, page, sort, (data) => {
        try {
            return res.send(data);

        } catch (error) {
            console.log(error);
        }
    })
 }


 /**
 * 充值
 * @param = {
 *  payType:'支付方式'    // Zhifubao=1, Weixin=2,Yiwangtong=3,Yinlian=4,
 *  money
 * }
 * 
 * 
 */

exports.reCharge = (req, res) => {
    // console.log(req.body);
    req.body.payNo = new ObjectID().toString();
    req.body.body = '会员充值';
    req.body.userId = req.user.user._id;
    if(req.body.payType==2){//支付
        wxpay.appRecharge(req.body,req,res);
    }else if(req.body.payType==1){
        alipay.appRecharge(req.body,req,res);
    }else{
        res.send({code:400,msg:'暂时不支持该支付类型'});
    }
}