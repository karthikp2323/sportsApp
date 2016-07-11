'use strict';

app.controller('ActivityCntrl', function($scope, $state, $http, $cordovaCamera, $cordovaFileTransfer, $base64, $stateParams, $ionicPlatform, $location, $ionicHistory, $ionicPopup, $timeout, $filter, $ionicModal, Parent, Database) {
   //alert("Hi");
   
   $ionicPlatform.registerBackButtonAction(function (event) { 
    event.preventDefault(); 
   }, 100) 

   $scope.name = $stateParams.name;
   $scope.activityList = [];
   $scope.studentList = [];
   $scope.ifNoActivities = false;
   $scope.noMoreItemsAvailable = false;
   $scope.TeacherList = [];
   var lastActivityId = "";
   var firstActivityId = "";

  if (window.localStorage['role'] == 'Parent') {
    $scope.Parent = true;
    var studentId = $stateParams.classId;
    $scope.student_id = $stateParams.classId;
    $scope.activityList = [];
          $http.get('http://www.schooljuntos.com/api/activities/getActivities?student_id='+studentId + '&role_type=Parent'+ '&page=1') 
             .success(function(response){
              
                if (response.length == 0) {
                  $scope.ifNoActivities = true;
                }

                else{
                  $scope.ifNoActivities = false;
                  //To load activities
                  angular.forEach(response.activities, function(child){
                        child.time_at = child.created_at;
                        child.created_at = $filter('date')(child.created_at)
                        if (child.image_url.indexOf("missing") > -1) {    
                        child.checkimage_url = false;} 
                        else{ child.checkimage_url = true; };
                  
                  lastActivityId = child.id;
                        
                  $scope.activityList.push(child);  
                  }); //EOF each

                  //To load the student details
                  angular.forEach(response.students, function(child){
                    
                    if(child != null)
                    {
                      child.first_name = "with " + child.first_name + " " +child.last_name;
                      console.log(child.first_name);
                    }
                   $scope.studentList.push(child);        

                  }); //EOF for each
                }// EOF else
                firstActivityId = $scope.activityList[0].id;
            });

  }
   else{    

     $scope.notParent = true; 
     $scope.activityList = [];
     $scope.class_id = $stateParams.classId;

     $http.get('http://www.schooljuntos.com/api/activities/getActivities?class_id=' + $scope.class_id + '&user_id=' + window.localStorage['user_id'] + '&role_type=Teacher' + '&page=1' ) 
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

            //console.log($scope.activityList);
            //console.log($scope.studentList);
            //console.log(lastActivityId);
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

      $http.get('http://www.schooljuntos.com/api/activities/getActivities?class_id=' + class_id + '&user_id=' + window.localStorage['user_id'] + 
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

              
             firstActivityId = $scope.activityList[0].id; 
             $scope.$broadcast('scroll.refreshComplete');
          }); //EOF success function

    } // EOF loadNewerStories

    function loadOlderStories(class_id, role_type){

    
        
          $http.get('http://www.schooljuntos.com/api/activities/getActivities?class_id=' + class_id + 
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

  
    }// EOF loadOlderStories

  //Configuring the Modal pop-up
        $ionicModal.fromTemplateUrl('templates/information-modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modal = modal;
              //
        });


  $scope.openModal = function(){
    $scope.modal.show();

    Database.getRole().then(function(res){
        var role_type = res.rows.item(0).role_type;

        if(role_type == "Parent"){
          getKidRegisteredClasses();
        }
        else if(role_type == "Teacher"){
          getRegisteredStudentList();
        }
                 
    });
    
  }

  $scope.closeModal = function(){
      $scope.modal.hide();
  }          


  $scope.btnLogoff = function(){
    localStorage.clear();
    
    $state.go('login');
  }

  function getRegisteredStudentList(){
      $scope.RegisteredStudentList = [];
      if($scope.RegisteredStudentList.length == 0){ 
                  $http.get('http://www.schooljuntos.com/api/students/getStudentsForClass?classroomId='+$stateParams.classId) 
                     .success(function(response){
                  
                      $scope.RegisteredStudentList = response.studentParentData; 
                      
                      
                      //$ionicLoading.hide();
                  });
      }

    } //EOF getStudentList()

    function getKidRegisteredClasses(){
        $scope.RegisteredClassesList = [];
        if($scope.RegisteredClassesList.length == 0){ 
                    $http.get('http://www.schooljuntos.com/api/school_users/get_teacher_list?student_id='+$stateParams.classId) 
                       .success(function(response){
                        
                        $scope.RegisteredClassesList = response.teacherClassroomData;
                        
                        //console.log($scope.TeacherList);
                        
                       // $ionicLoading.hide();
                    });
        }

    }//EOF getTeacherList()

});
