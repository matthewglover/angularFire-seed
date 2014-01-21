//*global stub*/
'use strict';

describe('LoginCtrl', function () {

  // ##################################################################
  // test suite configuration
  // ##################################################################
  var $scope, Ctrl, data;

  beforeEach(module('myApp.controllers'));

  beforeEach(module(function ($provide) {
    var fn = function () { };
    $provide.value('loginService', { login: fn, createAccount: fn });
    $provide.value('$route', {});
  }));

  // Create LoginCtrl instance
  beforeEach(inject(
    function($controller, $rootScope) {
      $scope = $rootScope.$new();
      Ctrl = $controller('LoginCtrl', { $scope: $scope });
    }
  ));

  beforeEach(function () {
    data = { email: 'test@testing.com', password: 'password', confirm: 'password' };
  });

  // ##################################################################
  // $scope#submit
  // ##################################################################
  describe('$scope.submit', function () {

    describe('with $scope.createMode=false', function () {

      it('should call login method with email and password',
        function () {
          spyOn(Ctrl, 'login');
          $scope.createMode = false;
          $scope.submit(data.email, data.password);
          expect(Ctrl.login).toHaveBeenCalledWith( data.email, data.password);
        }
      );
    });

    describe('with $scope.createMode=true', function () {

      it('should call createAccount method with email, password and password confirm',
        function () {
          spyOn(Ctrl, 'createAccount');
          $scope.createMode = true;
          $scope.submit(data.email, data.password, data.confirm);
          expect(Ctrl.createAccount).toHaveBeenCalledWith(data.email, data.password, data.confirm);
        }
      );
    });
  });

  // ##################################################################
  // Ctrl#login
  // ##################################################################
  describe('#login', function () {

    it('should set error message to "Please enter an email address" when no email provided',
      function () {
        data.email = undefined;
        Ctrl.login(data.email, data.password);
        expect($scope.errorMessage).toBe('Please enter an email address');
      }
    );

    it('should set error message to "Please enter a password" when no password provided',
      function () {
        data.password = undefined;
        Ctrl.login(data.email, data.password);
        expect($scope.errorMessage).toBe('Please enter a password');
      }
    );

    it('should call loginService.login when both email and password provided',
      inject(function (loginService) {
        spyOn(loginService, 'login');
        Ctrl.login(data.email, data.password);
        expect(loginService.login).toHaveBeenCalled();
      })
    );
  });

  describe('#createAccount', function () {
    
    it('should set error message to "Please enter an email address" when no email provided',
      inject(function (loginService) {
        data.email = undefined;
        spyOn(loginService, 'createAccount');
        Ctrl.createAccount(data.email, data.password, data.confirm);
        expect($scope.errorMessage).toBe('Please enter an email address');
        expect(loginService.createAccount).not.toHaveBeenCalled();
      })
    );

    it('should set error message to "Please enter a password" when no password provided',
      inject(function (loginService) {
        data.password = undefined;
        spyOn(loginService, 'createAccount');
        Ctrl.createAccount(data.email, data.password, data.confirm);
        expect($scope.errorMessage).toBe('Please enter a password');
        expect(loginService.createAccount).not.toHaveBeenCalled();
      })
    );

    it('should set error message to "Passwords do not match" when no password confirm provided',
      inject(function (loginService) {
        data.confirm = undefined;
        spyOn(loginService, 'createAccount');
        Ctrl.createAccount(data.email, data.password, data.confirm);
        expect($scope.errorMessage).toBe('Passwords do not match');
        expect(loginService.createAccount).not.toHaveBeenCalled();
      })
    );

    it('should call loginService.createAccount when email, password and confirm provided',
      inject(function (loginService) {
        spyOn(loginService, 'createAccount');
        Ctrl.createAccount(data.email, data.password, data.confirm);
        expect(loginService.createAccount).toHaveBeenCalled();
      })
    );
  });
});