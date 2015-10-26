(function () {
  const ME_URL = "/me";

  var mod = angular.module("workTrackingApp");

  mod.controller("InitController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $http({
      method: "HEAD",
      url: ME_URL
    }).then(function ok(res) {
      $location.path("/workweek");
    }, function err(res) {
      $location.path("/login");
    });
  }]);
})();
