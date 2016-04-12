'use strict';

app.controller('SideMenuCtrl', function($scope, $http, $state) {
 
$scope.isTeacher = false;
$scope.isParent = false;

if (window.localStorage['role'] == "Parent") {

  $scope.isParent = true;

  $scope.sideMenu = [];
  var student_Ids = [];
  $scope.string_student_Ids = "";
  
     //get class list
     $http.get('http://45.55.47.132/api/parents/getChildList?parent_id= ' + window.localStorage['parent_id']) 
           .success(function(response){
            
            angular.forEach(response, function(child){
             student_Ids.push(child.id)
             $scope.sideMenu.push(child);  
            
            });
            localStorage.setItem("student_Ids", JSON.stringify(student_Ids));
            $scope.string_student_Ids = localStorage.getItem("student_Ids").replace("[","(");
            $scope.string_student_Ids = $scope.string_student_Ids.replace("]",")");
          });
    }



//chech userId
  else {
     $scope.isTeacher = true;
     $scope.sideMenu = [];
     //get class list
     $http.get('http://45.55.47.132/api/school_users/getClassList?user_id= ' + window.localStorage['user_id'] + '&school_id=' + window.localStorage['school_id']) 
           .success(function(response){
            
            angular.forEach(response, function(child){
             
             $scope.sideMenu.push(child);  
            
            });
          });
    };

});
