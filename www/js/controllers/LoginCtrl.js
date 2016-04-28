'use strict';

app.controller('LoginCtrl', function($ionicPlatform, $scope, $http, $state, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $timeout, $cordovaSQLite, Database, EventDetail) {

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
});
  
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
   Database.dropTable() 
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
                url: 'http://45.55.47.132/api/parents/check_login',
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
                    $state.go('tab.home');
                   }
                   $scope.ionSpinner = false;
                   
                }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
    }
    else{
   
      $http.get('http://localhost:3000/api/home/attempt_login?username=' + $scope.credentials.user +'&password=' +$scope.credentials.password) 
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
              Database.addToDb(response.authorized_user, response.role_type)
        
              $state.go('tab.home');
              }
              $scope.ionSpinner = false;
               console.log(response);  
            }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
      }
  };

});