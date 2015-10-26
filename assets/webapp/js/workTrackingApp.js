(function () {
  var app = angular.module("workTrackingApp", ["ngRoute"]);

  app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.
    when("/login", {
      templateUrl: "views/login_view.html",
      controller: "LoginController"
    }).
    when("/workweek",  {
      templateUrl: "views/workweek_view.html",
      controller: "WorkweekController"
    }).
    when("/loading",  {
      templateUrl: "views/loading_view.html",
      controller: "InitController"
    }).
    otherwise({
      redirectTo: "/loading"
    });
  }]);
})();
