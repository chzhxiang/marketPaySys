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
    validTimes = Number(moment(validTimes).add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format('x'));
    const setModel = {"set":{integralInfo:{validTime:req.body.validTime,validTimes:validTimes,integrals:req.body.integrals}}};
    goods.update(query,setModel,(result)=>{
        return res.json({code:200,msg:'设置成功'});
    })
}

// (()=>{
//     let integralGoods = [{
//         gid:new ObjectID().toString(),
//         goodsName:'小黄人',
//         imgUrls:'http://file.truty.cn/images/10173/1460789780098.jpg',
//         validTime:'2017-12-31',
//         integrals:150,
//         stocks:100,
//         goodsType:'integral'
//     },{
//         gid:new ObjectID().toString(),
//         goodsName:'修身圆领短袖T恤男打底衫潮3025',
//         imgUrls:'http://file.truty.cn/images/10172/1460791971993.png',
//         validTime:'2017-12-31',
//         integrals:300,
//         stocks:100,
//         goodsType:'integral'
//     },{
//         gid:new ObjectID().toString(),
//         goodsName:'1年版5/7时令茶',
//         imgUrls:'http://file.truty.cn/images/10173/1460706803670.png',
//         validTime:'2017-12-31',
//         integrals:200,
//         stocks:100,
//         goodsType:'integral'
//     }];
//     integralGoods.forEach(e=>{
//          var time = new Date(e.validTime).getTime();
//          e.validTimes = Number(moment(time).add(15,'day').add(15, 'hours').add(59, 'minutes').add(59, 'seconds').format('x'));
//     })
//     goods.insert(integralGoods,(data)=>{
        
//     })
// })()


/**
 * 获取积分商品
 * @params = {
 *      page_size:10,
 *      page:1;
 * }
 */

exports.getIntegralGoodByPage = (req,res) => {
    const times = new Date().getTime();
    const query = { "validTimes":{"$gte":times} };
    const sort = ['validTimes', -1];
    const page_size = Number(req.params.page_size);
    const page = Number(req.params.page);
    goods.pagesSel(query, page_size, page, sort, (data) => {
        try {
            if(data.code === 200){
                const _query = {userid:req.user.user._id};
                myIntegralGoods.find(_query,reD=>{
                    if(reD.status>0){
                        let reData = [];
                        data.data.forEach((e)=> {
                            e.isGet = false;
                            reD.items.forEach(rD=>{
                                if(rD.gid === e.gid){
                                    e.isGet = true;
                                }
                                reData.push({
                                    gid:e.gid,
                                    goodsName:e.goodsName,
                                    imgUrls:e.imgUrls||'',
                                    validTime:e.validTime||{},
                                    integrals:e.integrals,
                                    isGet:e.isGet,
                                })
                            })
                        });
                        data.data = reData;
                        return res.send(data);
                    }else{
                        return res.json({code:400,data:{},msg:'网络错误'});
                    }
                })
                
            }else{
                return res.send(data); 
            }
            
        } catch (error) {
            console.log(error);
        }
    })
}



/**
 * 积分兑换商品
 * @params = {
 *      gid:'',
 * }
 */

 exports.getGoodsByIntegrals = (req,res) => {
     const query = {gid:req.body.gid,stocks:{"$gte":1}};
     const sort = null;
     integralGoods.findOne(query,null,result=>{
        if(result.status>0){
            let  body = req.body;
            body.userid = req.user.user._id;
            body.goodsInfo = result.items;
            myIntegralGoods.save(body,re=>{
                if(re.status>0){
                    const _query = {userId:req.user.user._id};
                    const integrals = -Number(result.items.integrals);
                    const setModel = {"$inc":{integrals:integrals}};
                    myWallet.update(_query,setModel,reD=>{});
                    integralGoods.update({gid:req.body.gid},{"$inc":{stocks:-1}},r=>{});
                    return res.json({code:200,msg:'兑换成功'}); 
                }else{
                    return res.json({code:400,msg:'兑换失败'}); 
                }
            })
        }else{
            return res.json({code:400,msg:'该商品已被兑换完，请选择其他商品'});
        }
     })
 }




