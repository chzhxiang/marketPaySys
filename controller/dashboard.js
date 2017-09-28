const pm = require('./../models/publicModel');
const ObjectID = require('mongodb').ObjectID;

exports.dashboard = (req,res) => {
    const query = null
  
 


}

//用户总数
const userCount = (req,cb)=>{
    const users = new pm('mkusers')
    const query = null
    users.pagetotal(query,userCount=>{
        try {
            if(!userCount.status){
                cb(userCount)
            }else{
                cb(0)
            }
        } catch (error) {
           cb(0) 
        }
    })
}


//订单总数
const orderCount = (req,cb)=>{
    const order = new pm('mkOrder')
    const query = {shopId:req.user.user.shopId,orderStatus:1}
    // const arr=[
    //     {'$match':{shopId:req.user.user.shopId,orderStatus:1}},
    //     {'$project':{oid:1,countAll:1}},
    //     {'$group':{'_id':'$oid','BAL':{'$sum':'$countAll'}}}
    // ];
    // order.aggregate(arr,data=>{
    //     if(data.items&&data.items.length>0){
    //         cb(data.items[0].BAL);
    //     }else{
    //         cb(0);
    //     }
    // });
    order.pagetotal(query,orderCount=>{
        try {
            if(!orderCount.status){
                cb(orderCount)
            }else{
                cb(0)
            }
        } catch (error) {
           cb(0)
        }
    })
}



