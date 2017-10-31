/**
 * Created by terry on 16/3/9.
 */
/**
 * Created by terry on 15/12/22.
 */
// var db = require('./../db/mongo.js'),
//     CRUD = require('./../db/CURD.js');
// var async = require('async');

// var pm = function (modelname) {
//     var crud = new CRUD(modelname);
//     this.save =function(model,callback){
//         crud.create(model, function(data) {
//                 callback(data);
//             }
//         );
//     };

//     this.find =function (model, callback) {
//         crud.read(model, function (data) {
//             callback(data);
//         });
//     };
//     this.findBySort = function (model,sort, callback) {
//         crud.readBySort(model, sort, function (data) {
//             callback(data);
//         });
//     };
//     this.update =function (query, updateModel, callback) {
//         crud.update(query, updateModel, function (data) {
//             callback(data);
//         });
//     };
//     this.delete = function (query, callback) {
//         crud.deleteData(query, function (data) {
//             callback(data);
//         });
//     };
//     this.pages = function (query, pagenum, currentPage, sort, callback) {
//         if (sort) {
//             crud.page(query, pagenum, currentPage, function (data) {
//                 callback(data);
//             }, {sort: [sort]});
//         } else {
//             crud.page(query, pagenum, currentPage, function (data) {
//                 callback(data);
//             });
//         }

//     };
//     this.pagetotal = function (query, callback) {
//         crud.pagetotal(query, function (data) {
//             callback(data);
//         });
//     };
//     this.pagesSel = function (query, pagenum, currentPage, sort, callback) {
//         async.waterfall([
//             function pagetotal(cb) {
//                 crud.pagetotal(query, function (data) {
//                     cb(null, data);
//                 });
//             },
//             function page(cbv1, cb) {
//                 var pageObj = {};
//                 pageObj.pageing = {};
//                 if (cbv1 == 0) {
//                     pageObj.pageing.pages = 0;
//                     pageObj.pageing.page = 0;
//                     pageObj.pageing.page_size = 0;
//                     pageObj.pageing.records = 0;
//                     pageObj.data = [];
//                     cb(null, pageObj);
//                 }
//                 else {
//                     pageObj.pageing.pages = Math.ceil(cbv1 / pagenum);
//                     pageObj.pageing.page_size = pagenum;
//                     pageObj.pageing.records = cbv1;
//                     pageObj.pageing.page = currentPage;
//                     var orderby=null;
//                     if(sort){
//                         orderby={sort:[sort]}
//                     }
//                     crud.page(query, pagenum, currentPage, function (data) {
//                         pageObj.data = data;
//                         cb(null, pageObj);
//                     }, orderby);

//                 }
//             }
//         ], function (err, result) {
//             if (err) {
//                 result.code = 400;
//             } else {
//                 result.code = 200;
//             }
//             callback(result);
//         });

//     };
//     this.near = function (query, sort,callback) {
//         crud.near(query, sort,function (data) {
//             callback(data);
//         });
//     };
//     this.ensureIndex = function(query,callback){
//         crud.ensureIndex(query,function(data){
//             callback(data);
//         })
//     };
//     this.command = function(query,callback){
//         crud.command(query,function(data){
//             callback(data);
//         })
//     };

// };



const db = require('./../db/mongo.js');
const CRUD = require('./../db/CURD');
const async = require('async');

class pm {
    constructor(modelname) {
         this.crud = new CRUD(modelname);
    }
    save(model,callback){
        this.crud.create(model, (data) => {
            // try {
            //     if (data.status > 0) {
            //         callback({ code: 200, msg: '保存成功' });
            //     } else {
            //         callback({ code: 400, msg: '网络错误' });
            //     }
            // } catch (error) {
            //     callback({ code: 400, msg: '网络错误' })
            // }
            callback(data);
        });
    };

    find(model, callback) {
        this.crud.read(model, (data)=> {
            callback(data);
        });
    };
    findBySort(model,sort, callback) {
        this.crud.readBySort(model, sort, (data)=> {
            callback(data);
        });
    };
    findOne(query,sort,callback){
        this.crud.readOne(query,sort,(data)=>{
            callback(data);
        });
    };
    update(query, updateModel, callback) {
        this.crud.update(query, updateModel, (data)=> {
            callback(data);
        });
    };
    delete(query, callback) {
        this.crud.deleteData(query,(data)=> {
            callback(data);
        });
    };
    pages(query, pagenum, currentPage, sort, callback) {
        if (sort) {
            this.crud.page(query, pagenum, currentPage, (data)=> {
                callback(data);
            }, {sort: [sort]});
        } else {
            this.crud.page(query, pagenum, currentPage, (data)=> {
                callback(data);
            });
        }

    };
    pagetotal(query, callback) {
        this.crud.pagetotal(query,(data)=> {
            callback(data);
        });
    };
    pagesSel(query, pagenum, currentPage, sort, callback) {
        const that = this.crud;
        async.waterfall([
            function ptotal(cb) {
                that.pagetotal(query, (data)=> {
                    cb(null, data);
                });
            },
            function page(cbv1, cb) {
                let pageObj = {};
                pageObj.pageing = {};
                if (cbv1 == 0) {
                    pageObj.pageing.pages = 0;
                    pageObj.pageing.page = 0;
                    pageObj.pageing.page_size = 0;
                    pageObj.pageing.records = 0;
                    pageObj.data = [];
                    cb(null, pageObj);
                }
                else {
                    pageObj.pageing.pages = Math.ceil(cbv1 / pagenum);
                    pageObj.pageing.page_size = pagenum;
                    pageObj.pageing.records = cbv1;
                    pageObj.pageing.page = currentPage;
                    let orderby=null;
                    if(sort){
                        orderby={sort:[sort]}
                    }
                    that.page(query, pagenum, currentPage, (data)=> {
                        pageObj.data = data;
                        cb(null, pageObj);
                    }, orderby);

                }
            }
        ], function (err, result) {
            if (err) {
                result.code = 400;
            } else {
                result.code = 200;
            }
            callback(result);
        });

    };
    near(query, sort,callback) {
        this.crud.near(query, sort, (data)=> {
            callback(data);
        });
    };
    ensureIndex(query,callback){
        this.crud.ensureIndex(query,(data)=>{
            callback(data);
        })
    };
    command(query,callback){
        this.crud.command(query,data=>{
            callback(data);
        })
    };
    aggregate(array,callback){
        this.crud.aggregate(array,(data)=>{
            callback(data);
        });
    }
}

module.exports = pm;
