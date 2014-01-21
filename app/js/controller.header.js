'use strict';

angular.module('myApp.controllers')
  .controller('HeaderCtrl',
    function ($scope, loginService) {
      $scope.logout = function () {
        loginService.logout();
      };
    }
  );