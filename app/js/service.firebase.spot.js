'use strict';

angular.module('myApp.service.firebase.spot', [])

  .factory('gsFirebaseUserSpots', function (firebaseRef, $timeout) {

    function UserSpots (userId) {
      this.userId = userId;
      this.spotsRef = firebaseRef('spots');
      this.userSpotsRef = firebaseRef('users', this.userId, 'spots');
      this.data = {};

      var self = this;

      this.userSpotsRef.on('child_added', function (userSpot) {
        var ref = userSpot.name();
        self.spotsRef.child(ref).on('value', function (spot) {
          $timeout(function () {
            self.data[ref] = spot.val();
          });
        });
      });

      this.userSpotsRef.on('child_removed', function (userSpot) {
        var ref = userSpot.name();
        $timeout(function () {
          delete self.data[ref];
        });
      });
    }

    UserSpots.prototype = {

      buildFactualRef: function (factualId) {
        return 'factual_' + factualId;
      },
 
      add: function (spotData) {
        this._addSpot(spotData);
        this._addUserSpot(spotData);
      },

      _addUserSpot: function (spotData) {
        var factualRef = this.buildFactualRef(spotData.factualId);
        this.userSpotsRef.child(factualRef).set(true);
      },
 
      _addSpot: function (spotData) {
        var factualRef = this.buildFactualRef(spotData.factualId);
        var self = this;
        this.spotsRef.child(factualRef).transaction(function(currentSpotData) {
          console.log(currentSpotData);
          if (!currentSpotData) { currentSpotData = {}; }
          if (!currentSpotData.users) { currentSpotData.users = {}; }
          angular.extend(currentSpotData, self._cleanData(spotData));
          currentSpotData.users[self.userId] = true;
          return currentSpotData;
        });
      },

      remove: function (spotData) {
        this._removeSpotUser(spotData);
        this._removeUserSpot(spotData);
      },

      _removeSpotUser: function (spotData) {
        var factualRef = this.buildFactualRef(spotData.factualId);
        this.spotsRef.child(factualRef).child('users').child(this.userId).remove();
      },

      _removeUserSpot: function (spotData) {
        var factualRef = this.buildFactualRef(spotData.factualId);
        this.userSpotsRef.child(factualRef).remove();
      },

      _cleanData: function (data) {
        var cleanedData = {};
        angular.forEach(data, function(value, key){
          if (key.match(/^\$/)) { return; }
          cleanedData[key] = value;
        });
        return cleanedData;
      }
    };


    return function getUser (userId) {
      console.log('--->' + userId);
      return new UserSpots(userId);
    };
  });