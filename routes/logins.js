var md5 = require('md5');
/*
 * GET users listing.
 */
exports.check = function(req, res){
    
    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function(err,connection){
        var email = input.email;
        var password = md5(input.password);

        var query = connection.query('SELECT * FROM customer WHERE email LIKE "'+email+'" AND password = "'+password+'"',function(err,rows){
            if(err)
            {
                console.log("Error Selecting : %s ",err );
                res.render('login',{page_title:"Login",error:"Email and Password does not match!"});
            }
            else
            {
                console.log("Error Else : %s ",rows );
                if(rows.length <= 0)
                {  
                    console.log("Error Selecting : %s ",rows );
                    res.render('login',{page_title:"Login",error:"Email and Password does not match!"});
                }
                else{
                    console.log("Email: ",email );
                    req.session.put('is_login', '1');
                    //res.render('customers',{page_title:"Customers - Node.js",data:rows});
                    res.redirect('/');
                }
            }
        });
         //console.log(query.sql);
    });
};

exports.login = function(req, res){
    res.render('login',{page_title:"Login",error:""});
};

exports.logout = function(req, res){
    req.session.forget('is_login');
    res.redirect('login');
};


