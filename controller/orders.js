/**
 * Created by Administrator on 2017/7/18.
 */
const pm = require('./../models/publicModel');
const ObjectID = require('mongodb').ObjectID;
const dbName = require('../public/getDbName').dbName;//获取门店信息
const mkOrder = new pm('mkOrder');
const url = require('url');
const qr = require('qr-image');
const file = require('./file.js');
const config = require('./../config/config.js');

/*
* 分页获取订单
* @param = {
*  shopId:'超市id'
*  page_size:10,
*  page:1,
* }
* */
exports.getOrdersByPages = (req, res) => {
    const params = url.parse(req.url, true).query;
    if (params.shopId) {
        dbName(params.shopId, 'orders', (orders) => {
            if (orders) {
                const query = { userId: req.user.user._id };
                const sort = ['begin_time', -1];
                const page_size = number(params.page_size);
                const page = number(params.page);

                orders.pagesSel(query, page_size, page, sort, (data) => {
                    return res.send(data);
                })
            } else {
                return res.json({ code: 400, msg: '门店信息不存在' });
            }
        })
    } else {
        return res.json({ code: 400, msg: '缺少参数shopId' })
    }
};

/*
* 通过id获取订单
* @param = {
*   payNo/oid:'',
*   shopId:'超市id'
* }
*
* */

exports.getOrderById = (req, res) => {
    let query = null;
    const params = url.parse(req.url, true).query;
    params.oid && (query={ oid: params.oid });
    params.payNo && (query={ payNo: params.payNo })
    mkOrder.find(query, (data) => {
        if (data.status > 0 && data.items.length > 0) {
            return res.json({ code: 200, data: data.items[0], msg: '查询完成' });
        } else if (data.status > 0 && data.items.length === 0) {
            return res.json({ code: 200, data: {}, msg: '无订单' });
        } else {
            return res.json({ code: 400, data: {}, msg: '网络错误' });
        }
    })
    // if(params.shopId&&params.id){
    //     dbName(params.shopId,'orders',(orders)=>{
    //         if(orders){
    //             var query = {id:params.id};
    //             orders.find(query,(data)=>{
    //                 if(data.status>0&&data.items.length>0){
    //                     return res.json({code:200,data:data.items[0],msg:'查询完成'});
    //                 }else if(data.status>0&&data.items.length===0){
    //                     return res.json({code:200,data:[],msg:'无订单'});
    //                 }else{
    //                     return res.json({code:400,data:[],msg:'网络错误'});
    //                 }
    //             })
    //         }else{
    //             return res.json({code:400,msg:'门店信息不存在'});
    //         }
    //     })

    // }else{
    //     return res.json({code:400,msg:'缺少参数shopId'})
    // }
};

/**
 * 下单支付
 * 1、校验库存/价格
 * 2、下单支付
 * 3、删除购物车
 * 
 * */
exports.orderPay = (req, res) => {
    req.body.userId = req.user.user._id;
    req.body.orderStatus = 1;
    req.body.payType = 'appAliPay';
    req.body.payNo = new ObjectID().toSring();
    req.body.oid = new ObjectID().toSring();
    saveMKorders(req.body, res);
};

const saveMKorders = (orderInfo, res) => {
    mkOrder.save(orderInfo, (reData) => {
        try {
            return res.json({ code: 200, msg: "支付成功" })
        } catch (error) {
            console.log(error);
            return res.json({ code: 400, msg: '网络错误' });
        }
    })
}

/**
 * 校验库存
 * @param = {
 * 
 * }
 */

const checkStocks = () => {

}


/**
 * 订单二维码
 * @param = {
 *    payNo:'',
 *    shopId:'',
 * }
 */
exports.createOrderQRcode = (req,res) => {
    const url = `${config.QRcodeUrl}?payNo=${req.body.payNo}&shopId=${req.body.shopId}`;
    const fileBuffer=qr.imageSync(url, {type:'png', size:5});
    file.uploadQRcode(req.body.shopId,fileBuffer,function(imageUrl){
        return res.json({code:200,data:imageUrl||''});
    })
}