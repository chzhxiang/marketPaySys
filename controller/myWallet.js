/**
 * 我的钱包
 * 
*/
const pm = require('./../models/publicModel.js');
const myWallet = new pm('myWallet');

/**
 * 获取我的余额
 */

exports.getMyMoney = (req,res)=>{
    const query = {userId:req.user.user._id};
    myWallet.findOne(query,null,result=>{
        if(result.status>0){
            let data = {};
            data.userId = result.items.userId||req.user.user._id;
            data.money = result.items.money||0;
            return res.json({code:200,msg:'操作成功',data:data})
        }else{
            return res.json({code:400,msg:'网络错误',data:{}})
        }
    })
}


/**
 * 获取我的积分
 */

exports.getMyIntegrals = (req,res)=>{
    const query = {userId:req.user.user._id};
    myWallet.findOne(query,null,result=>{
        if(result.status>0){
            let data = {};
            data.userId = result.items.userId||req.user.user._id;
            data.integrals = result.items.integrals||0;
            return res.json({code:200,msg:'操作成功',data:data})
        }else{
            return res.json({code:400,msg:'网络错误',data:{}})
        }
    })
}


/**
 * 我的钱包
 */

 exports.myWallet = (req,res)=>{
     const query = {userId:req.user.user._id};
     const myCoupon = new pm('myCoupon');
    
     myCoupon.pagetotal(query,count=>{
         if(!count.status&&count>=0){
            myWallet.findOne(query,null,result=>{
                
                if(result.status>0){
                    let data = {};
                    data.userId = req.user.user._id;
                    data.money = result.items.money||0; //余额
                    data.integrals = result.items.integrals||0;//积分
                    data.coupons = count||0;//优惠券
                    data.grade = 1;//会员等级
                    data.memberId = result.items.memberId||req.user.user._id;//会员Id
                    return res.json({code:200,msg:'查询完成',data:data});
                }else{
                    return res.json({code:400,msg:'网络错误',data:{}})
                }
            })
         }else{
            return res.json({code:400,msg:'网络错误',data:{}})
         }
     })
 }
