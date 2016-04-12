'use strict';

app.controller('AddStudentCtrl', function($scope, $http, $state, $ionicPopup, $timeout, $cordovaSocialSharing) {

$scope.divResult = true;

$scope.addStudent = function(){


	$cordovaSocialSharing
    .shareViaFacebook("sample", '', '')
    .then(function(result) {
      // Success!
      alert(result);
    }, function(err) {
      // An error occurred. Show a message to the user
      alert(err);
    });


}

});