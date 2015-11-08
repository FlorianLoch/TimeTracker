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

  app.factory("accountManager", ["$http", "$q", function accountManagerFactory($http, $q) {
    const LOGIN_URL = "/login";
    const SIGNUP_URL = "/signup";
    var currentAccount = {};

    return {
      getCurrentAccount: function () {return currentAccount;},
      isLoggedIn: function () {return !!currentAccount;},
      login: function (email, password) {
        var prom = $q.defer();

        console.log(arguments);

        $http({
          method: "POST",
          url: LOGIN_URL,
          data: {
            "email": email,
            "password": password
          }
        }).then(function ok(res) {
          currentAccount = res.data;
          prom.resolve(res);
        }, function err(res) {
          currentAccount = {};
          prom.reject(res);
        });

        return prom.promise;
      },
      signUp: function (email, firstName, lastName, password, startTime) {
        var prom = $q.defer();

        var data = {
          "email": email,
          "firstName": firstName,
          "lastName": lastName,
          "password": password,
          "startTimestamp": startTime
        };

        $http({
          method: "POST",
          url: SIGNUP_URL,
          data: data
        }).then(function ok(res) {
          currentAccount = res.data;
          prom.resolve(res);
        }, function err(res) {
          currentAccount = {};
          prom.reject(res);
        });

        return prom.promise;
      }
    };
  }]);
})();
