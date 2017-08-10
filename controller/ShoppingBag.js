const ObjectID = require('mongodb').ObjectID;
const pm = require('../models/publicModel');
const dbName = new pm('shoppingBag');
const url = require('url');
/**
 * 设置购物袋型号和价格
 * @param = {
 *  shoppingBagInfo:[{
 *     type:'small',
 *     name:'小型购物袋',
 *     price:0.40
 *  }],
 *  shopId:'店铺id',
 * }
 * 
 */
exports.setShoppingBag = (req,res)=>{
   if(req.body._id){
       const query = {_id:ObjectID(req.body._id)};
       const setModel = {"$set":{ShoppingBagInfo:req.body.ShoppingBagInfo}};
       dbName.update(query,setModel,(reData)=>{
           try {
               console.log(reData);
               return res.json({code:200,msg:'更新成功'});
           } catch (error) {
              console.log(error);
              return res.json({code:400,msg:'网络错误'});
           }
       })
   }else{
       dbName.save(req.body.ShoppingBagInfo,(reData)=>{
           try {
               console.log(reData);
               return res.json({code:200,msg:'设置成功'});
           } catch (error) {
               console.log(error);
               return res.json({code:400,msg:'网络错误'});
           }
       }) 
   }
}

/**
 * 获取购物袋信息
 * @param = {
 * shopId:'店铺id',
 * }
 * 
 */
exports.getShoppingBagInfo = (req,res) =>{
    const params = url.parse(req.url,true).query;
    const query = {shopId:params.shopId};
    dbName.find(query,(reData)=>{
        try {
            if(reData.status>0&&reData.items.length>=0){
                return res.json({code:200,msg:'查询完成',data:reData.items||[]});
            }else{
                return res.json({code:400,msg:'网络错误',data:[]});
            }
        } catch (error) {
            console.log(error);
            return res.json({code:400,msg:'网络错误',data:{}});
        }
    })
}