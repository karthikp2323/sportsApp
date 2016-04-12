'use strict';

app.controller('schoolTeacherCtrl', function($scope, Chats, $http) {
  
$scope.savePost = function() {
   
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});