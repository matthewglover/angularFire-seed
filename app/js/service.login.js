'use strict';

angular.module('myApp.service.login', ['firebase', 'myApp.service.firebase'])

  .factory('loginService',
    function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout) {
      var auth = null;
 
      function assertAuth() {
        if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
      }

      return {
        init: function() {
          auth = $firebaseSimpleLogin(firebaseRef());
          return auth;
        },

        /**
         * @param {string} email
         * @param {string} pass
         * @param {Function} [callback]
         * @returns {*}
         */
        login: function(email, pass, callback) {
          assertAuth();
          auth.$login('password', {
            email: email,
            password: pass,
            rememberMe: true
          }).then(function(user) {
              if( callback ) {
                //todo-bug https://github.com/firebase/angularFire/issues/199
                $timeout(function() {
                  callback(null, user);
                });
              }
            }, callback);
        },

        logout: function() {
          assertAuth();
          auth.$logout();
        },

        changePassword: function(opts) {
          assertAuth();
          var cb = opts.callback || function() {};
          if( !opts.oldpass || !opts.newpass ) {
            $timeout(function(){ cb('Please enter a password'); });
          }
          else if( opts.newpass !== opts.confirm ) {
            $timeout(function() { cb('Passwords do not match'); });
          }
          else {
            auth.$changePassword(opts.email, opts.oldpass, opts.newpass)
            .then(function () { if (cb) { cb(null); } }, cb);
          }
        },

        createAccount: function(email, pass, cb) {
          assertAuth();
          auth.$createUser(email, pass)
            .then(function (user) { if (cb) { cb(null, user); } }, cb);
        },

        createProfile: profileCreator
      };
    })

  .factory('profileCreator', function(firebaseRef, $timeout) {
    return function(id, email, callback) {

      function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@'))||'');
      }

      function ucfirst (str) {
        // credits: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

      firebaseRef('users/'+id).set({email: email, name: firstPartOfEmail(email)}, function(err) {
        //err && console.error(err);
        if( callback ) {
          $timeout(function() {
            callback(err);
          });
        }
      });
    };
  });
