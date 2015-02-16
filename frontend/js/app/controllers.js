'use strict';

/* Controllers */

angular.module('harPerformanceMonitor.controllers', [])

.controller('PerformanceCtrl', ['$scope','profilePerformanceService','profielListService', function($scope,profilePerformanceService,profielListService) {
  $scope.sideBar = true;
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

.controller('ManageCtrl', ['$scope', function($scope) {
  $scope.pages = [
      {url: 'partials/_manage_current.html'},
      {url: 'partials/_manage_new.html'},
      {url: 'partials/_manage_settings.html'}
  ];
  $scope.manage = function (e,page) {
    e.preventDefault();
    $scope.activePage = page;    
  }
  $scope.activePage = $scope.pages[0];

}])

.controller('ManageCurrentCtrl', ['$scope', function($scope){
    console.log('ManageCurrentCtrl')
}])

.controller('ManageNewCtrl', ['$scope', function($scope){
    console.log('ManageNewCtrl')
}])

.controller('ManageSettingsCtrl', ['$scope', function($scope){
    console.log('ManageSettingsCtrl')
}])