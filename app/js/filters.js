'use strict';

/* Filters */

angular.module('myApp.filters', [])

  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])

  .filter('excludeMatching', function () {

    var fnFilter;

    var checkExists = function (val, matches) {
      if (angular.isDefined(fnFilter)) { val = fnFilter(val); }
      var n = matches.length;
      for (var i = 0; i < n; i++) {
        if (matches[i] === val) { return true; }
      }
      return false;
    };

    var checkItem = function (item, field, matches) {
      var val = item[field];
      if (!angular.isDefined(val)) { return item; }
      if (checkExists(val, matches)) { return undefined; }
      return item;
    };

    var checkProp = function (item, prop, matches) {
      if (checkExists(prop, matches)) { return undefined; }
      return item;
    };

    var arrayFilter = function (items, matches, field) {
      var n = items.length;
      var output = [];
      for (var i = 0; i < n; i++) {
        var item = checkItem(items[i], field, matches);
        if (angular.isDefined(item)) { output.push(item); }
      }
      return output;
    };

    var objectFilter = function (items, matches, field) {
      var output = {};
      for (var prop in items ) {
        var item = (angular.isDefined(field)) ?
          checkItem(items[prop], field, matches) : checkProp(items[prop], prop, matches);
        if (angular.isDefined(item)) { output[prop] = item; }
      }
      return output;
    };

    var getKeysArray = function (obj) {
      var output = [];
      for (var key in obj) {
        output.push(key);
      }
      return output;
    };

    return function (items, matches, field, matchFilter) {
      // Reset filter and set to matchFilter, if exists
      fnFilter = undefined;
      if (angular.isDefined(matchFilter)) { fnFilter = matchFilter; }

      // Get matches array. Return if no array to match against
      if (angular.isObject(matches)) { matches = getKeysArray(matches); }
      if (!angular.isArray(matches)) { return items; }

      // Handle items array
      if (angular.isArray(items)) {
        if (!angular.isDefined(field)) { return items; }
        return arrayFilter(items, matches, field);
      }

      // Handle items object
      if (angular.isObject(items)) { return objectFilter(items, matches, field); }
    };
  })

  .filter('reverse', function() {
    function toArray(list) {
      var k, out = [];
      if( list ) {
        if( angular.isArray(list) ) {
          out = list;
        }
        else if( typeof(list) === 'object' ) {
          for (k in list) {
            if (list.hasOwnProperty(k)) { out.push(list[k]); }
          }
        }
      }
      return out;
    }
    return function(items) {
      return toArray(items).slice().reverse();
    };
  });
