/**
 * Created by Administrator on 2017/7/18.
 *
 **/
var pm = require('./../models/publicModel');
var mk = new pm('markets');
var ObjectID = require('mongodb').ObjectID;
var url = require('url');
var request = require('request');
var citysfig = require('./../config/cityNamefig');

/**
 * 保存店铺信息
 * @param = {
 *   shopname:'店铺名',
 *   address:'地址',
 *   province:'省份',
 *   city:'城市',
 *   location:{lat:'',lng:''} ,//经纬度
 *   type:1//商店类型 ===1 超市 ===2 便利店
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
        for (let i=0,len=citysfig.length; i<len; i++){
            if (citysfig[i].name ==='厦门') {
                req.body.letter = citysfig[i].pinyin.slice(0, 1);//获取城市名称第一个字大写首字母
                break;
            }
        }
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
/**
 * 获取店铺信息
 * @param = {
 *   lat:'',
 *   lng:'',
 *   type:1//商店类型 ===1 超市 ===2 便利店
 * }
 */
exports.getMaketInfo = (req,res) => {
    const params = url.parse(req.url,true).query;
    const lat = Number(params.lat);
    const lng = Number(params.lng);
    const type = Number(params.type)||1;
    let query;
    if (type === 1) {
        query = { near : [ lng,lat], num : 3 , maxDistance:10000/6378137,type:type};
        handleMaketInfo(query,type,res);
    } else {
        query = { near : [ lng,lat], num : 20 , maxDistance:10000/6378137,type:type};
        handleStoreInfo(query,res);
    }
    
    
}

const handleStoreInfo = (query,res) => {
    mk.command(query,redata => {
       try {
            let nears = [];
            redata.results&&redata.results.length>0&&redata.results.forEach(e => {
                e.dis = `${(Number(e.dis)/1000).toFixed(2)}公里`;
                nears.push({
                    shopid: e.obj.shopid,
                    shopname: e.obj.shopname,
                    lat: e.obj.location[0],
                    lng: e.obj.location[1],
                    address: e.obj.address,
                    distance: e.dis
                })
            });
            return res.json({code:200,data:{nears:nears},msg:'查询完成'});
       } catch (error) {
            return res.json({code:400,data:{nears:[]},msg:'网络错误'});
       }
    })
}

//处理超市信息
const handleMaketInfo = (query,type,res) => {

    const getNearMaketInfo = new Promise(resolve =>{
        mk.command(query,redata => {
            resolve (redata);
        })
    });
    const getMaketInfoByLetter = new Promise(resolve => {
        const q = {type:type};
        const sort = {sort:[["letter",1]]};
        mk.findBySort(q,sort,reD => {
            resolve(reD);
        })
    })
    Promise.all([getNearMaketInfo,getMaketInfoByLetter]).then(result =>{
        Promise.all([getNearMaketInfo,getMaketInfoByLetter]).then(result =>{
            try {
                let nears = [];
                let cityshop = [];
                let letterObj = {};
                let letterArr = [];
                let cityObj = {};
                let cityArr = [];
              
                result[0].results.forEach(e => {
                    e.dis = `${(Number(e.dis)/1000).toFixed(2)}公里`;
                    nears.push({
                        shopid: e.obj.shopid,
                        shopname: e.obj.shopname,
                        lat: e.obj.location[0],
                        lng: e.obj.location[1],
                        address: e.obj.address,
                        distance: e.dis
                    })
                });
                result[1].items.forEach(e=>{
                    if (!letterObj[e.letter]) {
                        letterObj[e.letter] = e.letter;
                        letterArr.push(e.letter);
                    }
                    if (!cityObj[e.city]) {
                        cityObj[e.city] = e.city;
                        cityArr.push(e.city);
                    }
                })
                letterArr.forEach(l=>{
                    let citys = [];
                    cityArr.forEach(c=>{
                        let shops = [];
                        result[1].items.forEach(e=>{
                            if (l === e.letter) {
                                if(c === e.city) {
                                    shops.push({
                                        shopid: e.shopid,
                                        shopname: e.shopname,
                                        lat: e.location[0],
                                        lng: e.location[1],
                                    })
                                }   
                            }
                        })
                        shops.length>0&&citys.push({city:c,shops:shops});
                    })
                    citys.length>0&&cityshop.push({letter:l,citys:citys});
                })
               return res.json({code:200,data:{nears:nears,cityshop:cityshop},msg:'查询完成'});

            } catch (error) {
                return res.json({code:400,data:{},msg:'网络错误'})
            }
            
        })
    })
}


// (()=>{

//     const data = [{
//         name:'E点便利(洪塘店)',
//         ad:'厦门湖里洪塘5号之9'
//     }]
//     data.forEach(e=>{
//         let option = {url: 'http://restapi.amap.com/v3/geocode/geo?key=c68bd5f81709d2435636f44fa4070201&address='+encodeURIComponent(e.ad), method: 'GET', json: true};
        
//         request(option, function (err, res, body) {
//             // console.log(body)
//             console.log(err)
//             save(body,e.name);
//         });
//     })
    
// })()

// const save = (params,name) =>{
//     let strs = new Array(); //定义一数组 
//     strs = params.geocodes[0].location.split(","); //字符分割 
//     let body = {
//         shopid: new ObjectID().toString(),
//         shopname: name,
//         address: params.geocodes[0].formatted_address,
//         province: params.geocodes[0].province,
//         city: params.geocodes[0].city,
//         district: params.geocodes[0].district,
//         location: { lng: Number(strs[0]), lat: Number(strs[1]) }, //经纬度
//         type: 2
//     };
//     for (let i=0,len=citysfig.length; i<len; i++){
//         if (citysfig[i].name ==='厦门') {
//             body.letter = citysfig[i].pinyin.slice(0, 1);//获取城市名称第一个字大写首字母
//             break;
//         }
//     }
//     console.log(body);
//     mk.save(body, (data) => {

//     })
// }
