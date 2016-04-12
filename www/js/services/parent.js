'use strict';

app.factory('Parent', ['$http', function($http, $scope) {
 

return{

	getActivities: function(studentId){
		
		var activityList =[];
			  $http.get('http://localhost:3000/api/activities/getActivities?student_id='+studentId + '&role_type=Parent') 
	           .success(function(response){
	            
	            if (response.length == 0) {
	            	$scope.ifNoActivities = true;
	            }

	            else{
	            	$scope.ifNoActivities = false;
		            angular.forEach(response, function(child){
		            activityList.push(child);  
		            });
	        	}
	          });


		return activityList;
	},


	getEvents: function(studentIds){
		var eventsList = [];
		$http.get('http://localhost:3000/api/events/getEventForParent?student_Ids='+ studentIds)
                    .success(function(response){
                    //$scope.isVisible = true;    

             angular.forEach(response, function(child){
             
             //converted to format "Date 2016-01-23T05:00:00.000Z"
             var date = moment(child.event_date);

             var data = {id: child.id, event_title: child.event_title, event_description: child.event_description, date: date, event_time: child.event_time, event_location: child.event_location, classroom_id: child.classroom_id };
             eventsList.push(data);  
            
            });
     });
                    return eventsList;

	}
};

}
]);
