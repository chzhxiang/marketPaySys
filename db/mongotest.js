/**
 * Created by terry on 15/7/31.
 */

var db = require('./mongo.js');
db.bind('admin');
db.users.find().toArray(function(err, items) {
    db.close();
});