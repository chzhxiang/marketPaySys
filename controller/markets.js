/**
 * Created by Administrator on 2017/7/18.
 *
 **/
var pm = require('./../models/publicModel');
var mk = new pm('markets');
var ObjectID = require('mongodb').ObjectID;
var transliteration = require('transliteration');
var url = require('url');

/**
 * 保存店铺信息
 * @param = {
 *   name:'店铺名',
 *   address:'地址',
 *   province:'省份',
 *   city:'城市',
 *   location:[],//经纬度
 * }
 * 
 */
exports.saveMaketInfo = function(req,res){
    if(req.body._id){
        var query = {_id:ObjectID(req.body._id)};
        delete req.body._id;
        mk.update(query,{"$set":req.body},function(data){
            return res.json({code:200,msg:'更新成功'});
        })
    }else{

        var sliId = new ObjectID().toString().slice(18);
        req.body.firstWord = transliteration.transliterate(req.body.name).slice(0,1);//获取店铺名称第一个字大写首字母
        //transliteration.transliterate('你好，世界');// Ni Hao ,Shi Jie
        // transliteration.slugify('你好，世界'); // ni-hao-shi-jie
        // transliteration.slugify('你好，世界', {lowercase: false, separator: '_'}); // Ni_Hao_Shi_Jie
        req.body.orderDbName = sliId+'MOrders'; //a6452cMOrders
        req.body.goodCarDbName = sliId+'GoodsCar'; 
        mk.save(req.body,function(data){
            return res.json({code:200,msg:'保存成功'});
        })
    }
};

exports.findById = function(req,res) {
    var params = url.parse(req.url,true).query;
    var query = {_id:ObjectID(params._id)};
    mk.find(query,function(data) {
        return res.json({code:200,data:data.items[0]||{},msg:'查询完成'});
    })
};

exports.selMaketInfoByPage = function(req,res) {
    var params = url.parse(req.url,true).query;
    var page_size = number(params.page_size);
    var page = number(params.page);
    var sort = null;
    mk.pagesSel(null,page_size,page,sort,function(data) {
        return res.send(data);
    })
};


exports.delMaketInfo = function(req,res){
    var query = {_id:ObjectID(req.body._id)};
    mk.delete(query,function(data){
        return res.json({code:200,msg:'删除成功'});
    })
};

// (function(){
//     var q= {
//         location:[ 121.4905, 31.2646 ],
//         km:0.5,
//         count:10,
//     }
//     var query = {'location':{ $geoNear: q.location, 
//               spherical: true,maxDistance:q.km/6371, num:q.count }}
//     mk.near(query,function(data){
//         console.log(data);
//     })
// })()