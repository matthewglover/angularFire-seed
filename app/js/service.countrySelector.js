'use strict';

// Declare module with no dependencies
angular.module('myApp.service.countrySelector', [])

  // Declare factory function
  .factory('gsCountrySelector', function () {

    // Country dropdown/select variables
    var _crntCountry;
    var _countries = [
      [ 'ar', 'Argentina' ],
      [ 'at', 'Austria' ],
      [ 'au', 'Australia' ],
      [ 'be', 'Belgium' ],
      [ 'br', 'Brazil' ],
      [ 'ca', 'Canada' ],
      [ 'cl', 'Chile' ],
      [ 'cn', 'China' ],
      [ 'co', 'Colombia' ],
      [ 'hr', 'Croatia' ],
      [ 'cz', 'Czech Republic' ],
      [ 'dk', 'Denmark' ],
      [ 'eg', 'Egypt' ],
      [ 'fi', 'Finland' ],
      [ 'fr', 'France' ],
      [ 'de', 'Germany' ],
      [ 'gr', 'Greece' ],
      [ 'hk', 'Hong Kong' ],
      [ 'hu', 'Hungary' ],
      [ 'in', 'India' ],
      [ 'id', 'Indonesia' ],
      [ 'ie', 'Ireland' ],
      [ 'il', 'Israel' ],
      [ 'it', 'Italy' ],
      [ 'jp', 'Japan' ],
      [ 'lu', 'Luxembourg' ],
      [ 'my', 'Malaysia' ],
      [ 'mx', 'Mexico' ],
      [ 'nl', 'Netherlands' ],
      [ 'nz', 'New Zealand' ],
      [ 'no', 'Norway' ],
      [ 'pe', 'Peru' ],
      [ 'ph', 'Philippines' ],
      [ 'pl', 'Poland' ],
      [ 'pt', 'Portugal' ],
      [ 'pr', 'Puerto Rico' ],
      [ 'ru', 'Russia' ],
      [ 'sg', 'Singapore' ],
      [ 'za', 'South Africa' ],
      [ 'kr', 'South Korea' ],
      [ 'es', 'Spain' ],
      [ 'se', 'Sweden' ],
      [ 'ch', 'Switzerland' ],
      [ 'tw', 'Taiwan' ],
      [ 'th', 'Thailand' ],
      [ 'tr', 'Turkey' ],
      [ 'gb', 'United Kingdom' ],
      [ 'us', 'United States' ],
      [ 've', 'Venezuela' ],
      [ 'vn', 'Vietnam' ]
    ];

    var getCountryFromCode = function (code) {
      code = (code + '').toLowerCase();
      var n = _countries.length;
      for (var i = 0; i < n; i++) {
        var country = _countries[i];
        if (country[0] === code) {
          return country;
        }
      }
      return undefined;
    };

    var setCountry = function (code) {
      var country = getCountryFromCode(code);
      if (country === undefined) {
        console.log('Error matching code to country');
        return false;
      }
      _crntCountry = country;
      return true;
    };

    var getCountryNameFromCode = function (code) {
      var country = getCountryFromCode(code);
      if (country === undefined) {
        console.log('Error matching code to country name');
      }
      return country[1];
    };

    var getCrntCode = function () {
      if (_crntCountry === undefined) {
        console.log('Error, no country selected');
        return undefined;
      }
      return _crntCountry[0];
    };

    var getCrntName = function () {
      if (_crntCountry === undefined) {
        console.log('Error, no country selected');
        return undefined;
      }
      return _crntCountry[1];
    };



    // Return api
    return {
      crntCountry: _crntCountry,
      countries: _countries,
      setCountry: setCountry,
      getCountryNameFromCode: getCountryNameFromCode,
      getCrntCode: getCrntCode,
      getCrntName: getCrntName
    };
  });