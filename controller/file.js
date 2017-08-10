/**
 * Created by terry on 15/9/7.
 */
var fs = require('fs');

var publicconfig=require('./../config/config.js');

//7牛文件服务 -- start --
var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = publicconfig.Access_Key;
qiniu.conf.SECRET_KEY = publicconfig.Secret_Key;
var bucket = publicconfig.BucketName;


/**
 * //构造上传函数
 * @param key  上传后的文件
 * @param localFile 需要上传的文件
 */
var upload7N=function uploadFile(key, localFile,fn) {

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        //putPolicy.callbackUrl = 'http://your.domain.com/callback';
        //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
        return putPolicy.token();
    }

    //生成上传 Token
    var token = uptoken(bucket, key);

    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {

        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
        fn(err, ret);
    });

};

exports.fileUpload7niu=function(key,localFile,cb){
    upload7N(key, localFile,function(ret){
        cb(ret);
    });
};

exports.upload = function (req, res) {
    if(req.query.action){
        if(req.query.action=='config'){
            return config(req,res);
        }else if(req.query.action=='uploadimage'|req.query.action=='mulituploadimage'){
            return uploadimage(req,res);
        }else if(req.query.action=='uploadImageByBase64'){
            return uploadImageByBase64(req,res);
        }else{
            return listimage(req,res);
        }
    }else{
        return uploadimage(req,res);
    }

};

exports.uploadImageByBase64 = function (req, res) {
    uploadImageByBase64(req,res)
};

function config(req, res) {
    return res.jsonp(require('./config.json'));
};
//单图上传 来源于富文本框
function uploadimage(req, res) {
    var userpath;
    if(req.user){
         userpath=req.user.user.wxu;
    }else if(req.body.username){
        userpath=req.body.username;
    }


        var tmp_path,
         targfilename,filesize,filetype;
        if(req.query.action=='uploadimage'){
             tmp_path = req.files.upfile.path;
             targfilename=req.files.upfile.name;
            filesize=req.files.upfile.size;
            filetype=req.files.upfile.type;
        }else{
            tmp_path =req.files.myFile.path;
            targfilename=req.files.myFile.name;
            filesize=req.files.myFile.size;
            filetype=req.files.myFile.type;
        }

        targfilename=(new Date()).valueOf()+targfilename.substr(targfilename.lastIndexOf('.',targfilename.length));

        var keyPath='/images/'+userpath+'/' + targfilename;
        upload7N(keyPath,tmp_path,function(err,ret){

            if(!err){

                //生成链接url
                var downloadUrl = publicconfig.DomainName+encodeURIComponent('@'+keyPath);

                data={};
                data.state='SUCCESS';
                data.url=downloadUrl;
                data.title=targfilename;
                data.original=targfilename;
                data.type=filetype;
                data.size=filesize;
                data.mtime=new Date().getTime();
                console.log(JSON.stringify(data));

                // fs.unlink(tmp_path);
                return res.jsonp(data);

            }

    })

};
/// 在线管理
function listimage(req, res) {
    /*var userimgFile={};
    imgFile.findImgByUserid(userimgFile,function(data){
        var total = 0, list = [];
        if(data.status && data.status=='1'){
            data.items.forEach(function(e){
               list.push({
                   url: e.url,
                   mtime: e.mtime?new Date().getTime():e.mtime,
                   title: e.title,
                   id: e._id
               })
            });
        }
        total=list.length;
        res.jsonp({
            state: total === 0 ? 'no match file' : 'SUCCESS',
            list: list,
            total: total,
            start: req.query.start
        });
    })*/
    var userpath=req.user.user.wxAppId;
    var target_path = publicconfig.filepath+'/'+userpath;

    fs.readdir(target_path, function (err, files) {
        var total = 0, list = [];
       // files.sort().splice(req.query.start, req.query.size).forEach(function (a, b) {
        if(files){
            files.sort().forEach(function (a, b) {
                /^.+.\..+$/.test(a) &&
                list.push({
                    url: 'http://'+publicconfig.fileserverid+'/images/'+userpath+'/' + a,
                    mtime: new Date(fs.statSync(target_path+'/' + a).mtime).getTime(),
                    title:a,
                    id:a
                });
            });
        }

        total = list.length;
        res.json({
            state: total === 0 ? 'no match file' : 'SUCCESS',
            list: list,
            total: total,
            start: req.query.start
        });
    });

};

/**
 * //构造上传函数
 * @param key  上传后的文件
 * @param fileStr base64字符窜
 */
var upload7NByBase64=function uploadFile(key,fileType,fileStr,fn) {

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }

    //生成上传 Token
    var token = uptoken(bucket, key);

    var extra = new qiniu.io.PutExtra();
    extra.mimeType=fileType;
    var base64Data = fileStr.replace(/^data:image\/\w+;base64,/, "").replace(/\s/g,"+");
    var dataBuffer = new Buffer(base64Data, 'base64');
    qiniu.io.put(token, key, dataBuffer, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
        fn(err, ret);
    });

};

/**
 * //构造上传函数
 * @param key  上传后的文件
 * @param fileType 文件类型
 * @param dataBuffer buffer内容
 */
var upload7NByBuffer=function uploadFile(key,fileType,dataBuffer,fn) {

    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    function uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }

    //生成上传 Token
    var token = uptoken(bucket, key);
    var extra = new qiniu.io.PutExtra();
    extra.mimeType=fileType;
    qiniu.io.put(token, key, dataBuffer, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
        fn(err, ret);
    });

};

//单图上传 base64字符
function uploadImageByBase64(req, res) {

    var userpath=9999;

    var tmp_path,targfilename,filesize,filetype,fileStr;

    if(req.user&&req.user.user.wxu)
    {
        userpath=req.user.user.wxu;
    }
    else if(req.body.wxu)
    {
        userpath = req.body.wxu;
    }else{
        userpath=9999;
    }

    var tmp_path,targfilename,filesize,filetype,fileStr;

    targfilename=req.body.name;
    filesize=req.body.size;
    filetype=req.body.type;
    fileStr=req.body.data;
    targfilename=(new Date()).valueOf()+targfilename.substr(targfilename.lastIndexOf('.',targfilename.length));

    var keyPath='/images/'+userpath+'/' + targfilename;
    upload7NByBase64(keyPath,filetype,fileStr,function(err,ret){

        if(!err){
            //生成链接url
            var downloadUrl = publicconfig.DomainName+encodeURIComponent('@'+keyPath);
            var endUrl=downloadUrl;
            if(downloadUrl.indexOf('http://')<0){
                endUrl='http://'+downloadUrl;
            }
            var data={};
            data.state='SUCCESS';
            data.url=endUrl;
            data.title=targfilename;
            data.original=targfilename;
            data.type=filetype;
            data.size=filesize;
            data.mtime=new Date().getTime();
            return res.json({code:200,data:data,msg:'上传成功'});
        }
    })

};

exports.uploadQRcode=function(wxu,fileBuffer,cb){
    var times = new Date().getTime();//以时间戳命名
    var keyPath='/images/'+"QRcode"+'/'+wxu+"_"+ times+".png";
    upload7NByBuffer(keyPath,'image/png',fileBuffer,function(err,data){
        console.log(data);
        if(!err){
            var downloadUrl = publicconfig.DomainName+encodeURIComponent('@'+keyPath);
            cb(downloadUrl);
        }else{
            cb();
        }
    });
};

