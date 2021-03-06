'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
  [
    'myApp.config',
    'myApp.routes',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'waitForAuth',
    'routeSecurity',
    'ui.bootstrap',
    'infinite-scroll'
  ]
)

  .run(['loginService', '$rootScope', 'FBURL', function(loginService, $rootScope, FBURL) {
    if(FBURL === 'https://INSTANCE.firebaseio.com') {
      // double-check that the app has been configured
      angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
      setTimeout(function() {
        angular.element(document.body).removeClass('hide');
      }, 250);
    }
    else {
      // establish authentication
      $rootScope.auth = loginService.init('/login');
      $rootScope.FBURL = FBURL;
    }
  }])

  .run(function ($rootScope, syncData, $timeout) {
    $rootScope.$on('$firebaseSimpleLogin:login', function (event, user) {
      $timeout(function () {
        $rootScope.user = syncData(['users', user.uid]);
      });
    });

    $rootScope.$on( '$firebaseSimpleLogin:logout', function ( ) {
      $rootScope.user = undefined;
      $rootScope.$apply();
    });
  });
