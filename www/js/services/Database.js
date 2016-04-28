'use strict';

app.factory('Database',  function($ionicPlatform, $cordovaSQLite, $q, $timeout) {
 
 var userDetails = [];
	function SaveToDb(userData, role_type){
        $ionicPlatform.ready(function() {
	            
			    
	        
       $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id integer, firstname text, lastname text," +
                                "email_id text, contact text, login_id text, role_id integer, school_id integer," + 
                                "role_type text)");

		var query = "INSERT INTO user (id, firstname, lastname, email_id, contact, login_id,"+ 
                    "role_id, school_id, role_type) VALUES (?,?,?,?,?,?,?,?,?)";
        
        $cordovaSQLite.execute(db, query, [userData.id, userData.first_name, userData.last_name, userData.email_id, userData.contact, userData.login_id, userData.role_id, userData.school_id, role_type]).then(function(res) {
            alert("INSERT ID -> " + res.insertId);
            //console.log(res);
        }, function (err) {
            alert(err);
            //console.log(err);
        }); 
        
        var user = $cordovaSQLite.execute(db, "SELECT * FROM user");
        console.log(user);   

        });

	};

	function DropTable(table_name){
		$ionicPlatform.ready(function() {

			 $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS user").then(function(res) {
	   		      
	     	  }, function (err) {
	            //console.error(err);
	         });

		});
  
	};

	var GetUserData = function() {
		
		var q = $q.defer();

		    
		    $cordovaSQLite.execute(db, "SELECT * FROM user").then(function(res){
		    	q.resolve(res);
		    });

		    return q.promise;
		    
	}

return {

	addToDb: function(userData, role_type){
		
		SaveToDb(userData, role_type);
		
	},

	dropTable: function(){
		DropTable("user");
	},

	getUserData: GetUserData
};


});
