/**
 * Created by Administrator on 2017/7/18.
 */

var pm = require('./models/publicModel');
var markets = new pm('markets');
var ObjectID = require('mongodb').ObjectID;

//获取门店信息
var dbName = function(_id,callback){
    markets.find({_id:ObjectID(_id)},function(data){
        if(data.status>0&&data.items.length>0){
            var orders = new pm(data.items[0].dbname);
            callback(orders);
        }else{
            callback(null);
        }
    })

};

/*
* 分页获取订单
* @param req = {
*  key:'超市key'
*  page_size:10,
*  page:1,
* }
* */
exports.getOrders = function(req,res){
    if(req.body._id){
        dbName(req.body._id,function(orders){
            if(orders){
                var query = {userid:req.user.user._id};
                var sort = ['begin_time',-1];
                var page_size = number(req.body.page_size);
                var page = number(req.body.page);

                orders.pagesSel(query, page_size, page, sort, function(data){
                    return res.send(data);
                })
            }else{
                return res.json({code:400,msg:'门店信息不存在'});
            }
        })
    }else{
        return res.json({code:400,msg:'缺少参数key'})
    }
};

/*
* 通过id获取订单
* @param req={
*   id:'',
*   key:'超市key'
* }
*
* */

exports.getOrderById = function(req,res){
    if(req.body._id&&req.body.id){
        dbName(req.body._id,function(orders){
            if(orders){
                var query = {id:req.body.id};
                orders.find(query,function(data){
                    if(data.status>0&&data.items.length>0){
                        return res.json({code:200,data:data.items[0],msg:'查询完成'});
                    }else if(data.status>0&&data.items.length===0){
                        return res.json({code:200,data:[],msg:'无订单'});
                    }else{
                        return res.json({code:400,data:[],msg:'网络错误'});
                    }
                })
            }else{
                return res.json({code:400,msg:'门店信息不存在'});
            }
        })


    }else{
        return res.json({code:400,msg:'缺少参数key'})
    }
};




