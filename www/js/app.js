var db = null;
var app = angular.module('starter', 
  ['ionic', 
  'angular.filter',
  'starter.services', 
  'ngCordova', 
  'base64', 
  'angularMoment', 
  'flexcalendar',
  'ion-affix'
   ])

.run(function($ionicPlatform, $cordovaPush, $rootScope, $cordovaSQLite, $timeout, Database) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs) 
  
  

  var deviceInformation = ionic.Platform.platform();

  if (deviceInformation == 'ios' || deviceInformation == 'android') {
       db = $cordovaSQLite.openDB({name: "my.db", iosDatabaseLocation: 'default'});//device
         
       }
       else{
        db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
       

       }
     
  
  switch(deviceInformation){
    case 'ios':
                
                var iosConfig = {
                                    "badge": true,
                                    "sound": true,
                                    "alert": true,
                                };


                document.addEventListener("deviceready", function(){
                  $cordovaPush.register(iosConfig).then(function(deviceToken) {
                    // Success -- send deviceToken to server, and store for future use
                    $rootScope.deviceToken =  deviceToken; 
                    $rootScope.deviceType = deviceInformation;
                    Database.getUserData("deviceToken").then(function(res){
                        
                        if (res.rows == undefined) {
                          Database.SaveDeviceToken(deviceInformation, deviceToken);
                        
                        }
                 
                    });
                    
                  }, function(err) {
                    //alert("Registration error: " + err)
                    
                  })
                });   

                $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                  if (notification.alert) {
                    navigator.notification.alert(notification.alert);
                  }

                  if (notification.sound) {
                    var snd = new Media(event.sound);
                    snd.play();
                  }

                  if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                      // Success!
                    }, function(err) {
                      // An error occurred. Show a message to the user
                    });
                  }
                });     
          
          break;      

    case 'android':
                    alert("in android"+ deviceInformation);
                    var androidConfig = {
                      "senderID": "1014759241456",
                    };

                    document.addEventListener("deviceready", function(){
                          $cordovaPush.register(androidConfig).then(function(result) {
                            // Success
                          }, function(err) {
                            // Error
                          })
                    });

                    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                        switch(notification.event) {
                          case 'registered':
                            if (notification.regid.length > 0 ) {
                              alert('registration ID = ' + notification.regid);
                            }
                            break;

                          case 'message':
                            // this is the actual push notification. its format depends on the data model from the push server
                            alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                            break;

                          case 'error':
                            alert('GCM error = ' + notification.msg);
                            break;

                          default:
                            alert('An unknown GCM event has occurred');
                            break;
                        }
                    });

          break;  

  }
      


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if(window.cordova && window.cordova.InAppBrowser){
        window.open = window.cordova.InAppBrowser.open;
    }  
    
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
   $stateProvider

  // setup an abstract state for the tabs directive
    
   
    .state('login', {
  
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })


    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

    .state('tab.classActivities', {
      url: '/class/:classId/:name',
      
          templateUrl: 'templates/classActivities.html',
          controller: 'ActivityCntrl'
        
    })

    .state('tab.upcomingActivities', {
      url: '/upcomingActivities/:classId',
      
          templateUrl: 'templates/upcomingActivities.html',
          controller: 'UpComingActivitiesCntrl'
        
    })

  .state('tab.postActivity', {
      url: '/postActivity/:classId',
       
          templateUrl: 'templates/postActivity.html',
          controller: 'PostActivityCtrl'
        
      })
  .state('tab.createEvent', {
      url: '/createEvent/:classId',
       
          templateUrl: 'templates/createEvent.html',
          controller: 'EventCntrl'
        
    })
  .state('tab.eventDetails', {
      url: '/eventDetails/:eventId/:classroomId',
       
          templateUrl: 'templates/eventDetails.html',
          controller: 'EventDetailCntrl'
        
    })
  .state('tab.addStudent', {
      url: '/addStudent/:classDetails',
       
          templateUrl: 'templates/addStudent.html',
          controller: 'AddStudentCtrl'
        
    })
  .state('tab.messages', {
      url: '/messages/:classId',
       
          templateUrl: 'templates/messages.html',
          controller: 'MessagesCntrl'
        
    })
  .state('tab.updateProfile', {
      url: '/updateProfile',
       
          templateUrl: 'templates/updateProfile.html',
          controller: 'UpdateProfileCtrl'
        
    })
  .state('tab.home', {

    url: '/home',
        
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
