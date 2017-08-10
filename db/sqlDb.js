/**
 * Created by Administrator on 2017/8/1.
 */
const sql = require('mssql');

const sqlCRUD = function(initDbConfig){
   this.initDbConfig = initDbConfig;
};
sqlCRUD.prototype = {

    /*

     * @des：读取记录

     * @query：查询条件

     * @callback：回调，返回符合要求的记录或者失败信息

     *

     * */

    read: function(query, callback){
        sql.connect(this.initDbConfig).then(function () {
            new sql.Request().query(query).then(function (reData) {
                callback({status:200,data:reData.recordset});
            }).catch(function (err) {
                console.log(err);
                callback({status:400,err:err});
            });
        }).catch(function (err) {
            console.log(err);
            callback({status:400,err:err});
        });

    },

    /*

     * @des：更新一条记录

     * @query：查询条件

     * @updateModel：需要更新的JSON格式的模型

     * @callback：返回成功或者失败信息

     *

     * */

    update: function(query, updateModel, callback){

        sql.connect(this.initDbConfig).then(function () {
            new sql.Request().query(query).then(function (reData) {
                callback({status:200,data:reData.recordset});
            }).catch(function (err) {
                console.log(err);
                callback({status:400,err:err});
            });
        }).catch(function (err) {
            console.log(err);
            callback({status:400,err:err});
        });

    }
};


module.exports = sqlCRUD;