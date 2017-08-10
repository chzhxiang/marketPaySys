const pm = require('./../models/publicModel');
const markets = new pm('markets');
const ObjectID = require('mongodb').ObjectID;

//获取门店信息
exports.dbName = (_id,type,callback)=>{
    markets.find({_id:ObjectID(_id)},(data)=>{
        if(data.status>0&&data.items.length>0){
            let dbname;
            if(type==='orders'){
                dbname = new pm(data.items[0].orderDbName);
            }else if(type==='goodsCar'){
                dbname = new pm(data.items[0].goodCarDbName);
            }
            callback(dbname);
        }else{
            callback(null);
        }
    })

};