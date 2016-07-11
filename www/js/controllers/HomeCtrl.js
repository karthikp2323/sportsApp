'use strict';

app.controller('HomeCtrl', function($scope, $rootScope, $ionicLoading, $http, $state, $ionicHistory, Database) {

	
	document.addEventListener("resume", function(){
                  getUnreadDetails();
    }); 

 	$scope.$on('$ionicView.enter', function() {
 		// alert("on enter");
      //console.log("Id:"+ $scope.userDetails.id  );
      if($scope.userDetails.id != undefined){
      	$scope.unReadMessages = 0;
      	//getUserData();
      }
      getUserData();
  	});//EOF $scope.$on	

 	$scope.userDetails = [];
 	$scope.unReadMessages = 0;
 	$scope.unReadActivities = 0;
	//Get User data from local DB Sqlite
	function getUserData(){
	Database.getUserData("role").then(function(res){
	    var role_type = res.rows.item(0).role_type;

	    if (role_type == "Teacher") {
			Database.getUserData("user").then(function(res){
			    $scope.userDetails = res.rows.item(0);
			    $scope.username = $scope.userDetails.first_name + " " + $scope.userDetails.last_name
			   
			    if ($scope.userDetails.profile_image_url.indexOf("missing") > -1) {    
                        $scope.imageUrl = "img/profile_default.jpg";
                    } 
                    else{
				    	$scope.imageUrl = "http://www.schooljuntos.com"+$scope.userDetails.profile_image_url
					}
			    //$rootScope.role_type = $scope.userDetails.role_type
			    //$rootScope.user_id = $scope.userDetails.id
			    getUnreadDetails();
			});
		}
		else{
			Database.getUserData("parent").then(function(res){
			    $scope.userDetails = res.rows.item(0);
			    $scope.username = $scope.userDetails.dad_fname + " " + $scope.userDetails.dad_lname
			   // alert($scope.userDetails.profile_image_url);
			    if ($scope.userDetails.profile_image_url.indexOf("missing") > -1) {    
                        $scope.imageUrl = "img/profile_default.jpg";
                    } 
                    else{
				    	$scope.imageUrl = "http://www.schooljuntos.com"+$scope.userDetails.profile_image_url
					}
			    getUnreadDetails();
			});

		}	


	}); //EOF getUserData()
}

	//get unread message and event details
	function getUnreadDetails(){
	     $http.get('http://www.schooljuntos.com/api/messages/details_unread?user_id= ' + $scope.userDetails.id + '&role_type=' + $scope.userDetails.role_type) 
	           .success(function(response){
		            angular.forEach(response, function(child){
	             		
		             	$scope.unReadMessages = $scope.unReadMessages + child.unread_messages;
		             	$scope.unReadActivities = $scope.unReadActivities + child.unread_events;
		            	
		            });
	            
	          });
	}
	

});
