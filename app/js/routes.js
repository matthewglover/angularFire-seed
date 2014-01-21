'use strict';

angular.module('myApp.routes', ['ngRoute'])

  // configure views; the authRequired parameter is used for specifying pages
  // which should only be available while logged in
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
      authRequired: true,
      templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
    });

    $routeProvider.when('/chat', {
      authRequired: true,
      templateUrl: 'partials/chat.html',
      controller: 'ChatCtrl'
    });

    $routeProvider.when('/account', {
      authRequired: true, // must authenticate before viewing this page
      templateUrl: 'partials/account.html',
      controller: 'AccountCtrl'
    });

    $routeProvider.when('/login', {
      templateUrl: 'partials/login.html',
      createMode: false,
      controller: 'LoginCtrl'
    });

    $routeProvider.when('/signup', {
      templateUrl: 'partials/login.html',
      createMode: true,
      controller: 'LoginCtrl'
    });

    $routeProvider.otherwise({redirectTo: '/home'});
  }]);