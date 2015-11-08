(function () {
  const LOGIN_URL = "/me";

  var mod = angular.module("workTrackingApp");

  mod.controller("LoginController", ["$scope", "accountManager", function ($s, accMan) {
    $s.login = function () {
      accMan.login($s.email, $s.password).then(function success (res) {
        $location.path("/workweek");
      }, function failed (res) {
        $s.error = "Provided credentials are not valid! Please try again.";
      });
    };
  }]);
})();
