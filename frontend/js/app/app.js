'use strict';


// Declare app level module which depends on filters, and services
angular.module('harPerformanceMonitor', [
  'ngRoute',
  'harPerformanceMonitor.filters',
  'harPerformanceMonitor.services',
  'harPerformanceMonitor.directives',
  'harPerformanceMonitor.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/performance', {templateUrl: 'partials/_performance.html', controller: 'PerformanceCtrl'});
  $routeProvider.when('/manage', {templateUrl: 'partials/_manage.html', controller: 'ManageCtrl'});
  $routeProvider.otherwise({redirectTo: '/performance'});
}]);
