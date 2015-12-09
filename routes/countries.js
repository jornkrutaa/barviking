exports.list = function(req, res){
    req.getConnection(function(err,connection){
    connection.query('SELECT * FROM country',function(err,rows)     {
        if(err)
            console.log("Error Selecting : %s ",err );
            res.render('countries',{page_title:"Countries - Node.js",data:rows});
        });
    });
};

/*
exports.list = function(req, res){
    req.getConnection(function(err,connection){
    connection.query('SELECT * FROM country',function(err,rows)     {
        if(err)
            console.log("Error Selecting : %s ",err );
            res.render('countries',{page_title:"Countries - Node.js",data:rows});
        });
    });
};
*/