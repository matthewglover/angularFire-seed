(function() {
  'use strict';

  /* Services */

  angular.module('myApp.services',
    [
      'myApp.service.login',
      'myApp.service.firebase',
      'myApp.service.factual',
      'myApp.service.geolocation',
      'myApp.service.geocoder',
      'myApp.service.countrySelector'
    ]
  );

    // put your services here!
    // .service('serviceName', ['dependency', function(dependency) {}]);

})();
