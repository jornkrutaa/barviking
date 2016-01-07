var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'barcrawl',
    debug    :  false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Index called");
  prepareAndRenderIndex(req,res);
});

router.get('/views/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('../views/partials/' + name);
});

router.get('/getAllBars', function(req, res, next) {
  console.log("Get All Bars - Backend");
  var bars = getAllBars(req,res);
});

router.get('*', function(req, res, next) {
  console.log("Catch all (*) called");
  res.render('index', { title: 'Bar Viking' });
});

function prepareAndRenderIndex(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        } 
        
        var barQuery = "select AVG(ub.rating) rating, b.* from bar b, user_bar ub where b.bar_id = ub.bar_id group by b.name order by b.name asc"
        connection.query(barQuery,function(err,rows)     {
            if(err){
                console.log("Error Selecting : %s ",err );
            }
            
            var topRated = rows.sort(function(a,b){
                return b.rating - a.rating;
            })
            res.render('index', { title: 'Bar Viking', data: rows });
            connection.release();
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

module.exports = router;
