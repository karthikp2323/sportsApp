
app.controller('UpComingActivitiesCntrl', function($scope, $http, $stateParams, Parent) {
  "use strict";
  // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)

$scope.ifTeacher = false;
$scope.ifParent = false;
$scope.btnHdnShowCalendar = true;
$scope.isVisible = false;    
$scope.events = []; 

$scope.options = {
    defaultDate: Date.now(),
    //minDate: "2015-01-01",
    //maxDate: "2015-12-31",
    //disabledDates: [
      //  "2015-06-22",
        //"2015-07-27",
        //"2015-08-13",
        //"2015-08-15"
    //],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) { // called before dateClick and only if clicked day has events
      //console.log(date);
    },
    dateClick: function(date) { // called every time a day is clicked
      //console.log(date.event);
      $scope.isVisible = false;  
      $scope.btnHdnShowCalendar = false;
      $scope.eventsInADay = date.event;
    },
    changeMonth: function(month, year) {
      //console.log(month, year);
    },
    filteredEventsChange: function(filteredEvents) {
      console.log(filteredEvents);
    },
  };


if ($stateParams.classId != 0) { 
  //Get events for parent
  if (window.localStorage['role'] == "Parent") {
          $http.get('http://45.55.47.132/api/events/getEventForParent?student_Ids='+ $stateParams.classId)
                    .success(function(response){
                    $scope.isVisible = true;    
                    $scope.ifParent = true;
               angular.forEach(response, function(child){
               
                 //converted to format "Date 2016-01-23T05:00:00.000Z"
                 var date = moment(child.event_date);

                 var data = {id: child.id, event_title: child.event_title, event_description: child.event_description, 
                             date: date, event_time: child.event_time, event_location: child.event_location, classroom_id: child.classroom_id
                             };
                 $scope.events.push(data);  
              
              });
          }); 
  }
  else{
        $http.get('http://45.55.47.132/api/events/getEventForClass?classroom_id='+ $stateParams.classId)
                    .success(function(response){
                    $scope.isVisible = true;    
                    $scope.ifTeacher = true;
             angular.forEach(response, function(child){
             
               //converted to format "Date 2016-01-23T05:00:00.000Z"
               var date = moment(child.event_date);

               var data = {id: child.id, event_title: child.event_title, event_description: child.event_description, date: date, event_time: child.event_time, event_location: child.event_location, classroom_id: child.classroom_id };
               $scope.events.push(data);  
            
            });
        });
      }
}

//Get events for all classes                  
    else{
      $http.get('http://45.55.47.132/api/events/getEvent?user_role=Teacher&user_id='+window.localStorage['user_id'])
                        .success(function(response){
                        $scope.isVisible = true;    
                        $scope.ifTeacher = true;
                 angular.forEach(response, function(child){
                 //converted to format "Date 2016-01-23T05:00:00.000Z"
                 var date = moment(child.event_date);

                 var data = {id: child.id, event_title: child.event_title, event_description: child.event_description, date: date, event_time: child.event_time, event_location: child.event_location, classroom_id: child.classroom_id };
                 $scope.events.push(data);  
                
                });
         });
    }
        
   $scope.showCalendar = function(){
    $scope.btnHdnShowCalendar = true;
    $scope.isVisible = true; 
   }   

});