angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
 

})





 //////************* EOF controller EventCntrl **************//////

 //////************* EOF controller PostActivityCtrl **************//////







.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})



;


