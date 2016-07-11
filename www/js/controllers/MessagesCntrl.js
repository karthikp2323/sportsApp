'use strict';

app.controller('MessagesCntrl', function($scope, $rootScope, $state, $http, $stateParams, $ionicLoading, $ionicModal, $ionicPopup, $filter, $ionicScrollDelegate, $timeout, Database) {


 
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  
  $scope.searchText = "";
  $scope.message = {
    text: ''
  }      
  $scope.userDetails = [];
  $scope.class_id = $stateParams.classId;
  console.log("class id:"+$scope.class_id);

  //Get role
  Database.getRole().then(function(res){
          $scope.role_type = res.rows.item(0).role_type;

        if($scope.role_type == "Teacher"){
            //Get User data from local DB Sqlite
            Database.getUserData("user").then(function(res){
                    $scope.userDetails = res.rows.item(0);
                 
            });
            getParentList();
            $scope.Teacher = true;
        }
        else{

            //Get User data from local DB Sqlite
            Database.getUserData("parent").then(function(res){
                    $scope.userDetails = res.rows.item(0);
                 //console.log("Inside get"+$scope.userDetails);
            });
            getTeacherList();
            $scope.Parent = true;
        }
         
  });

     
  $scope.messageList = [];
	$scope.StudentList = [];
  $scope.TeacherList = [];
  $scope.unreadCount = [];
	


    $scope.sendMessage = function(){
        
      if ($scope.message.text != "") {
          $http({
              url: 'http://www.schooljuntos.com/api/messages/save_message',
              method: "post",
              transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
              data: {'message_text':   $scope.message.text,
                     'receiver_id': $scope.receiverId ,
                     'sender_id': $scope.userDetails.id,
                     'classroom_id': $scope.class_id,
                     'school_id': $scope.userDetails.school_id,
                     'role_type': $scope.userDetails.role_type
                    },
              headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
          }).success(function (response) {
                 $scope.message.text = " ";
                 response.created_date = $filter('date')(response.created_at)
                 response.boolean_sender = true;
                 $scope.messageList.push(response)

                 //Scroll down event when page is loaded.
                $timeout(function() {
                    $ionicScrollDelegate.$getByHandle('modalContent').scrollBottom();   
                  }, 100);  

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

    $scope.scrollDown = function(){
      //Scroll down event when clicked on text box
      
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('modalContent').scrollBottom();   
        }, 100);    
    }       

    $scope.openModal = function(receiver_id, receiver_name, class_id){
      
        if ($scope.role_type == "Teacher") {
          getMessages(receiver_id, receiver_name);
          
          
          var result = $filter('filter')($scope.unreadCount, {parent_id : receiver_id}, true)
          if(result.length > 0 && result[0].unread_messages != 0){
            setBackUnreadCount(receiver_id);
             $rootScope.unreadId = result[0].unread_messages;
            document.getElementById(receiver_id).style.visibility = "hidden";
          }
      
        }
        else{
          
          //set class_id for api call.
          var findTeacher = $filter('filter')($scope.TeacherList, {id: receiver_id});
         
          $scope.class_id = class_id;
          $scope.userDetails.school_id = findTeacher[0][0].school_id;
          //To load messages
          getMessages(receiver_id, receiver_name);
          

          //get the unread record id... and use it to hide the count.
          var result = $filter('filter')($scope.unreadCount, {school_user_id : receiver_id} && {classroom_id: $scope.class_id}, true)
          if(result.length > 0 && result[0].unread_messages != 0){
            setBackUnreadCount(receiver_id);
            $rootScope.unreadId = result[0].unread_messages;
            document.getElementById(receiver_id).style.visibility = "hidden";
          }

        };

        //Scroll down event when page is loaded.
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('modalContent').scrollBottom();   
          }, 100);      
                  

    } //EOF openModal

    $scope.closeModal = function(){
    	$scope.modal.hide();
    }

    function getParentList(){

      if($scope.StudentList.length == 0){ 
                  $http.get('http://www.schooljuntos.com/api/students/getStudentsForClass?classroomId='+$stateParams.classId) 
                     .success(function(response){
                  
                      $scope.StudentList = response.studentParentData; 
                      $scope.unreadCount = response.unreadCount; 
                      
                      $ionicLoading.hide();
                  });
      }

    } //EOF getStudentList()

    function getTeacherList(){

        if($scope.TeacherList.length == 0){ 
                    $http.get('http://www.schooljuntos.com/api/school_users/get_teacher_list?student_id='+$stateParams.classId) 
                       .success(function(response){
                        
                        $scope.TeacherList = response.teacherClassroomData;
                        $scope.unreadCount = response.unreadCount; 
                        //console.log($scope.TeacherList);
                        
                        $ionicLoading.hide();
                    });
        }

    }//EOF getTeacherList()

    function setBackUnreadCount(receiver_id){
      
      $http.post('http://www.schooljuntos.com/api/messages/update_unread_record?receiver_id='+$scope.userDetails.id+
                  '&sender_id='+$scope.receiverId+'&school_id='+$scope.userDetails.school_id+'&role_type='+$scope.userDetails.role_type+'&classroom_id='+$scope.class_id)        
           .success(function(response){

           })

    }
    function getMessages(receiver_id, receiver_name){
      //console.log("in get messages:"+ receiver_id, receiver_name);
      $scope.parentName = receiver_name;
      $scope.receiverId = receiver_id;
      
        $http.get('http://www.schooljuntos.com/api/messages/get_messages?receiver_id='+$scope.receiverId+'&sender_id='+$scope.userDetails.id+
                  '&school_id='+$scope.userDetails.school_id+'&class_id='+$scope.class_id)
                     .success(function(response){
                      
                      angular.forEach(response, function(child){
                        // created_date is used on sticky label for seperating messages by date
                        child.created_date = $filter('date')(child.created_at)

                        if(child.sender_id == $scope.userDetails.id){
                           child.boolean_sender = true;
                           child.boolean_receiver = false;
                         }
                         else{
                          child.boolean_sender = false;
                          child.boolean_receiver = true;
                         }
                         
                      })
                      $scope.messageList = response; 
                      $scope.modal.show();
                      
                  }); 

    }//EOF openModalForTeacher



});