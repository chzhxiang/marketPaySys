/**
 * Created by terry on 15/8/1.
 */


var db = require('./mongo.js');


var status = require('./status.js');
var tool;

var mongoskin = require('mongoskin');
var ObjectID = require('mongodb').ObjectID;

var CRUD = function (collection) {
    tool = require('../controller/tool.js');
    this.collection = collection;

    db.bind(this.collection);

};
CRUD.prototype = {

    /*

     * @des: 创建一条记录

     * @model: 插入的记录，JSON格式的model

     * @callback：回调，返回插入成功的记录或者失败信息

     *

     * */

    create: function (model, callback) {
        model = tool.getTimeObject(model);//统一打时间戳
        db[this.collection].save(model, function (err, item) {

            if (err) {
                return callback(status.fail);

            }

            item.status = status.success.status;

            item.message = status.success.message;

            return callback(item);

        });

    },

    insert: function (array, callback) {
        // array=[model1,model2,model3] //批量保存
        db[this.collection].insert(array, function (err, item) {

            if (err) {
                return callback(status.fail);

            }

            item.status = status.success.status;

            item.message = status.success.message;

            return callback(item);

        });

    },
    /*

     * @des: 创建一条记录,并实现自动增长ID

     * @model: 插入的记录，JSON格式的model

     * @callback：回调，返回插入成功的记录或者失败信息

     *

     * */

    createAutoID: function (model, type, callback) {
        var collections = this.collection;
        db.bind("counters");
        db["counters"].findAndModify({ "_id": type }, [], { $inc: { 'sequence_value': 1 } }, { new: true, upsert: true }, function (a, b, c) {
            db.bind(collections);
            model[type] = b.sequence_value;
            model = tool.getTimeObject(model);//统一打时间戳
            db[collections].save(model, function (err, item) {

                if (err) {

                    return callback(status.fail);

                }

                item.status = status.success.status;

                item.message = status.success.message;

                return callback(item);

            });
        });
    },

    /*

     * @des：读取一条记录

     * @query：查询条件，Mongo查询的JSON字面量

     * @callback：回调，返回符合要求的记录或者失败信息

     *

     * */

    read: function (query, callback) {

        db[this.collection].find(query).toArray(function (err, items) {

            if (err) {

                return callback(status.fail);

            }

            var obj = {

                status: status.success.status,

                message: status.success.message,

                items: items

            };
            return callback(obj);

        });

    },

    readOptions: function (query, readOptions, callback) {

        db[this.collection].find(query, readOptions).toArray(function (err, items) {

            if (err) {

                return callback(status.fail);

            }

            var obj = {

                status: status.success.status,

                message: status.success.message,

                items: items

            };
            return callback(obj);

        });

    },


    readOne: function (query, sort, callback) {

        db[this.collection].findOne(query, sort, function (err, items) {

            if (err) {

                return callback(status.fail);

            }

            var obj = {

                status: status.success.status,

                message: status.success.message,

                items: items

            };
            return callback(obj);

        });



    },

    /**
     *  排序查询
     * @param query
     * @param sort {'id':1}  1:升序  -1 降
     * @param callback
     */
    readBySort: function (query, sort, callback) {


        if (sort) {
            db[this.collection].find(query, sort).toArray(function (err, items) {

                if (err) {

                    return callback(status.fail);

                }

                var obj = {

                    status: status.success.status,

                    message: status.success.message,

                    items: items

                };
                return callback(obj);

            });
        } else {
            db[this.collection].find(query).toArray(function (err, items) {

                if (err) {

                    return callback(status.fail);

                }

                var obj = {

                    status: status.success.status,

                    message: status.success.message,

                    items: items

                };
                return callback(obj);

            });
        }
    },


    readById: function (query, callback) {
        db[this.collection].find({ _id: ObjectID(query._id) }).toArray(function (err, items) {

            if (err) {

                return callback(status.fail);

            }

            var obj = {

                status: status.success.status,

                message: status.success.message,

                items: items

            };
            return callback(obj);

        });

    },


    /*

     * @des：更新一条记录

     * @query：查询条件，Mongo查询的JSON字面量，此处为_id

     * @updateModel：需要更新的JSON格式的模型

     * @callback：返回成功或者失败信息

     *

     * */

    update: function (query, updateModel, callback) {

        db[this.collection].update(query, updateModel, { multi: true }, function (err, data) {

            if (err) {

                return callback(status.fail);

            } else {

                var re = status.success;
                re.data = data;
                return callback(re);

            }

        });

    },
    /*

     * @des：删除一条记录

     * @query：查询条件，Mongo查询的JSON字面量

     * @callback：返回失败或者成功的信息

     *

     * */

    deleteData: function (query, callback) {

        db[this.collection].remove(query, function (err, size) {
            if (err) {

                return callback(status.fail);

            }
            var re = status.success;
            re.size = size;

            return callback(re);

        });

    },


    edit: function (query, updateModel, callback) {


        db[this.collection].update(query, updateModel, function (err) {

            if (err) {

                return callback(status.fail);

            } else {

                return callback(status.success);

            }

        });

    },

    //批量插入
    batchInsert: function (info, callback) {
        db[this.collection].insert(info, function (err) {
            if (err) {

                return callback(status.fail);

            } else {

                return callback(status.success);

            }
        });
    },
    pagetotal: function (query, callback) {
        db[this.collection].find(query).count(function (err, count) {
            if (err) {
                return callback(status.fail);
            }
            return callback(count);
        });
    },

    /*

     * @des：分页查询

     * @query：查询条件，Mongo查询的JSON字面量

     * @pagenum：分页数
     *
     * currentPage：当前页
     *
     * @callback：返回失败或者成功的信息

     *

     * */



    page: function (query, pagenum, currentPage, callback, sort) {
        var num = (currentPage - 1) * pagenum;
        if (sort) {
            db[this.collection].find(query, sort).skip(num).limit(pagenum).toArray(function (err, datas) {

                if (err) {
                    console.log(err);
                    return callback(status.fail);
                }
                return callback(datas);
            });
        }
        else {
            db[this.collection].find(query).skip(num).limit(pagenum).toArray(function (err, datas) {
                if (err) {
                    return callback(status.fail);
                }
                return callback(datas);
            });
        }


    },
    pageByTime: function (query, pagenum, callback, sort) {//时间分页
        db[this.collection].find(query, sort).limit(pagenum).toArray(function (err, datas) {
            if (err) {
                console.log(err);
                return callback(status.fail);
            }
            return callback(datas);
        });
    },
    aggregate: function (array, callback) {
        db[this.collection].aggregate(array, function (err, item) {

            if (err) {

                return callback(status.fail);

            }

            var re = {};
            re.items = item;

            re.status = status.success.status;

            re.message = status.success.message;

            return callback(re);

        });

    },

    //Query作为查询条件实现分页
    pageByQuery: function (query, pagenum, callback, sort) {
        if (sort) {
            db[this.collection].find(query, sort).limit(pagenum).toArray(function (err, datas) {

                if (err) {
                    //console.log(err);
                    return callback(status.fail);
                }
                return callback(datas);
            });
        }
        else {
            db[this.collection].find(query).limit(pagenum).toArray(function (err, datas) {
                if (err) {
                    return callback(status.fail);
                }
                return callback(datas);
            });
        }


    },

    /**
     * 查询附近
     * 
     * 
     */
    near: function (query, sort,callback) {
        if (sort) {
            db[this.collection].find(query,sort).toArray(function (err, datas) {
                console.log(err);
                if (err) {
                    return callback(status.fail);
                }
                return callback(datas);
            })
        } else {
            db[this.collection].find(query).toArray(function (err, datas) {
                console.log(err);
                if (err) {
                    return callback(status.fail);
                }
                return callback(datas);
            })
        }
        
    },

    /**
     * 创建2D空间索引
     * {location:'2dsphere'} 2dsphere支持球面检索  {location:'2d'}2d二维空间搜索
     * 
     */
    ensureIndex: function (query, callback) {
        db[this.collection].ensureIndex(query, function (err, data) {
            console.log(err);
            if (err) {
                return callback(status.fail);
            }
            return callback(data);
        })
    },

    command: function (query, callback){
        db.command({ geoNear : this.collection , near : query.near, num : query.num , spherical:true, 
        distanceMultiplier: 6378137, maxDistance:query.maxDistance,query:{type:query.type}},function (err, data) {
            console.log(err);
            if (err) {
                return callback(status.fail);
            }
            return callback(data);
        });
    } 
    

};


module.exports = CRUD;

