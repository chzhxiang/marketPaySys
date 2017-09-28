/**
 * Created by Administrator on 2017-08-02.
 */

const pm = require('./../models/publicModel');
const sql = require('./../db/sqlDb');
const sqlconfig = require('./../config/sqlconfig');
const url = require('url');
const goods = new pm('mkGoods');
const ObjectID = require('mongodb').ObjectID;

/**
 * @param = {
 *  shopId:'店铺id',
 *  barCode:'条形码号'
 * }
 */
exports.getGoodsInfoByBarCode = function(req,res) {
    const params = url.parse(req.url,true).query;
    if(params.barCode){
        // const sqlstr = "select * from dbo.ptype where ptypeid in (select PTypeId from dbo.xw_PtypeBarCode where BarCode="+params.barCode+")";//select * from dbo.xw_PtypeBarCode where BarCode=6901285991219
        // //const sqldbconfig = "mssql://sa:123@localhost/ceshi";
        // const sqldbconfig = sqlconfig[params.shopId];
        // const sqldb = new sql(sqldbconfig);
        // sqldb.read(sqlstr,function(data){
        //     console.log(data);
        //     return 
        // });
        testByBarCode(params.barCode,(reData) => {
            return res.send(reData)
        })
    }else{
        return res.json({
            code:400,
            msg:'参数错误缺少barCode',
            data:{}
        })
    }
};

const testByBarCode = (barCode,cb) => {
    const query = {barCode:barCode};
    goods.find(query,function(data) {
        try {
           if (data.status>0&&data.items.length>=0) {
               cb({code:200,data:data.items[0]||{},msg:'查询完成'});
           } else {
                cb({code:400,data:{},msg:'网络错误'})
           }
        } catch (error) {
            console.log(error);
            cb({code:400,data:{},msg:'网络错误'});
        }
    })
}

const addGoods = (goodsInfo) => {
   goodsInfo.gid = new ObjectID().toString();
    goods.save(goodsInfo,(reData) => {
        try {
            // console.log(reData.status);
        } catch (error) {
            console.log(error);
        }
    })
}
// (function(){
//     const goodsArr = [{
//         goodsName:'心相印茶语纸面巾',
//         specs:'',
//         price:6.80,   
//         barCode:'6922868285747',
//         stocks:100
//     },
//     {
//         goodsName:'伊利优酸乳蓝莓味',
//         specs:'250ml',
//         price:2.50,   
//         barCode:'6907992502588',
//         stocks:100
//     }]
//     goodsArr.forEach(e=>{
//         addGoods(e)
//     })
// })()








