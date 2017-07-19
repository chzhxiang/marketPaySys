/**
 * Created by Administrator on 2017/7/18.
 *
 **/
var pm = require('./models/publicModel');
var mk = new pm('markets');
var ObjectID = require('mongodb').ObjectID;

exports.saveMaketInfo = function(req,res){
    if(req.body._id){
        var query = {_id:ObjectID(req.body._id)};
        delete req.body._id;
        mk.update(query,{"$set":req.body},function(data){
            return res.json({code:200,msg:'更新成功'});
        })
    }else{
        var oid = new ObjectID().toString();
        oid = oid.slice(18);
        req.body.dbname = oid+'MOrders'; //a6452cMOrders
        mk.save(req.body,function(data){
            return res.json({code:200,msg:'保存成功'})
        })
    }
};

exports.findById = function(req,res){
    var query = {_id:ObjectID(req.body._id)};
    mk.find(query,function(data){
        return res.json({code:200,data:data.items[0]||[],msg:'查询完成'});
    })
};

exports.selMaketInfoByPage = function(req,res){
    var page_size = number(req.body.page_size);
    var page = number(req.body.page);
    var sort = null;
    mk.pagesSel(null,page_size,page,sort,function(data){
        return res.send(data);
    })
};


exports.delMaketInfo = function(req,res){
    var query = {_id:ObjectID(req.body._id)};
    mk.delete(query,function(data){
        return res.json({code:200,msg:'删除成功'});
    })
};