'use strict';

app.controller('HomeCtrl', function($scope, $http, $state, $ionicHistory) {
 
	$scope.username = window.localStorage['user_name']

});
