'use strict';

app.controller('LoginCtrl', function($ionicPlatform, $rootScope, $scope, $http, $state, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $timeout, $cordovaSQLite, Database, EventDetail) {

  //$ionicSideMenuDelegate.canDragContent(false)
  $scope.$on('$ionicView.enter', function() {
      localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $scope.credentials = {
        user: '',
        password: '',
        userParent: ''
      };
      $scope.loginFailed = false;
  });//EOF $scope.$on
  
  $scope.credentials = {
    user: '',
    password: '',
    userParent: ''
  };
  $scope.loginFailed = false;
  $scope.ionSpinner = false;

 


  $scope.openLink = function(){
          var url = "http://www.schooljuntos.com/home/terms"

          window.open(url, '_blank');
        };

  $scope.login = function(formValid) {

    //addToDb("fname","lname");
   Database.dropTable("role");
   Database.dropTable("user");
   Database.dropTable("parent");
   

   $scope.loginFailed = false;
   $scope.ionSpinner = true;

   if (formValid == false) {
    $scope.ionSpinner = false;
    var alertPopup = $ionicPopup.alert({
     title: 'LogIn Error!',
     template: 'Please enter a Username and Password to continue.'
    });
    
    exit;
   };

    if ($scope.credentials.userParent) {



        $http({
                url: 'http://www.schooljuntos.com/api/parents/check_login',
                method: "post",
                transformRequest: function(obj) {
                          var str = [];
                          for(var p in obj)
                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                          return str.join("&");
                      },
                data: {'username':   $scope.credentials.user,
                       'password': $scope.credentials.password
                      },
                headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
             }).success(function (response) {
                   if(response == 'Invalid Credentials'){
                    $scope.loginFailed = true;
                   }
                   else {
                    window.localStorage['parent_id'] = response.id
                    window.localStorage['role'] = "Parent"
                    window.localStorage['user_name'] = response.dad_fname + " " + response.dad_lname
                    $rootScope.profileImageUrl = response.image_url;
                    Database.addToDb(response, "Parent");
                    saveDeviceInformation(response.id, "Parent");
                    $state.go('tab.home');
                   }
                   $scope.ionSpinner = false;
                   
                }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
    }
    else{
   
      $http.get('http://www.schooljuntos.com/api/home/attempt_login?username=' + $scope.credentials.user +'&password=' +$scope.credentials.password) 
      .success(function(response){
              if(response == 'Invalid Credentials'){
                    $scope.loginFailed = true;
              }
              else {
              window.localStorage['user_id'] = response.authorized_user.id
              window.localStorage['school_id'] = response.authorized_user.school_id
              window.localStorage['role_id'] = response.authorized_user.role_id
              window.localStorage['user_name'] = response.authorized_user.first_name + " " +response.authorized_user.last_name
              window.localStorage['role'] = response.role_type

              //$ionicSideMenuDelegate.canDragContent(true)
              //$ionicHistory.nextViewOptions({historyRoot: true});
              $rootScope.SchoolName = response.school.school_name;
              $rootScope.profileImageUrl = response.authorized_user.image_url;
              console.log($rootScope.profileImageUrl);
              Database.addToDb(response.authorized_user, response.role_type)
              saveDeviceInformation(response.authorized_user.id, response.role_type);
              

              $state.go('tab.home');
              }
              $scope.ionSpinner = false;
               console.log(response);  
            }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
      }
  };//EOF login function



  function saveDeviceInformation(user_id, role_type){
      //Database.dropTable("deviceToken");

        Database.getUserData("deviceToken").then(function(res){
                    $scope.deviceDetails = res.rows;
                    
                    if ($scope.deviceDetails.length > 0) {
                      //alert($scope.deviceDetails.length)
                      var length = $scope.deviceDetails.length;
                      //alert($scope.deviceDetails.item(length -1).device_token)

                      $http({
                              url: 'http://www.schooljuntos.com/api/home/save_devise_information',
                              method: "post",
                              transformRequest: function(obj) {
                                        var str = [];
                                        for(var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                        return str.join("&");
                                    },
                              data: {'user_id':   user_id,
                                     'devise_type': $scope.deviceDetails.item(0).device_type,
                                     'devise_token': $scope.deviceDetails.item(0).device_token,
                                     'role_type': role_type
                                     
                                    },
                              headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
                          })// EOF http post

                    }//EOF if condition 
                   
        }); //EOF Database.getUserData()

                   
                   
       

  }//EOF  saveDeviceInformation()



});