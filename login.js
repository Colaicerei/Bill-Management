module.exports = function(){
	var express = require('express');
    var router = express.Router();

    function getEmail(req,res, mysql, context, complete){
		var query = "SELECT User_ID, First_Name, Last_Name FROM User u WHERE u.Email=?";
		console.log(req.query.Email);
		var inserts = [req.query.Email]
		mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            // }else if (results === undefined || results.length == 0) {
            // 	context.username = undefined;

            }else{
            	context.username = results[0];
            	console.log(results);
            
            	complete();
            }
		});
  }


    router.get('/', function(req, res){
    	res.render('login');
    });


	
	/*Create a user insert data into database*/
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES (?,?,?,?)";
		var inserts = [req.body.First_Name, req.body.Last_Name, req.body.Email, req.body.Phone];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/login');
            }
		});
	});

	 /*Login */
	router.get('/email/', function(req, res){
		callback = 0;
		var context = {};
		var mysql = req.app.get('mysql');

		// console.log(req);
		getEmail(req, res, mysql, context, complete);
		function complete(){
			callback++;
			if(callback>=1){
				if(context.username === undefined || context.username.length == 0 ){
					res.redirect('/login');
				}else{
					res.redirect('/home/' + context.username.User_ID);
				}	
			}	
		}
	});

/**https://stackoverflow.com/questions/53797147/sending-query-params-forth-to-another-page-with-post-in-node-js-and-express*/

	return router;
}();



/*
/* eslint-disable camelcase, import/newline-after-import */
const express = require('express');
const router = express.Router();
const userData = require('../data/users.json');
const helpers = require('../../app/helpers');


/* GET Login page. */
router.get('/', (req, res, next) => {
    if (req.session.user != null) {
        res.render('index', {
            title: 'Home',
            success: true,
            response: 'Login successful!',
            session: req.session,
        });
    } else {
        res.render('login', {
            title: 'Login',
        });
    }
});


/* process user login attempt */
router.post('/', (req, res, next) => {
    // check if the user login credentials are valid
    const users = helpers.sanitizeJSON(userData);
    const { user_name: uname, user_password: upass } = req.body;

    const userList = Object.keys(users).map(user => users[user]);
    const isValidUser = userList.some(user => user.user_name === uname && user.user_password === upass);


    // if the user login was successful, setup the user session
    if (isValidUser) {
        req.session.cookie.maxAge = 60 * 60 * 1000;
        req.session.user = uname;
        req.session.deployment = null;
        res.redirect('update');
    } else {
        res.render('login', {
            title: 'Login',
            success: false,
            response: 'Login unsuccessful',
            session: req.session,
        });
    }
});


module.exports = router;
 */