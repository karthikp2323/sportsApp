'use strict';

app.controller('MessagesCntrl', function($scope, $state, $http, $stateParams, $ionicLoading, $ionicModal, $ionicPopup, $filter, $ionicScrollDelegate, $timeout, Database) {


 
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
      
  
  Database.getUserData().then(function(res){
          $scope.userDetails = res.rows[0];
          alert(res);
  });

  $scope.message = {
    text: ''
  }    
  $scope.messageList = [];
	$scope.StudentList = [];
	$scope.class_id = $stateParams.classId;

	if($scope.StudentList.length == 0){ 
                  $http.get('http://localhost:3000/api/students/getStudentsForClass?classroomId='+$stateParams.classId) 
                     .success(function(response){
                  
                      $scope.StudentList = response; 
                      $ionicLoading.hide();
                  });
    }

    $scope.sendMessage = function(){
        
      if ($scope.message.text != " ") {
          $http({
              url: 'http://localhost:3000/api/messages/save_message',
              method: "post",
              transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
              data: {'message_text':   $scope.message.text,
                     'receiver_id': $scope.parentid ,
                     'sender_id': $scope.userDetails.id,
                     'classroom_id': $scope.class_id,
                     'school_id': $scope.userDetails.school_id
                    },
              headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
          }).success(function (response) {
                 $scope.message.text = " ";
                 response.created_date = $filter('date')(response.created_at)
                 $scope.messageList.push(response)
                 var alertPopup = $ionicPopup.alert({
                   title: 'Message',
                   template: 'Message Sent!'
                 });
              }).error(function (status) {
                 //alert("Err");
              });

      }//EOF if main
  
    } // EOF $scope.sendMessage

    //Configuring the Modal pop-up
      $ionicModal.fromTemplateUrl('templates/sendMessage-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            //
      });

    $scope.openModal = function(parent_id, parent_name){
      
      $scope.parentName = parent_name
      $scope.parentid = parent_id;
      alert($scope.userDetails.id);
        $http.get('http://localhost:3000/api/messages/get_messages?parent_id='+$scope.parentid+'&staff_id='+$scope.userDetails.id)
                     .success(function(response){
                      
                      angular.forEach(response, function(child){
                        // created_date is used on sticky label for seperating messages by date
                        child.created_date = $filter('date')(child.created_at)

                         
                      })
                      $scope.messageList = response; 
                      $scope.modal.show();
                      
                  });


    }

    $scope.closeModal = function(){
    	$scope.modal.hide();
    }
});