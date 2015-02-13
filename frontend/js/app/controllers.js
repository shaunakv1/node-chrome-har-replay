'use strict';

/* Controllers */

angular.module('harPerformanceMonitor.controllers', [])

.controller('PerformanceCtrl', ['$scope','profilePerformanceService','profielListService', function($scope,profilePerformanceService,profielListService) {
  $scope.showHelp = true;
  $scope.chart = {};// will be used to call methods in chart directive

  profielListService.get().then(function (list) {
    $scope.profiles = list;
    $scope.profile = $scope.profiles[0];
  });

  $scope.displayProfilePerformance =  function () {
    profilePerformanceService.get($scope.profile.name).then(function (log) {
      $scope.showHelp = false;
      $scope.chart.addSeries({
          data:log,
          name:$scope.profile.name
      });
    });
  };

}])

.controller('ManageCtrl', [function() {

}])