const ObjectID = require('mongodb').ObjectID;
const dbName = require('../public/getDbName').dbName;//获取门店信息
const url = require('url');
const pm = require('./../models/publicModel');
const goodCar = new pm('mkGoodsCar');

/**
 *添加购物车
 * @param = {
 *  shopId:'店铺id',
 *  goodsInfo:{
 *      gid:'',
 *      goodsName:'雪碧1.25升',
 *      price:9.50, 
 *      barCode:'6928804010367',
 *      count:2
 *     }
 * }
 * 
 */
exports.addGoodsCar = (req, res) => {
    // dbName(req.body.shopId,'goodsCar',(dbCarName)=>{
    //     req.body.userId = req.user._id;
    //     dbCarName.save(req.body,(reData)=>{
    //         try {
    //             console.log(reData);
    //             return res.json({code:200,msg:'添加购物车成功'});
    //         } catch (error) {
    //            return res.json({code:400,msg:'网络错误'});
    //         }
    //     })
    // });
    let query = { "goodsInfo.gid": req.body.goodsInfo.gid, userId: req.user.user._id,shopId:req.body.shopId};
    if (req.body.goodsInfo.barCode) {
        query = { "goodsInfo.barCode": req.body.goodsInfo.barCode, userId: req.user.user._id,shopId:req.body.shopId};
    }
    goodCar.find(query, (reD) => {

        try {
            if (reD.status > 0 && reD.items.length > 0) {
                let setModel = { "$inc": { "goodsInfo.count": req.body.goodsInfo.count } }
                if (req.body.goodsInfo.cid) {
                    setModel = { "$set": { "goodsInfo.count": req.body.goodsInfo.count } }
                }
                goodCar.update(query, setModel, (reData) => {
                    try {
                        return res.json({ code: 200, msg: '添加购物车成功' });
                    } catch (error) {
                        return res.json({ code: 400, msg: '网络错误' });
                    }
                })
            } else if (reD.status > 0 && reD.items.length === 0) {
                req.body.goodsInfo.cid = new ObjectID().toString();
                req.body.userId = req.user.user._id;
                goodCar.save(req.body, (reData) => {
                    try {
                        return res.json({ code: 200, msg: '添加购物车成功' });
                    } catch (error) {
                        return res.json({ code: 400, msg: '网络错误' });
                    }
                })
            } else {
                return res.json({ code: 400, msg: '网络错误' });
            }
        } catch (error) {
            return res.json({ code: 400, msg: '网络错误' });
        }
    })

}

/**
 * 查询购物车商品信息
 * @param = {
 *  userId:'用户id'，
 *  shopId:'店铺id',
 * }
 * 
 */

exports.getGoodsCarInfo = (req, res) => {
    const params = url.parse(req.url, true).query;
    // dbName(params.shopId,'goodsCar',(dbCarName)=>{
    //    const query = {userId:req.user._id};
    //     dbCarName.find(query,(reData)=>{
    //         try {
    //             console.log(reData);
    //             if(reData.status>0&&reData.items.length>=0){
    //                 return res.json({code:200,msg:'查询完成',data:reData.items||[]});
    //             }else{
    //                 return res.json({code:400,msg:'网络错误',data:[]});
    //             }

    //         } catch (error) {
    //             console.log(error);
    //            return res.json({code:400,msg:'网络错误',data:[]});
    //         }
    //     })
    // });
    const query = { userId: req.user.user._id,shopId:params.shopId };
    const sort = { sort: [['times', -1]] }
    goodCar.findBySort(query, sort, (reData) => {
        try {
            // console.log(reData);
            if (reData.status > 0 && reData.items.length >= 0) {
                return res.json({ code: 200, msg: '查询完成', data: reData.items || [] });
            } else {
                return res.json({ code: 400, msg: '网络错误', data: [] });
            }

        } catch (error) {
            console.log(error);
            return res.json({ code: 400, msg: '网络错误', data: [] });
        }
    })
}

/**
 * 删除购物车商品信息
 * @param = {
 *  cid:'cid'，
 *  shopId:'店铺id',
 *  
 * }
 * 
 */

exports.delGoodsCarInfo = (req, res) => {
    // dbName(req.body.shopId,'goodsCar',(dbCarName)=>{
    //    const query = {_id:ObjectID(req.body._id)};
    //     dbCarName.delete(query,(reData)=>{
    //         try {
    //             console.log(reData);
    //             return res.json({code:200,msg:'删除成功'});
    //         } catch (error) {
    //             console.log(error);
    //            return res.json({code:400,msg:'网络错误'});
    //         }
    //     })
    // });
    const query = { "goodsInfo.cid": req.body.cid };
    goodCar.delete(query, (reData) => {
        try {
            return res.json({ code: 200, msg: '删除成功' });
        } catch (error) {
            console.log(error);
            return res.json({ code: 400, msg: '网络错误' });
        }
    })
}

/**
 *清空购物车
 * @param = {
 *  shopId:'店铺id',
 *  
 * }
 * 
 */
exports.delAll = (req,res) => {
    const query = { userId:req.user.user_id,shopId:req.body.shopId};
    goodCar.delete(query, (reData) => {
        try {
            return res.json({ code: 200, msg: '删除成功' });
        } catch (error) {
            console.log(error);
            return res.json({ code: 400, msg: '网络错误' });
        }
    })
}