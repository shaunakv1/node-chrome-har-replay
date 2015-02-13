'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('harPerformanceMonitor.services', []).  
  factory('_', function() {
     return window._; // assumes underscore has already been loaded on the page
  });
