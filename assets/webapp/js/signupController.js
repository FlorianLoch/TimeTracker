(function () {
  var mod = angular.module("workTrackingApp");

  mod.controller("SignupController", ["$scope", "accountManager", function ($s, accMan) {
    $s.signUp = function () {
      if ($s.password !== $s.password2) {
        $s.error = "The passwords are not equal, please make sure they are the same.";
        return;
      }

      accMan.signUp($s.email, $s.firstName, $s.lastName, $s.password, $s.startTime).then(function success (res) {
        $location.path("/workweek");
      }, function failed (res) {
        $s.error = "Signup failed.";
        if (res.data.msg) {
          $s.error += " Further information: " + res.data.msg;
        }
      });
    };
  }]);
})();
