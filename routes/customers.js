var md5 = require('md5');
/*
 * GET users listing.
 */
exports.list = function(req, res){
    req.getConnection(function(err,connection){
        var session_var = req.session.get('is_login');
        if(session_var == '1')
        {
            var query = connection.query('SELECT * FROM customer ORDER BY id DESC',function(err,rows){
                if(err){
                    console.log("Error Selecting : %s ",err );
                    var msg = req.flash('msg');
                    res.render('customers',{page_title:"Customers",msg:msg,data:rows});
                }else{
                    console.log("Error Selecting : %s ",err );
                    var msg = req.flash('msg');
                    res.render('customers',{page_title:"Customers",msg:msg,imgpath:basepath,data:rows});
                }
            });
        }
        else
        {
            res.redirect('login');
        }
        //console.log(query.sql);
    });
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customer"});
};

exports.edit = function(req, res){
    var id = req.params.id;
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            if(err)
            console.log("Error Selecting : %s ",err );
            res.render('edit_customer',{page_title:"Edit Customer",data:rows});
         });
         //console.log(query.sql);
    }); 
};

/*Save the customer*/
exports.save = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var data = {
            name    : input.name,
            address : input.address,
            email   : input.email,
            password: input.password,
            phone   : input.phone 
        };

        var name = input.name;
        var address = input.address;
        var email = input.email;
        var password = md5(input.password);
        var phone = input.phone;

        var datetime = new Date();
        var utctime = datetime.valueOf();
        console.log('Image: '+req.files.imageName);

        if(req.files.imageName != undefined )
        {
            var file = req.files.imageName;
            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif")
            {
                var img_name = file.name;
                var newfilename = utctime+'.jpg';

                file.mv('public/images/'+newfilename, function(err){
                    if (err)
                    {
                        console.log("Error inserting : %s ",err );
                        res.redirect('/customers');
                    }
                    else
                    {
                        var sql = "INSERT INTO `customer`(`name`,`address`,`email`,`password`,`phone`,`imageName`) VALUES ('" + name + "','" + address + "','" + email + "','" + password + "','" + phone + "','" + newfilename + "')";

                        var query = connection.query(sql, function(err, rows) {
                            if(err)
                            {
                                req.flash('msg', 'failed');
                                res.redirect('/customers');    
                            }
                            else
                            {
                                req.flash('msg', 'success');
                                res.redirect('/customers');
                            }
                        });
                    }
                });
            }else{

                var sql = "INSERT INTO `customer`(`name`,`address`,`email`,`password`,`phone`) VALUES ('" + name + "','" + address + "','" + email + "','" + password + "','" + phone + "')";
                
                var query = connection.query(sql, function(err, rows) {
                    if(err)
                    {
                        req.flash('msg', 'failed');
                        res.redirect('/customers');    
                    }
                    else
                    {
                        req.flash('msg', 'success');
                        res.redirect('/customers');
                    }
                });

                /* console.log("Error Image upload ",file );
                res.redirect('/customers/add'); */
            }

        }else{
            var sql = "INSERT INTO `customer`(`name`,`address`,`email`,`password`,`phone`) VALUES ('" + name + "','" + address + "','" + email + "','" + password + "','" + phone + "')";
            
            var query = connection.query(sql, function(err, rows) {
                if(err)
                {
                    req.flash('msg', 'failed');
                    res.redirect('/customers');    
                }
                else
                {
                    req.flash('msg', 'success');
                    res.redirect('/customers');
                }
            });
        }

        /* var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        {
            if (err)
            console.log("Error inserting : %s ",err );
            res.redirect('/customers');
        }); */
        //console.log(query.sql); get raw query
    });
};

exports.save_edit = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var data = {
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        };
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {   
            if (err)
            console.log("Error Updating : %s ",err );
            req.flash('msg', 'update_success');
            res.redirect('/customers');
        });
    });
};

exports.delete_customer = function(req,res){
    var id = req.params.id;

    req.getConnection(function (err, connection) {
    connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
    {
        if(err)
            console.log("Error deleting : %s ",err );
            req.flash('msg', 'delete');
            res.redirect('/customers');
    });
    });
};


