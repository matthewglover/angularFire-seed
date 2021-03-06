/*global google*/
'use strict';

angular.module('myApp.controllers')
  .controller('SearchCtrl',
    function ($scope, gsFactual, gsGeolocation, gsGeocoder, $timeout, gsCountrySelector, firebaseRef, gsFirebaseUserSpots) {
      // *********************************************
      // Private vars
      // *********************************************

      // Contextual ref to this controller instance
      var self = this;

      // Place search variables
      var _placeSearchQueue = [];
      var _minChars = 3;
      var _delay = 500;


      // *********************************************
      // Controller methods
      // *********************************************

      this.findNearMe = function () {
        var latLng = $scope.geolocation.getCrntLocation();
        return $scope.factual.findPlaces(undefined, $scope.countrySelector.getCrntCode(), latLng.lat, latLng.lng);
      };

      this.getCrntLocation = function () {
        if ($scope.isChooseLocation() && $scope.geocoder.isCrntGeocode()) {
          return $scope.geocoder.getCrntLocation();
        }
        else {
          return $scope.geolocation.getCrntLocation();
        }
      };

      this.findPlaces = function (placeName) {
        var latLng = self.getCrntLocation();
        return $scope.factual.findPlaces(placeName, $scope.countrySelector.getCrntCode(), latLng.lat, latLng.lng);
      };

      this.clearPlaceSearchQueue = function () {
        while (_placeSearchQueue.length > 1) {
          $timeout.cancel(_placeSearchQueue.pop());
        }
      };

      this.queuePlaceSearch = function (placeName) {
        var fn = $timeout(function () {
          self.findPlaces(placeName);
          _placeSearchQueue.shift();
        }, _delay);
        _placeSearchQueue.push(fn);
      };


      this.initLocation = function (latLng) {
        $scope.geocoder.reverse(latLng.lat, latLng.lng, function (results) {
          var code = $scope.geocoder.getCountryCodeFromGeocode(results[0]);
          $scope.countrySelector.setCountry(code);
          $scope.geocoder.setCountryCode(code);
        });
      };

      this.calcDistanceBetween = function (latLngA, latLngB, format) {
        latLngA = new google.maps.LatLng(latLngA.lat, latLngA.lng);
        latLngB = new google.maps.LatLng(latLngB.lat, latLngB.lng);
        var meters = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
        var distance;
        if (format === 'meters') {
          distance = meters;
        }
        else if (format === 'kilometers') {
          distance = meters/1000;
        }
        else if (format === 'miles') {
          distance = meters * 0.000621371192;
        }
        return distance;
      };

      // this.cleanData = function (data) {
      //   var obj = {};
      //   angular.forEach(data, function(value, key){
      //     if (key.match(/^\$/)) { return; }
      //     obj[key] = value;
      //   });
      //   return obj;
      // };

      // this.spotIt = function (spotData) {
      //   var factualRef = 'factual_' + spotData.factualId;
      //   spotData = self.cleanData(spotData);
      //   // console.log(spotData);
      //   fbUserSpots.child(factualRef).set(true);
      //   fbSpots.child(factualRef).transaction(function (currentSpotData) {
      //     if (currentSpotData !== null) {
      //       angular.extend(currentSpotData, spotData);
      //       currentSpotData.users[$scope.auth.user.uid] = true;
      //       return currentSpotData;
      //     }
      //     else {
      //       spotData.users = {};
      //       spotData.users[$scope.auth.user.uid] = true;
      //       return spotData;
      //     }
      //   });
      // };

      // this.unSpotIt = function (spot) {
      //   var factualRef = 'factual_' + spot.factualId;
      //   fbUserSpots.child(factualRef).remove();
      // };

      // this.getUserSpots = function () {
      //   $scope.userSpots = {};

      //   fbUserSpots.on('child_added', function (userSpot) {
      //     var ref = userSpot.name();
      //     fbSpots.child(ref).on('value', function (spot) {
      //       $timeout(function () {
      //         $scope.userSpots[ref] = spot.val();
      //       });
      //     });
      //   });

      //   fbUserSpots.on('child_removed', function (userSpot) {
      //     var ref = userSpot.name();
      //     $timeout(function () {
      //       delete $scope.userSpots[ref];
      //     });
      //   });
      // };

      // var fbUserSpots = firebaseRef('users', $scope.auth.user.uid, 'spots');
      // var fbSpots = firebaseRef('spots');

      this.spotIt = function (spot) {
        $scope.userSpots.add(spot);
      };

      this.unSpotIt = function (spot) {
        $scope.userSpots.remove(spot);
      };

      // *********************************************
      // Scope methods
      // *********************************************


      // ************************ Search type functions *****************************
      $scope.setSearchType = function (searchType) {
        $scope.searchType = $scope.searchConfig[searchType];
      };

      $scope.isChooseLocation = function () {
        return ($scope.searchType === $scope.searchConfig.chooseLocation);
      };

      // ************************ Country Status functions *****************************
      $scope.getCountries = function () {
        return $scope.countrySelector.countries;
      };

      $scope.setCurrentCountry = function (code) {
        $scope.countrySelector.setCountry(code);
        $scope.geocoder.setCountryCode(code);
      };

      $scope.getCurrentCountryName = function () {
        return $scope.countrySelector.getCrntName();
      };

      // ************************ Place search functions *****************************
      $scope.changePlaceName = function (placeName) {
        self.clearPlaceSearchQueue();
        if (placeName.length < _minChars) { return; }
        self.queuePlaceSearch(placeName);
      };

      // ************************ Geocode/location functions *****************************
      $scope.onSelectLocation = function () {
        $scope.geocoder.setCrntGeocodeFromAddress($scope.data.geocodeAddress);
      };

      $scope.geocode = function (address) {
        return $scope.geocoder.geocode(address)
          .then( function (geocodes) {
            var addresses = [];
            angular.forEach(geocodes, function(geocode){ /*jshint camelcase: false */
              addresses.push(geocode.formatted_address);
            });
            return addresses;
          } );
      };

      $scope.calcDistanceFrom = function (obj) {
        if (!angular.isObject(obj) || !obj.lat || !obj.lng) { return; }
        var crntLatLng = self.getCrntLocation();
        if (angular.isDefined(crntLatLng)) {
          var distance = self.calcDistanceBetween(crntLatLng, { lat: obj.lat, lng: obj.lng }, 'miles');
          return Math.round(distance*100)/100;
        }
      };

      $scope.spotIt = function (place) {
        self.spotIt(place);
      };

      $scope.unSpotIt = function (spot) {
        self.unSpotIt(spot);
      };

      // ************************ Find near me *****************************
      $scope.findNearMe = function () {
        self.findNearMe();
      };

      $scope.fct = {};
      $scope.fct.firstRun = true;
      $scope.fct.fetchMore = function () {
        if ($scope.fct.firstRun) {
          $scope.fct.firstRun = false;
          return;
        }
        self.findNearMe();
      };

      $scope.placeFilter = function (val) { return 'factual_'+val; };

      // *********************************************
      // Configuration
      // *********************************************

      // Bind services to scope
      $scope.factual = gsFactual;
      $scope.geolocation = gsGeolocation;
      $scope.geocoder = gsGeocoder;
      $scope.countrySelector = gsCountrySelector;
      $scope.userSpots = gsFirebaseUserSpots($scope.auth.user.uid);


      $scope.searchConfig = {};
      $scope.searchConfig.nearMe = { ref: 'nearMe', description: 'Near me' };
      $scope.searchConfig.chooseLocation = { ref: 'chooseLocation', description: 'Near location' };

      $scope.searchType = $scope.searchConfig.nearMe;

      // self.getUserSpots();

      $scope.data = {};

      // *********************************************
      // Initialisation
      // *********************************************

      // Get current location, then find places based on location
      $scope.geolocation.find()
        .then(self.initLocation);
    }
  );