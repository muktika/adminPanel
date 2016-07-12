var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

var server = app.listen(4000, function() {
  console.log('Listening on port %d', server.address().port);
});

var fs = require('fs');
var gcloud = require('gcloud');
var request = require('request');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/public/upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage });
var multiupload = upload.single('file');
app.use(multiupload);
 
var gcs = gcloud.storage({
  projectId: projectID,
  keyFilename: 'path to key file'
});


var bucket = gcs.bucket('bucket name');
var pdfbucket = gcs.bucket('bucket name');

app.post('/uploadImage', function(req, res) {
  multiupload(req, res, function (err) {
		if (err) {
		  res.status(200).json(err);
		  console.log(err);
      res.send("Error");
		  res.end();
		}
  var filename = req.file.filename;
  var name = req.body.id + "-" + req.body.orgCode + "-";
  bucket.upload( __dirname+'/public/upload/'+filename, {predefinedAcl: "publicRead"}, function(err, file) {
     if (!err) {
       console.log("created: ",filename);
       res.send(filename);
       res.end();
     }else{
       res.send("Error");
       console.log(err);
       res.end();
     }
    });
  });
});

app.post('/uploadUrl', function(req, res) {
  var url = req.body.link;
  var name = req.body.id + "-" + req.body.orgCode + "-";
  var filename = url.substr(url.lastIndexOf("/") + 1, url.length);
  filename = name + filename;
  var file = fs.createWriteStream( __dirname+'/public/upload/'  + filename);
  var stream = request.get(url)
  .on('error', function(err) { 
      console.log(err);
      res.send("Error");
      res.end();
    })
  .on('response', function(response){
      var type = response.headers['content-type']; 
        if(type.includes("image",0)){
          res.send(filename);
          res.end();
        }else{
          res.send("TypeError");
          console.log("TypeError occurred");
          res.end();
        }    
    })
    .pipe(file)
    .on('finish', () =>{
        bucket.upload( __dirname+'/public/upload/' + filename, {predefinedAcl: "publicRead"}, function(err, file) {
         if (err) {
           res.send("Error");
           console.log(err);
           res.end();
           return
         }
        }); 
    });  
     
});

app.post('/uploadPdf', function(req, res) {
  multiupload(req, res, function (err) {
    if (err) {
      res.status(200).json(err);
      console.log(err);
      res.send("Error");
      res.end();
    }
  var filename = req.file.filename;
  pdfbucket.upload( __dirname+'/public/upload/'+filename, {predefinedAcl: "publicRead"}, function(err, file) {
     if (!err) {
       console.log("created");
       res.send(filename);
       res.end();
     }else{
       res.send("Error");
       res.end();
       console.log(err);
     }
    });
  });
});

app.post('/uploadPdfUrl', function(req, res) {
  var url = req.body.link;
  var filename = url.substr(url.lastIndexOf("/") + 1, url.length);
  var name = req.body.id + "-";
  var filename = name + filename;
  var file = fs.createWriteStream( __dirname+'/public/upload/'  + filename);
  var stream = request.get(url)
    .on('error', function(err) { 
      console.log(err);
      res.send("Error");
      res.end();
    })
    .on('response', function(response){
        var type = response.headers['content-type']; 
        if(type == "application/pdf" || type == "application/msword" || type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            res.send(filename);
            res.end();
        }else{
      res.send("TypeError");
            console.log("TypeError occurred",type);
            res.end();
        }
    })
    .pipe(file)
    .on('finish', () =>{
        console.log("created");
        pdfbucket.upload( __dirname+'/public/upload/'+filename, {predefinedAcl: "publicRead"}, function(err, file) {
           if (err) {
             res.send("Error");
             console.log(err);
             res.end();
             return
           }
          });
    });  
});




