var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var pwHash = require('password-hash');
var fs = require('fs');
var jwt = require('jsonwebtoken');

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'barcrawl16',
    port     : 3307,
    database : 'barcrawl',
    debug    :  false
    // ssl      : {
    //             key: fs.readFileSync('./ssl/key.pem'),
    //             cert: fs.readFileSync('./ssl/cert.pem')
    //             }
});

var user = {};
var SECRET = 'ALLEBARANE';

// router.all('*', function(req, res, next){
//   if (req.secure) {
//     return next();
//   };
//   var HTTPS_PORT = 443;
//   console.log('https://localhost:'+HTTPS_PORT+req.url);
//     res.redirect('https://localhost:'+HTTPS_PORT+req.url);
//    //res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url);
// });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Bar Viking' }); //Only original
});

router.get('/views/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('../views/partials/' + name);
});

router.get('/getBarprofile', function (req, res) {
  var id = req.query.barid;
  var bar = getBarprofile(req,res,id);
});

router.get('/getAllBars', function(req, res, next) {
  var bars = getAllBars(req,res);
});

router.post('/logInAttempt', function(req, res, next){
    var fullBody = "";
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
      var decodedBody = JSON.parse(fullBody);
      var user = checkLogin(req, res, decodedBody.params.email, decodedBody.params.pw);
    });
});

router.post('/uploadImage', function(req,res,next){
    req.on('data', function(chunk) {
        var imageData = {'image': chunk, 'size': req.headers.size, 'name': req.headers.name, 'type': req.headers.type};
        console.log(imageData);
        console.log(req.headers);
        return insertImage(req,res,imageData);
    });
});

router.get('*', function(req, res, next) {
  res.render('index', { title: 'Bar Viking' });
});

function insertImage(req,res,data){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        
        var imgQuery = "insert into bar_image(image_type, image, image_size, image_name) values (?,?,?,?)";
        connection.query(imgQuery, [data.type, data.image, data.size, data.name], function(err,rows){
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            connection.release();
            return;
            // return res.json(rows);
        });
        
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });
}

function getBarprofile(req,res,id){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        
        var barQuery = "select b.*, ifnull((select bi.image from bar_image bi where b.image_id = bi.image_id), null) image, ifnull((select bi.image_type from bar_image bi where b.image_id = bi.image_id), 'image/png') image_type, p.name postal_place from bar b, place p where bar_id = ? and b.postal_no = p.postal_no";
        connection.query(barQuery, [id], function(err,rows){
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            // console.log(rows[0].image);
            return res.json(rows);
        });
        
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });
}

function getAllBars(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        } 
        
        var barQuery = "select AVG(ub.rating) rating, p.name, p.municipality, p.county, b.* from bar b, user_bar ub, place p where b.bar_id = ub.bar_id and b.postal_no = p.postal_no group by b.name order by b.name asc"
        connection.query(barQuery,function(err,rows)     {
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            return res.json(rows);
        });
        
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });
}

function checkLogin(req, res, email, pw){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        
        connection.query("select user_id, username, password, first_name, last_name, status_id, account_type from user_account where email = ?", [email], function(err,rows){
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            if(rows[0]){
                var verifyPw = pwHash.verify(pw, rows[0].password);
                if(verifyPw){
                    delete rows[0].password;
                    user = rows[0];
                    
                    //Create jwt
                    var claim = user;
                    user.body = {
                        token: jwt.sign(claim, SECRET)
                    }
                    return res.json(user);
                } else{
                    return false;
                }
            } else{
                return false;
            }
        });
        
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
    });
}

module.exports = router;
