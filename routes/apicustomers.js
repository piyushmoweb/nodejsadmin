/*
 * GET users listing.
 */
exports.list = function(req, res){
    req.getConnection(function(err,connection){
        
        var query = connection.query('SELECT * FROM customer ORDER BY id DESC',function(err,rows){
            var data_val = new Array();
            var d = new Object();
            var subcatImg = '';
            for (i = 0; i < rows.length; i++) 
            {
                imgName = basepath+'/'+rows[i]['imageName'];
                data_val.push({
                    customerId: rows[i]['id'],
                    name: rows[i]['name'],
                    email: rows[i]['email'],
                    phone: rows[i]['phone'],
                    imageName: imgName
                });
            }
        
            var json_response = {msg:'Sub category list',status:'True',errorcode:'1',data:data_val}
            res.end( JSON.stringify(json_response) ); 
        });
    });
};