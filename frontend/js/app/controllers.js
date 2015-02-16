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
  
  $scope.har = [
    {
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
    },
    {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
    },
    {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
    }
];

  profileListService.get().then(function (list) {
    $scope.profiles = list;
    $scope.profile = $scope.profiles[0];
  });

  $scope.loadProfile = function() {
    console.log($scope.profile);
    loadProfileService.get($scope.profile.id).then(function (profile) {
      console.log(profile);
      $scope.har = profile;
    });
  }

}])

.controller('ManageNewCtrl', ['$scope', function($scope){
    console.log('ManageNewCtrl')
}])

.controller('ManageSettingsCtrl', ['$scope', function($scope){
    console.log('ManageSettingsCtrl')
}])