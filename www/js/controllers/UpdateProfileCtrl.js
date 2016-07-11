'use strict';

app.controller('UpdateProfileCtrl', function($scope, $rootScope, $ionicLoading, $cordovaSQLite, $cordovaCamera, $http, $state, $ionicHistory, $ionicPopup, Database) {

	// Setup the loader
    $ionicLoading.show({
	    content: 'Loading',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 0
    });

	$scope.$on('$ionicView.beforeEnter', function() {
 		
      getUserData();
  	});//EOF $scope.$on	


	$scope.userDetails = [];
 	$scope.imageData = " ";
 	$scope.imgPictureFromUser = true;
 	$scope.defaultImage = false;
	//Get User data from local DB Sqlite
	function getUserData(){
		Database.getUserData("role").then(function(res){
		    var role_type = res.rows.item(0).role_type;

		    if (role_type == "Teacher") {
				Database.getUserData("user").then(function(res){
				    $scope.userDetails = res.rows.item(0);
				    console.log($scope.userDetails);
				    $scope.username = $scope.userDetails.first_name + " " + $scope.userDetails.last_name
				    
				    if ($scope.userDetails.profile_image_url.indexOf("missing") > -1) {    
                        $scope.imageUrl = "img/profile_default.jpg";
                    } 
                    else{
				    	$scope.imageUrl = "http://www.schooljuntos.com"+$scope.userDetails.profile_image_url
					}

				   	$ionicLoading.hide()
				    
				});
			}
			else{
				Database.getUserData("parent").then(function(res){
					$scope.notParent = true;
				    $scope.userDetails = res.rows.item(0);
				    $scope.username = $scope.userDetails.dad_fname + " " + $scope.userDetails.dad_lname
				    
				    if ($scope.userDetails.profile_image_url.indexOf("missing") > -1) {    
                        $scope.imageUrl = "img/profile_default.jpg";
                    } 
                    else{
				    	$scope.imageUrl = "http://www.schooljuntos.com"+$scope.userDetails.profile_image_url
					}

				    $ionicLoading.hide()
				    
				   
				});

			}	


		}); //EOF getUserData()
	}	

	$scope.takePhoto = function() {

	
    var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 750,
            targetHeight: 750,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };


     $cordovaCamera.getPicture(options).then(function(imageData) {
     		
     		$scope.imageUrl  = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;

            updateUser();
        }, function(err) {
            

        });   
    
  }// EOF takePhoto function.

  function updateUser(){
  	$http({
            url: 'http://www.schooljuntos.com/api/school_users/update_user',
            method: "post",
            transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                      return str.join("&");
                  },
            data: {'image': $scope.imageData,
                   'fileName': "ProfileImage_" + $scope.username,
                   'user_id': $scope.userDetails.id,
                   'role_type': $scope.userDetails.role_type
                    },
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
        }).success(function (status) {
              
              updateUserTable(status.id, status.image_url);
               var alertPopup = $ionicPopup.alert({
                 title: 'Message',
                 template: 'Image Updated!'
               });
            }).error(function (status) {
               //alert("Err");
            });
  }

function updateUserTable(user_id, image_url){
	
	if ($scope.userDetails.role_type == "Teacher") {
		var query = "UPDATE user SET profile_image_url = "+ "'" +image_url+ "'" +"WHERE id="+user_id;
	}
	else{
		var query = "UPDATE parent SET profile_image_url = "+ "'" +image_url+ "'" +"WHERE id="+user_id;
	}
	
	        
	        $cordovaSQLite.execute(db, query).then(function(res) {
	           
	            
	        }, function (err) {
	            
	            
	        });
}



});//End of controller