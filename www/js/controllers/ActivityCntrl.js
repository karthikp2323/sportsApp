'use strict';

app.controller('ActivityCntrl', function($scope, $state, $http, $cordovaCamera, $cordovaFileTransfer, $base64, $stateParams, $ionicPlatform, $location, $ionicHistory, $ionicPopup, $timeout, $filter, Parent) {
   //alert("Hi");
   
   $ionicPlatform.registerBackButtonAction(function (event) { 
    event.preventDefault(); 
   }, 100) 

   
   $scope.activityList = [];
   $scope.studentList = [];
   $scope.ifNoActivities = false;
   $scope.noMoreItemsAvailable = false;
   var lastActivityId = "";
   var firstActivityId = "";

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
                        child.time_at = child.created_at;
                        child.created_at = $filter('date')(child.created_at)
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

     $http.get('http://localhost:3000/api/activities/getActivities?class_id=' + $scope.class_id + '&user_id=' + window.localStorage['user_id'] + '&role_type=Teacher' + '&page=1' ) 
           .success(function(response){
            if (response.activities.length == 0) {
              $scope.ifNoActivities = true;
            }
            else{
              $scope.ifNoActivities = false;

              //To load the activities
              angular.forEach(response.activities, function(child){
                  child.time_at = child.created_at;
                  child.created_at = $filter('date')(child.created_at)

                  if (child.image_url.indexOf("missing") > -1) {    
                  child.checkimage_url = false;} 
                  else{ child.checkimage_url = true; };
                
               lastActivityId = child.id;

               $scope.activityList.push(child);        
              }); //EOF for each

              //To load the student details
              angular.forEach(response.students, function(child){
                
                if(child != null)
                {
                  child.first_name = "with " + child.first_name + " " +child.last_name;
                  console.log(child.first_name);
                }
               $scope.studentList.push(child);        

              }); //EOF for each

              
            } //EOF else
            firstActivityId = $scope.activityList[0].id;
            console.log($scope.activityList);
            console.log($scope.studentList);
            console.log(lastActivityId);
          }); //EOF success function

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

      $http.get('http://localhost:3000/api/activities/getActivities?class_id=' + class_id + '&user_id=' + window.localStorage['user_id'] + 
                '&page=1' + '&role_type=' + window.localStorage['role'] + '&student_id=' + class_id +'&first_activity_id=' + firstActivityId) 
           .success(function(response){

            $scope.noMoreItemsAvailable = false;
            
              //Load activities
              angular.forEach(response.activities, function(child){
                  child.time_at = child.created_at;
                  child.created_at = $filter('date')(child.created_at)
                  if (child.image_url.indexOf("missing") > -1) {    
                  child.checkimage_url = false;} 
                  else{ child.checkimage_url = true; };

               $scope.activityList.unshift(child);        
              }); //EOF Load activities.

               //To load the student details
              angular.forEach(response.students, function(child){
                
                if(child != null)
                {
                  child.first_name = "with " + child.first_name + " " +child.last_name;
                  console.log(child.first_name);
                }
               $scope.studentList.unshift(child);        

              }); //EOF for each

              console.log($scope.activityList);
            
             $scope.$broadcast('scroll.refreshComplete');
          }); //EOF success function

    }

    function loadOlderStories(class_id, role_type){

    
        
          $http.get('http://localhost:3000/api/activities/getActivities?class_id=' + class_id + 
                    '&user_id=' + window.localStorage['user_id']  + '&role_type='+ window.localStorage['role'] + '&student_id=' + class_id +'&last_activity_id='+ lastActivityId) 
                 .success(function(response){
                  
                    if (response.activities.length == 0) // This if condition eliminates adding empty array to scope and rehitting to the databse.
                      { 
                        
                        $scope.noMoreItemsAvailable = true;

                      }

                    angular.forEach(response.activities, function(child){
                        child.time_at = child.created_at;
                        child.created_at = $filter('date')(child.created_at)
                       
                        if (child.image_url.indexOf("missing") > -1) {    
                        child.checkimage_url = false;} 
                        else{ child.checkimage_url = true; };

                        $scope.activityList.push(child); 
                        lastActivityId = child.id;       
                    }); 

                    //To load the student details
                    angular.forEach(response.students, function(child){
                      
                      if(child != null)
                      {
                        child.first_name = "with " + child.first_name + " " +child.last_name;
                        
                      }
                     $scope.studentList.push(child);        

                    }); //EOF for each

                   console.log($scope.activityList);
                   $scope.$broadcast('scroll.infiniteScrollComplete');
                });

  
}

$scope.btnLogoff = function(){
  localStorage.clear();
  
  $state.go('login');
}

});
