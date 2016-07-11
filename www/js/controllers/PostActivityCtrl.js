'use strict';

app.controller('PostActivityCtrl', function($scope, $ionicLoading, $http, $cordovaCamera, $state, $cordovaDatePicker, $stateParams, $ionicPopup, $ionicModal) {


  var students_list = [];


  $scope.activity = {
    title: '',
    message: ''
  };

  $scope.selectStudent = {
        name: ' ',
        id: ' ',
        choice: ' '
  };


  $scope.hideTakePicture = true;

  $scope.divResult = true;

  $scope.imageData = " ";

  $scope.classId = $stateParams.classId;

  $scope.StudentList = [];
     


  $scope.takePhoto = function() {

    //$scope.imgURI = "img/adam.jpg";
    $scope.hideTakePicture = false;

    
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
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });   
    
  }


    $scope.choosePhoto = function(){

      $scope.hideTakePicture = false;

      var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 750,
            targetHeight: 750,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };


     $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.imageData = imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        }); 

    }


  $scope.savePost = function(formValid){

     // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

    if(formValid == false)
    {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
       title: 'Post Error!',
       template: 'Please provide required details.'
      });
      
    }
   //var imageUrl = element.find("imgTakePicture"); 
    else{
     $http({
            url: 'http://www.schooljuntos.com/api/activities',
            method: "post",
            transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                      return str.join("&");
                  },
            data: {'title':   $scope.activity.title,
                   'message': $scope.activity.message,
                   'image': $scope.imageData,
                   'fileName': "uploadedBY_" + window.localStorage['user_name'],
                   'classroom_id': $scope.classId,
                   'school_user_id': window.localStorage['user_id'],
                   'school_id': window.localStorage['school_id'],
                   'student_id': $scope.selectStudent.id

                  },
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
        }).success(function (status) {
               //alert("Succ");
               //$state.go('tab.classActivities')
               $ionicLoading.hide();
               $scope.postSaved = true;
               var alertPopup = $ionicPopup.alert({
                 title: 'Message',
                 template: 'Activity Posted!'
               });
            }).error(function (status) {
               //alert("Err");
            });
    }
  }//EOF function save post
  
  $scope.setStudentName = function(studentId){
    $scope.selectStudent.name = angular.element(document.querySelector('#headerStudentName'+studentId))[0].outerText;
    $scope.selectStudent.id = studentId;
  };


    //Configuring the Modal pop-up
      $ionicModal.fromTemplateUrl('templates/getStudents-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
      });

     //Modal open function     
      $scope.openModal = function() {
     
           if($scope.selectStudent.choice == "Everyone"){
              $scope.selectStudent.name = "Select Student";
              $scope.selectStudent.id = " ";
           }
           else{
               
               $scope.modal.show();
               if($scope.StudentList.length == 0){ 
                  $http.get('http://www.schooljuntos.com/api/students/getStudentsForClass?classroomId='+$scope.classId) 
                     .success(function(response){
                  
                      $scope.StudentList = response.studentParentData; 
                     
                  });
                }
           }
      };

      //Modal close function
      $scope.closeModal = function(choice) {
            
            $scope.modal.hide();
            if (choice == "cancel") {
              $scope.selectStudent.choice = false;
              $scope.selectStudent.name = "Select Student"
              $scope.selectStudent.id = " ";
            };
            
      };
          //Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.modal.remove();
          });
          // Execute action on hide modal
          $scope.$on('modal.hidden', function() {
            // Execute action
          });
          // Execute action on remove modal
          $scope.$on('modal.removed', function() {
            // Execute action
          });

});

