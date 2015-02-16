'use strict';

/* Controllers */

angular.module('harPerformanceMonitor.controllers', [])

.controller('PerformanceCtrl', ['$scope','profilePerformanceService','profileListService', function($scope,profilePerformanceService,profileListService) {
  $scope.sideBar = true;
  $scope.showHelp = true;
  $scope.chart = {};// will be used to call methods in chart directive

  profileListService.get().then(function (list) {
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

.controller('ManageCurrentCtrl', ['$scope','profileListService','loadProfileService', function($scope,profileListService,loadProfileService){
  
  $scope.gridOptions = {
          enableSorting: true,
          columnDefs: [
            { name:'Path', field: 'request.url' }
            // { name:'1stFriend', field: 'friends[0]' },
            // { name:'city', field: 'address.city'},
            // { name:'getZip', field: 'getZip()', enableCellEdit:false}
          ],
          data : [ 
                 ]
        };
  
  $scope.har;

  profileListService.get().then(function (list) {
    $scope.profiles = list;
    $scope.profile = $scope.profiles[0];
  });

  $scope.loadProfile = function() {
    console.log($scope.profile);
    loadProfileService.get($scope.profile.id).then(function (profile) {
      console.log(profile);
      $scope.har = profile;
      $scope.gridOptions.data = $scope.har.log.entries;
    });
  }

}])

.controller('ManageNewCtrl', ['$scope', function($scope){
    console.log('ManageNewCtrl')
}])

.controller('ManageSettingsCtrl', ['$scope', function($scope){
    console.log('ManageSettingsCtrl')
}])