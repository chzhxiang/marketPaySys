/**
 * Created by terry on 16/3/9.
 */
/**
 * Created by terry on 15/12/22.
 */
var db = require('./../db/mongo.js'),
    CRUD = require('./../db/CURD.js');
var async = require('async');

var pm = function (modelname) {
    var crud = new CRUD(modelname);
    this.save =function(model,callback){
        crud.create(model, function(data) {
                callback(data);
            }
        );
    };

    this.find =function (model, callback) {
        crud.read(model, function (data) {
            callback(data);
        });
    };
    this.findBySort = function (model,sort, callback) {
        crud.readBySort(model, sort, function (data) {
            callback(data);
        });
    };
    this.update =function (query, updateModel, callback) {
        crud.update(query, updateModel, function (data) {
            callback(data);
        });
    };
    this.delete = function (query, callback) {
        crud.deleteData(query, function (data) {
            callback(data);
        });
    };
    this.pages = function (query, pagenum, currentPage, sort, callback) {
        if (sort) {
            crud.page(query, pagenum, currentPage, function (data) {
                callback(data);
            }, {sort: [sort]});
        } else {
            crud.page(query, pagenum, currentPage, function (data) {
                callback(data);
            });
        }

    };
    this.pagetotal = function (query, callback) {
        crud.pagetotal(query, function (data) {
            callback(data);
        });
    };
    this.pagesSel = function (query, pagenum, currentPage, sort, callback) {
        async.waterfall([
            function pagetotal(cb) {
                crud.pagetotal(query, function (data) {
                    cb(null, data);
                });
            },
            function page(cbv1, cb) {
                var pageObj = {};
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
                    var orderby=null;
                    if(sort){
                        orderby={sort:[sort]}
                    }
                    crud.page(query, pagenum, currentPage, function (data) {
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
    this.near = function (query, callback) {
        crud.near(query, function (data) {
            callback(data);
        });
    };

};

module.exports = pm;