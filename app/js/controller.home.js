'use strict';

angular.module('myApp.controllers')
  .controller('HomeCtrl',
    function($scope, syncData) {
      syncData('syncedValue').$bind($scope, 'syncedValue');
    }
  );