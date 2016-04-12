'use strict';

app.controller('LoginCtrl', function($ionicPlatform, $scope, $http, $state, $ionicHistory, $ionicSideMenuDelegate, $ionicPopup, $timeout, $cordovaSQLite) {

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


  function addToDb(firstname, lastname){
        var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
        //alert(query);
        //var db = $cordovaSQLite.openDB({ name: "my.db" });
        
        
        db = $cordovaSQLite.openDB("my.db");
        
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
        alert("After db open");
        $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
            alert("INSERT ID -> " + res.insertId);
        }, function (err) {
            alert(err);
        });
        

  };

  $scope.openLink = function(){
          var url = "http://www.schooljuntos.com/home/terms"

          window.open(url, '_blank');
        };

  $scope.login = function(formValid) {


    

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
                    window.localStorage['user_name'] = response.dad_fname + response.dad_lname
                    $state.go('tab.home');
                   }
                   $scope.ionSpinner = false;
                   
                }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
    }
    else{
    
      $http.get('http://45.55.47.132//api/home/attempt_login?username=' + $scope.credentials.user +'&password=' +$scope.credentials.password) 
      .success(function(response){
              if(response == 'Invalid Credentials'){
                    $scope.loginFailed = true;
              }
              else {
              window.localStorage['user_id'] = response.id
              window.localStorage['school_id'] = response.school_id
              window.localStorage['role_id'] = response.role_id
              window.localStorage['user_name'] = response.first_name + response.last_name

              //$ionicSideMenuDelegate.canDragContent(true)
              //$ionicHistory.nextViewOptions({historyRoot: true});
              $state.go('tab.home');
              }
              $scope.ionSpinner = false;
                 
            }).error(function (response) {
                   $scope.loginFailed = true;
                   $scope.ionSpinner = false;
                });
      }
  };

});