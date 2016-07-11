'use strict';

app.controller('EventDetailCntrl', function($scope, $http, $stateParams, $ionicPopup, $timeout, EventDetail) {
 
    $scope.myOption ={
      value : ''
    };
    $scope.isVisibleAccptedList = false; 
    $scope.accptedParents = [];

    $scope.eventDetail;
     $http.get("http://www.schooljuntos.com/api/events/getEventDetail?eventId="+ $stateParams.eventId + "&role_type=" + window.localStorage["role"] + "&parent_id=" + window.localStorage['parent_id'])
           .success(function(response){
            $scope.eventDetail = response; 
            console.log($scope.eventDetail.table)
            if(window.localStorage["role"] == "Parent")
            { 
              $scope.ifParent = true;
              if(response.table.parent_id != null){
               $scope.eventAddedToCalendar = true; 
               $scope.statusLabel = "Joined"; 
               $scope.functionLabel = "Change my mind"; }
              else if (response.table.parent_id_declined != null) {
               $scope.statusLabel = "Declined"; 
               $scope.functionLabel = "Change my mind"; 
              }
              else{
               $scope.eventAddedToCalendar = true; 
               $scope.statusLabel = "Join"; 
               $scope.functionLabel = "Decline"; }

            }
            else{$scope.ifTeacher = true; }
     })

     $scope.getAcceptedList = function(){
        var selectedOption = $scope.myOption.value;
        //Passing eventId, selectedOption, classroom_id to get the event user details
        if (selectedOption == 'Invited') {
          $http.get("http://www.schooljuntos.com/api/events/eventUserDetailList?eventId="+ $stateParams.eventId + "&selectedOption="+selectedOption + "&classroom_id=" + $stateParams.classroomId)
             .success(function(response){
              
              $scope.accptedParents = response; 
              $scope.isVisibleAccptedList = true; 
              })
        } 
        else if(selectedOption == 'Accepted'){

            $http.get("http://www.schooljuntos.com/api/events/eventUserDetailList?eventId="+ $stateParams.eventId + "&selectedOption="+selectedOption)
             .success(function(response){
              
              $scope.accptedParents = response; 
              $scope.isVisibleAccptedList = true; 
              })
        }
        else{

            $http.get("http://www.schooljuntos.com/api/events/eventUserDetailList?eventId="+ $stateParams.eventId + "&selectedOption="+selectedOption)
             .success(function(response){
              
              $scope.accptedParents = response; 
              $scope.isVisibleAccptedList = true; 
              })

        }
     }


     function updateEventStatus(event_id, parent_id, event_status_id){
      
     }


     $scope.changeEventStatus = function(event_id){
      
        if (document.getElementById("tagParentEventStatus").text.trim() == "Join") {
           
          EventDetail.declineJoinedEvent(event_id, window.localStorage['parent_id'], 0, "join", "Joined", "Change my mind")
        }
        else {};
      
     }

     $scope.optionEventStatus = function(event_id, event_status_id){
        
        if (document.getElementById("tagParentOptionForEvent").text.trim() == 'Decline') {
          var confirmPopup = $ionicPopup.confirm({
               title: 'Confirmation',
               template: 'Are you sure you want decline?'
             });

             confirmPopup.then(function(res) {
               if(res) {
                 EventDetail.declineJoinedEvent(event_id, window.localStorage['parent_id'], 0, "decline", "Declined", "Change my mind")  }
               else {}
               
             });
         
        }
        
        else if(document.getElementById("tagParentOptionForEvent").text.trim() == 'Change my mind' && document.getElementById("tagParentEventStatus").text.trim() == 'Declined'){
          
          EventDetail.joinDeclinedEvent(event_id, window.localStorage['parent_id'], event_status_id, "joinDeclinedEvent", "Joined", "Change my mind")  
         
        }
        else{
         
             var confirmPopup = $ionicPopup.confirm({
               title: 'Confirmation',
               template: 'Are you sure you want change your mind?'
             });

             confirmPopup.then(function(res) {
               if(res) {
                 EventDetail.declineJoinedEvent(event_id, window.localStorage['parent_id'], event_status_id, "declineJoinedEvent", "Declined", "Change my mind")  }
               else {}
               
             });
          
        }
        
     }

});