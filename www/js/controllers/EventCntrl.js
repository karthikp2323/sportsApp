'use strict';

app.controller('EventCntrl', function($scope, $http, $state, $cordovaDatePicker, $stateParams, $ionicPopup, $timeout) {

  $scope.newEvent = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  };

  $scope.divResult = true;

  //date picker function for event_time(ngCordova Datepicker is used)
  $scope.showDatePicker = function () {

    var options = {
      date: new Date(),
      mode: 'date',
      //minDate:  moment().subtract(100, 'years').toDate(),
      allowOldDates: true,
      allowFutureDates: true,
      doneButtonLabel: 'Done',
      doneButtonColor: '#000000',
      cancelButtonLabel: 'Abort',
      cancelButtonColor: '#000000'
    };

    $cordovaDatePicker.show(options).then(function(date){

      //format date to time using moment.js
      var a = moment(date, "llll");
      var formatedDate = a.format('MM/DD/YY');  //a.format('h:mm:ss a');

      document.getElementById('txtEventDate').value = formatedDate;
      });
  }

  //time picker function for event_time(ngCordova Datepicker is used)
  $scope.showTimePicker = function () {

    var options = {
      date: new Date(),
      mode: 'time',
      //minDate:  moment().subtract(100, 'years').toDate(),
      allowOldDates: true,
      allowFutureDates: true,
      doneButtonLabel: 'Done',
      doneButtonColor: '#000000',
      cancelButtonLabel: 'Abort',
      cancelButtonColor: '#000000'
    };

    $cordovaDatePicker.show(options).then(function(date){

      //format date to time using moment.js
      var a = moment(date, "llll");
      var formatedTime = a.format('h:mm a');  //a.format('h:mm:ss a');

      document.getElementById('txtEventTime').value = formatedTime;
      });
  }

  // Saving event to the database.
  $scope.createNewEvent = function(formValid){

    if(formValid == false){
     var alertPopup = $ionicPopup.alert({
     title: 'Create Error!',
     template: 'Please provide required details.'
    });

    exit;

    };
    var date = document.getElementById('txtEventDate').value;
    var time = document.getElementById('txtEventTime').value;
    //var toFormatDate = moment(date, "llll");
    //alert(date + "_" + toFormatDate);
    //var formatedDate = toFormatDate.format('YYYY-MM-DD');


    $http({
            url: 'http://45.55.47.132/api/events',
            method: "post",
            transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                      return str.join("&");
                  },
            data: {'event_title':   $scope.newEvent.title,
                   'event_description': $scope.newEvent.description,
                   'event_date': date,
                   'event_time': time,
                   'event_location':  $scope.newEvent.location,
                   'classroom_id' : $stateParams.classId,
                   'user_id' : window.localStorage['user_id']
                  },
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=utf-8'}
        }).success(function (status) {
                
               //$scope.divResult = false;
               var alertPopup = $ionicPopup.alert({
                 title: 'Message',
                 template: 'Event Created!'
               });
            }).error(function (status) {
               alert("Oops! Something has gone wrong.");
            });

  }

});
