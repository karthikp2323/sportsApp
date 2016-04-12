'use strict';

app.controller('ActivityCntrl', function($scope, $state, $http, $cordovaCamera, $cordovaFileTransfer, $base64, $stateParams, $ionicPlatform, $location, $ionicHistory, $ionicPopup, $timeout, Parent) {
   //alert("Hi");
   
   $ionicPlatform.registerBackButtonAction(function (event) { 
    event.preventDefault(); 
   }, 100) 

   
   $scope.activityList = [];
   $scope.ifNoActivities = false;
   $scope.noMoreItemsAvailable = false;

   if (window.localStorage['role'] == 'Parent') {

    var studentId = $stateParams.classId;
    $scope.activityList = [];
          $http.get('http://45.55.47.132/api/activities/getActivities?student_id='+studentId + '&role_type=Parent'+ '&page=1') 
             .success(function(response){
              
                if (response.length == 0) {
                  $scope.ifNoActivities = true;
                }

                else{
                  $scope.ifNoActivities = false;
                  angular.forEach(response, function(child){
                        
                        if (child.image_url.indexOf("missing") > -1) {    
                        child.checkimage_url = false;} 
                        else{ child.checkimage_url = true; };

                  $scope.activityList.push(child);  
                  });
                }
            });

   }
   else{    

     $scope.notParent = true; 
     $scope.activityList = [];
     $scope.class_id = $stateParams.classId;

     $http.get('http://45.55.47.132/api/activities/getActivities?class_id=' + $scope.class_id + '&user_id=' + window.localStorage['user_id'] + '&page=1' ) 
           .success(function(response){
            if (response.length == 0) {
              $scope.ifNoActivities = true;
            }
            else{
              $scope.ifNoActivities = false;
              angular.forEach(response, function(child){

                  if (child.image_url.indexOf("missing") > -1) {    
                  child.checkimage_url = false;} 
                  else{ child.checkimage_url = true; };
                
               $scope.activityList.push(child);        
              });
            }

          });

    }
$scope.goToPostActivity = function(class_id) {
  $state.go('tab.postActivity', {classId: class_id});
}

$scope.createEvent = function(class_id) {
  $state.go('tab.createEvent',{classId: class_id});
}

$scope.viewEvents = function(class_id) {
  //window.localStorage['class_id'] = class_id;
  $state.go('tab.upcomingActivities',{classId: class_id});
}


$scope.loadNewerStories = function(class_id){
  
  if(window.localStorage['role'] == 'Parent'){ 
    var studentId = $stateParams.classId;
    loadNewerStories(studentId, "Parent")
  }
  else{
    loadNewerStories(class_id, " ")
  }
  
}
$scope.loadOlderStories = function(class_id){
  
 if(window.localStorage['role'] == 'Parent'){ 
    var studentId = $stateParams.classId;
    loadOlderStories(studentId, "Parent")
  }
  else{
    loadOlderStories(class_id, " ")
  }
 
   
 } 
    

    function loadNewerStories(class_id, role_type){

      $http.get('http://45.55.47.132/api/activities/getActivities?class_id=' + class_id + '&user_id=' + window.localStorage['user_id'] + 
                '&page=1' + '&role_type=' + role_type + '&student_id=' + class_id ) 
           .success(function(response){

            $scope.noMoreItemsAvailable = false;


            if (response.length == 0) {
              $scope.ifNoActivities = true;
            }
            else{
              $scope.ifNoActivities = false;
              $scope.activityList = [];
              angular.forEach(response, function(child){

                  if (child.image_url.indexOf("missing") > -1) {    
                  child.checkimage_url = false;} 
                  else{ child.checkimage_url = true; };

               $scope.activityList.push(child);        
              });
            }
             $scope.$broadcast('scroll.refreshComplete');
          });

    }

    function loadOlderStories(class_id, role_type){

       var  concatList = [];
       var activitieslength = $scope.activityList.length;
       var page = (activitieslength / 7) + 1;
       if (activitieslength > 0 && (activitieslength % 7) == 0 ) {
        
          $http.get('http://45.55.47.132/api/activities/getActivities?class_id=' + class_id + 
                    '&user_id=' + window.localStorage['user_id'] + '&page=' + page + '&role_type=' + role_type + '&student_id=' + class_id) 
                 .success(function(response){
                  
                    if (response.length == 0) // This if condition eliminates adding empty array to scope and rehitting to the databse.
                      { 
                        
                        $scope.noMoreItemsAvailable = true;

                      }

                    angular.forEach(response, function(child){

                        if (child.image_url.indexOf("missing") > -1) {    
                        child.checkimage_url = false;} 
                        else{ child.checkimage_url = true; };

                        concatList.push(child);        
                    });  
                   $scope.activityList = $scope.activityList.concat(concatList);
                   $scope.$broadcast('scroll.infiniteScrollComplete');
                });
    }
    else{
    $scope.noMoreItemsAvailable = true;
    $scope.$broadcast('scroll.infiniteScrollComplete'); }


  
}

$scope.btnLogoff = function(){
  localStorage.clear();
  
  $state.go('login');
}

});
