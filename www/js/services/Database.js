'use strict';

app.factory('Database',  function($ionicPlatform, $cordovaSQLite, $q, $timeout, $rootScope) {
 
 var userDetails = [];

 	function CreateRoleTable(role_type){
 		$ionicPlatform.ready(function() {
	 		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS role (role_type text)");

			var query = "INSERT INTO role (role_type) VALUES (?)";
	        
	        $cordovaSQLite.execute(db, query, [role_type]).then(function(res) {
	            //alert("ROle INSERT ID -> " + res.insertId);
	            //console.log(res);
	        }, function (err) {
	            //alert(err);
	            //console.log(err);
	        });  

        });

 	};

 	function CreateParentTable(userData, role_type){
 		$ionicPlatform.ready(function() {
	 		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS parent (id integer, mom_fname text, mom_lname text," +
	                                "dad_fname text, dad_lname text, login_id text, email_id text, contact text," + 
	                                "role_type text, profile_image_url text)");

			var query = "INSERT INTO parent (id, mom_fname, mom_lname, dad_fname, dad_lname, login_id,"+ 
	                    "email_id, contact, role_type, profile_image_url) VALUES (?,?,?,?,?,?,?,?,?,?)";
	        
	        $cordovaSQLite.execute(db, query, [userData.id, userData.mom_fname, userData.mom_lname, userData.dad_fname, userData.dad_lname, userData.login_id, userData.email_id, userData.contact, role_type, $rootScope.profileImageUrl ]).then(function(res) {
	            //alert("Parent INSERT ID -> " + res.insertId);
	            console.log(res.rows);
	        }, function (err) {
	            //alert(err);
	            //console.log(err);
	        });  

        });

 	};

 	function CreateSchoolUserTable(userData, role_type){
 		$ionicPlatform.ready(function() {
	   	    
	       $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (id integer, first_name text, last_name text," +
	                                "email_id text, contact text, login_id text, role_id integer, school_id integer," + 
	                                "role_type text, school_name text, profile_image_url text)");

			var query = "INSERT INTO user (id, first_name, last_name, email_id, contact, login_id,"+ 
	                    "role_id, school_id, role_type, school_name, profile_image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
	        
	        $cordovaSQLite.execute(db, query, [userData.id, userData.first_name, userData.last_name, userData.email_id, userData.contact, userData.login_id, userData.role_id, userData.school_id, role_type, $rootScope.SchoolName, $rootScope.profileImageUrl ]).then(function(res) {
	            //alert("User INSERT ID -> " + res.insertId);
	            //console.log(res);
	        }, function (err) {
	            //alert(err);
	            //console.log(err);
	        });   
	        
        }); //EOF ionicPlatform.ready
 	}; // EOF function CreateSchoolUserTable

 	function CreateDeviceTokenTable(device_type, device_token){
 		$ionicPlatform.ready(function() {
	   	    
	       $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS deviceToken (device_type text, device_token text)");

			var query = "INSERT INTO deviceToken (device_type, device_token) VALUES (?,?)";
	        
	        $cordovaSQLite.execute(db, query, [device_type, device_token]).then(function(res) {
	            //alert("User INSERT ID -> " + res.insertId);
	            //console.log(res);
	        }, function (err) {
	            //alert(err);
	            //console.log(err);
	        });   
	        
        }); //EOF ionicPlatform.ready
 	}; // EOF function CreateSchoolUserTable

	function SaveToDb(userData, role_type){
        
        if (role_type == "Parent") {
        	CreateParentTable(userData, role_type)
        	CreateRoleTable(role_type)
        }
        else{
        	CreateSchoolUserTable(userData, role_type)
        	CreateRoleTable(role_type)
        }

	};

	function SaveDeviceToken(device_type, device_token){
		CreateDeviceTokenTable(device_type, device_token)
	};

	function DropTable(table_name){
		$ionicPlatform.ready(function() {

			 var query = "DROP TABLE IF EXISTS " + table_name;	
			 $cordovaSQLite.execute(db, query).then(function(res) {
	   		     
	     	  }, function (err) {
	            //console.error(err);
	         });

		});
  
	};


	var GetUserData = function(table_name) {
		
		var q = $q.defer();

		    var query = "SELECT * FROM " + table_name;
		    $cordovaSQLite.execute(db, query).then(function(res){
		    	q.resolve(res);
		    }, function (err) {
      q.resolve(err);
    });

		    return q.promise;
		    
	};
	var GetRole = function() {
		
		var q = $q.defer();

		    var query = "SELECT * FROM role";
		    $cordovaSQLite.execute(db, query).then(function(res){
		    	q.resolve(res);
		    });

		    return q.promise;
		    
	}

return {

	addToDb: function(userData, role_type){
		
		SaveToDb(userData, role_type);
		
	},

	SaveDeviceToken: function(device_type, device_token){
		
		SaveDeviceToken(device_type, device_token);
		
	},

	dropTable: function(table_name){
		DropTable(table_name);
	},

	getUserData: GetUserData,

	getRole: GetRole
};


});
