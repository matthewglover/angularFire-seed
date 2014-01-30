'use strict';

// Declare module with no dependencies
angular.module('myApp.service.geolocation', [])

  // Declare factory function
  .factory('gsGeolocation', function ($q) {
    // *********************************************
    // Private vars
    // *********************************************
    var _crntLocation;

    // *********************************************
    // Api functions
    // *********************************************
    var find = function () {
      var def = $q.defer();
      var options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 };

      var success = function (pos) {
        _crntLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        def.resolve(_crntLocation);
      };

      var error = function (err)  {
        def.reject( err );
      };

      navigator.geolocation.getCurrentPosition(success, error, options);

      return def.promise;
    };

    var getCrntLocation = function () {
      return _crntLocation;
    };

    // *********************************************
    // Public api
    // *********************************************
    return {
      find: find,
      getCrntLocation: getCrntLocation
    };
  });