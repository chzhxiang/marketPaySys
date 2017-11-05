/**
 * Created by Administrator on 2017-08-02.
 */

const pm = require('./../models/publicModel');
const sql = require('./../db/sqlDb');
const sqlconfig = require('./../config/sqlconfig');
const url = require('url');
const goods = new pm('mkGoods');
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
/**
 * @param = {
 *  shopId:'店铺id',
 *  barCode:'条形码号'
 * }
 */
exports.getGoodsInfoByBarCode = (req,res) =>{
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
//(function(){
//    const goodsArr = [{
//        goodsName:'心相印茶语纸面巾',
//        specs:'',
//        price:6.80,
//        barCode:'6922868285747',
//        stocks:100
//    },
//    {
//        goodsName:'伊利优酸乳蓝莓味',
//        specs:'250ml',
//        price:2.50,
//        barCode:'6907992502588',
//        stocks:100
//    }]
//    goodsArr.forEach(e=>{
//        addGoods(e)
//    })
//})()

/**
 * 设置积分商品
 * @params = {
 *      gid:'商品id',
 *      integrals:1500,//积分
 *      validTime:'2017-11-01',//有效时间
 * }
 */

exports.setIntegralGood = (req,res) => {
    const query = {gid:req.body.gid};
    let validTimes = new Date(req.body.validTime).getTime();
    validTimes = Number(moment(validTimes).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').zone(-8).format('x'));
    const setModel = {"set":{integralInfo:{validTime:req.body.validTime,validTimes:validTimes,integrals:req.body.integrals}}};
    goods.update(query,setModel,(result)=>{
        return res.json({code:200,msg:'设置成功'});
    })
}


/**
 * 获取积分商品
 * @params = {
 *      page_size:10,
 *      page:1;
 * }
 */

exports.getIntegralGoodByPage = (req,res) => {
    const times = new Date().getTime();
    const query = { "integralInfo.validTimes":{"$gte":times} };
    const sort = ['integralInfo.validTimes', -1];
    const page_size = Number(req.params.page_size);
    const page = Number(req.params.page);
    goods.pagesSel(query, page_size, page, sort, (data) => {
        try {
            if(data.code === 200){
                var reData = [];
                data.data.forEach(function(e) {
                    reData.push({
                        gid:e.gid,
                        goodsName:e.goodsName,
                        imgUrls:e.imgUrls||'',
                        integralInfo:e.integralInfo||{}
                    })
                });
                data.data = reData;
            }
            return res.send(data);
        } catch (error) {
            console.log(error);
        }
    })
}





