'use strict';

// Declare module with no dependencies
angular.module('myApp.service.factual', [])

  // Declare factory function
  .factory('gsFactual', function ($http, $q) {
    // *********************************************
    // Private vars
    // *********************************************
    var url = 'http://localhost:3000/api/v1/factual/search.json';

    var _crntPage = 1;
    var _perPage = 20;
    var _radius = 500;

    var comma = function(str) {
      if (str.length > 0) {
        return ', ';
      }
      return '';
    };

    var formatAddress = function (place) { /*jshint camelcase: false */
      var address = place.address;
      var postTown = place.post_town;
      var region = place.region;
      var postcode = place.postcode;

      var formattedAddress = '';
      if (address) { formattedAddress += address; }
      if (postTown) { formattedAddress += comma(formattedAddress) + postTown; }
      if (region && region !== postTown) { formattedAddress += comma(formattedAddress) + region; }
      if (postcode) { formattedAddress += comma(formattedAddress) + postcode; }
      return formattedAddress;
    };

    var transformPlace = function (place) { /*jshint camelcase: false */
      return {
        factualId: place.factual_id,
        name: place.name,
        lat: place.latitude,
        lng: place.longitude,
        formattedAddress: formatAddress(place),
        distance: place.$distance
      };
    };

    var transformResponse = function (data) { /*jshint camelcase: false */
      data = JSON.parse(data);
      var places  = data.results;
      var totalPlaces = places.length;
      var output = [];
      if (totalPlaces === 0) { return output; }
      for (var i = 0; i < totalPlaces; i++) {
        if (i === 1) { console.log(places[i]); }
        var item = transformPlace(places[i]);
        output.push(item);
      }
      data.results = output;
      return data;
    };

    var baseConfig = {
      params: { page: 1, radius: _radius, perPage: _perPage },
      transformResponse: transformResponse
    };


    // *********************************************
    // Public api
    // *********************************************
    return {

      busy: false,
      places: [],
      isAll: false,


      findPlaces: function (search, countryCode, lat, lng) {
        var self = this;
        if (self.isAll || self.busy) { return; }
        self.busy = true;

        var def = $q.defer( );

        var handleSuccess = function (data) {
          var prevLength = self.places.length;
          self.places = self.places.concat(data.results);
          var newLength = self.places.length;
          if (newLength < (prevLength + _perPage)) { self.isAll = true;}
          def.resolve(self.places);
          self.busy = false;
        };

        var customConfig = angular.copy(baseConfig);
        customConfig.params.page = _crntPage++;
        customConfig.params.country = countryCode;
        if (search) { customConfig.params.search = search; }
        if (lat) { customConfig.params.lat = lat; }
        if (lng) { customConfig.params.lng = lng; }

        $http.get(url, customConfig).success(handleSuccess);

        return def.promise;
      }
    };

  });
