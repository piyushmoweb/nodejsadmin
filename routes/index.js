
/*
 * GET home page.
 */

exports.index = function(req, res){
  req.getConnection(function(err,connection){
  var session_var = req.session.get('is_login');
  if(session_var == '1')
  {
    var query = connection.query('SELECT * FROM customer ORDER BY id DESC',function(err,rows){
      if(err)
      {
          console.log("Error Selecting : %s ",err );
          res.render('index',{page_title:"Dashboard",tot_customer:0});
      }else{
          res.render('index',{page_title:"Dashboard",tot_customer:rows.length});
      }
    });

    //res.render('index',{page_title:"Customers"});
  }else{
    res.redirect('login');
  }
  });
};
