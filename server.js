var express = require('express');
var app = express();

//var jwt = require('express-jwt')
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger

var publicconfig=require('./config/config');
var multipart = require('connect-multiparty');
var route=require('./routes.js');
var multipartMiddleware = multipart({uploadDir:publicconfig.tmppath});
app.listen(5500);

app.use(bodyParser({limit:'2mb'}));//修改post body 内容最大值
app.use(morgan());
app.use(multipartMiddleware);
//var log = require('./logHelper');
//log.use(app);

var path = require('path');
var favicon = require('serve-favicon');




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);



module.exports = app;




app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,authorization,X_Requested_With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,post,get,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  if ('OPTIONS' == req.method){
    return res.send(200);
  }else{
    next();
  }

});
route.config(app);
