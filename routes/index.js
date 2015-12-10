var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bar Viking' });
});

router.get('/users', function(req,res,next){
    
    req.getConnection(function(err,connection){
        connection =  mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password : '',
            port : 3306,
            database:'barcrawl'
        });
        connection.query('SELECT * FROM user_account',function(err,rows)     {
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            console.log(rows);
            res.render('users',{page_title:"Users - Node.js",data:rows});
            connection.end();
        });
    });
});

module.exports = router;
