// 'use strict';

// describe('service.geocoder', function () {
//   var $httpBackend;
//   var url = 'http://maps.googleapis.com/maps/api/geocode/json';

//   beforeEach(module('myApp.service.geocoder'));

//   beforeEach(inject(function ($injector) {
//     // Set up the mock http service
//     $httpBackend = $injector.get('$httpBackend');

//     // $httpBackend.when('http://maps.googleapis.com/maps/api/geocode/json')
//     //   .respond(defaultData);
//     window.google = { maps: {} };
//     spyOn(window.google.maps, 'Geocode').andReturnFake(function() {
//       return {};
//     });
//   }));

//   describe('#geocode', function () {

//     it('description',
//       inject(function (gsGeocoder) {
//         $httpBackend.expectGET(url);
//         gsGeocoder.geocode('18 Ainsley Street, London');
//       })
//     );
//   }); // End describe #geocode
// });