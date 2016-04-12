'use strict';

app.factory('EventDetail', ['$http', function($http, $scope) {

	function updateEvent(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue){
		$http({
                url: 'http://45.55.47.132/api/events/updateEventStatus',
                method: "post",
                transformRequest: function(obj) {
                         var str = [];
                          for(var p in obj)
                        	 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                          return str.join("&");
                      },
                data: 
                        {'event_id':   event_id,
                         'parent_id': parent_id,
                         'event_status_id': event_status_id,
                         'actionPerformed' : action
                      },
                headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
             }).success(function (response) {
                   
                 document.getElementById("tagParentEventStatus").innerHTML = lblStatusValue
                 document.getElementById("tagParentOptionForEvent").innerHTML = lblOptionValue
                   

                });
	};

return {

	declineJoinedEvent: function(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue){
		
		updateEvent(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue );
		
	},


	joinDeclinedEvent: function(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue){
		
		updateEvent(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue );
			
	},

	joinEvent: function(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue){

		updateEvent(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue );
	},

	declineEvent: function(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue){

		updateEvent(event_id, parent_id, event_status_id, action, lblStatusValue, lblOptionValue );

	}
};	


}]);