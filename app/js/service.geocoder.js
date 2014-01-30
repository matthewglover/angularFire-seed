/*global google*/
'use strict';

// Declare module with no dependencies
angular.module('myApp.service.geocoder', [])

  // Declare factory function
  .factory('gsGeocoder', function ($q, $http) {
    // *********************************************
    // Private vars
    // *********************************************
    var url = 'http://maps.googleapis.com/maps/api/geocode/json';
    var data = { params: { region: null, address: null, sensor: false } };
    var geocoder = new google.maps.Geocoder();

    var _geocodes;
    var _crntGeocode;


    // *********************************************
    // Private functions
    // *********************************************
    var getCountry = function (location) { /*jshint camelcase: false */
      var i, component;
      var n = location.address_components.length;
      for (i = 0; i < n; i++) {
        component = location.address_components[i];
        if (isAddressComponentType(component, 'country')) {
          return component;
        }
      }
    };

    var isAddressComponentType = function (component, componentType) {
      var i;
      var n = component.types.length;
      for (i = 0; i < n; i++) {
        if (component.types[i] === componentType) {
          return true;
        }
      }
      return false;
    };

    var getGeocodeFromAddress = function (address) {
      var n = _geocodes.length;
      var i, geocode;
      for (i = 0; i < n; i++) { /*jshint camelcase: false */
        geocode = _geocodes[i];
        if (geocode.formatted_address === address) {
          return geocode;
        }
      }
      return undefined;
    };

    // *********************************************
    // Api functions
    // *********************************************
    var geocode = function (address) {
      _geocodes = undefined;
      _crntGeocode = undefined;
      data.params.address = address;

      var def = $q.defer( );

      var handleSuccess = function (data) {
        _geocodes = data.results;
        def.resolve(_geocodes);
      };

      $http.get(url, data).success(handleSuccess);

      return def.promise;
    };

    var getCountryCodeFromGeocode = function (geocode) { /*jshint camelcase: false */
      var country = getCountry(geocode);
      return country.short_name.toLowerCase();
    };

    var reverse = function (lat, lng, cb) {
      var latLng = { latLng: new google.maps.LatLng(lat, lng) };
      geocoder.geocode(latLng, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) { cb(results); }
      });
    };

    var setCountryCode = function (countryCode) {
      data.params.components = 'country:' + countryCode.toUpperCase();
    };

    var setCrntGeocodeFromAddress = function (address) {
      _crntGeocode = getGeocodeFromAddress(address);
      if (_crntGeocode === undefined) {
        console.log('Error - no gecode for address: ' + address);
      }
      return _crntGeocode;
    };

    var isCrntGeocode = function () {
      if (_crntGeocode === undefined) {
        return false;
      }
      return true;
    };

    var getCrntLocation = function () {
      if (!isCrntGeocode()) {
        console.log('Error = no current geocode to return');
        return undefined;
      }
      return _crntGeocode.geometry.location;
    };


    // *********************************************
    // Public api
    // *********************************************
    var api = {
      geocodes: _geocodes,
      geocode: geocode,
      reverse: reverse,
      getCountryCodeFromGeocode: getCountryCodeFromGeocode,
      setCountryCode: setCountryCode,
      setCrntGeocodeFromAddress: setCrntGeocodeFromAddress,
      isCrntGeocode: isCrntGeocode,
      getCrntLocation: getCrntLocation
    };

    return api;
  });