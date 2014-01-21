'use strict';

angular.module('myApp.controllers')
  .controller('LoginCtrl',
    function($scope, loginService, $location, $route) {
      $scope.email = null;
      $scope.password = null;
      $scope.confirm = null;
      // $scope.createMode = false;

      var login = function(email, password, cb) {
        $scope.errorMessage = null;
        if( !email ) {
          $scope.errorMessage = 'Please enter an email address';
        }
        else if( !password ) {
          $scope.errorMessage = 'Please enter a password';
        }
        else {
          loginService.login(email, password, function(err, user) {
            $scope.errorMessage = err ? err + '' : null;
            if( !err && cb) {
              cb(user);
            }
          });
        }
      };

      var createAccount = function(email, password, passwordConfirm) {
        $scope.errorMessage = null;
        if( assertValidLoginAttempt(email, password, passwordConfirm) ) {
          loginService.createAccount(email, password, function(err, user) {
            if( err ) {
              $scope.errorMessage = err ? err + '' : null;
            }
            else {
              // must be logged in before I can write to my profile
              login(email, password, function () {
                loginService.createProfile(user.uid, user.email, function () {
                  $location.path('/account');
                });
              });
            }
          });
        }
      };

      var assertValidLoginAttempt = function (email, password, passwordConfirm) {
        if( !email ) {
          $scope.errorMessage = 'Please enter an email address';
        }
        else if( !password ) {
          $scope.errorMessage = 'Please enter a password';
        }
        else if( password !== passwordConfirm ) {
          $scope.errorMessage = 'Passwords do not match';
        }
        return !$scope.errorMessage;
      };

      $scope.submit = function (email, password, passwordConfirm) {
        if ($scope.createMode) {
          createAccount(email, password, passwordConfirm);
        } else {
          login(email, password);
        }
      };

      $scope.toggleSignup = function () {
        $scope.createMode = !$scope.createMode;
      };

      $scope.$on('$routeChangeSuccess', function() {
        $scope.createMode = $route.current.createMode;
      });
    }
  );