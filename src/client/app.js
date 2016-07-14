var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/widgets', {
            templateUrl: 'partials/widgets.html',
            controller: 'ListCtrl',
            resolve: {
                factory: checkRouting
            }
        })
        .when('/add-widget', {
            templateUrl: 'partials/widget-form.html',
            controller: 'AddWidgetCtrl',
            resolve: {
                factory: checkRouting
            }
        })
        .when('/widget/:id', {
            templateUrl: 'partials/widget-form.html',
            controller: 'EditWidgetCtrl',
            resolve: {
                factory: checkRouting
            }
        })
        .when('/widget/delete/:id', {
            templateUrl: 'partials/widget-delete.html',
            controller: 'DeleteWidgetCtrl',
            resolve: {
                factory: checkRouting
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

var checkRouting = function ($q, $rootScope, $location, $http) {
    if ($rootScope.userProfile) {
        return true;
    } else {
        $location.path('/login');
        // var deferred = $q.defer();
        // $http.post("/api/profile/load", { userToken: "blah" })
        //     .success(function (response) {
        //         $rootScope.userProfile = response.userProfile;
        //         deferred.resolve(true);
        //     })
        //     .error(function () {
        //         deferred.reject();
        //         $location.path("/");
        //     });
        // return deferred.promise;
    }
};

app.controller('LoginCtrl', ['$scope', '$rootScope', '$location',
    function ($scope, $rootScope, $location) {
        $scope.login = function () {
            $rootScope.userProfile = { username: $scope.username, name: $scope.username };
            $location.path('/');
        }
    }
]);

app.controller('HeaderCtrl', ['$scope', '$rootScope', '$location',
    function ($scope, $rootScope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.logout = function () {
            delete $rootScope.userProfile;
            $location.path('/');
        }
    }
]);

app.controller('ListCtrl', ['$scope', '$http', '$resource',
    function ($scope, $http, $resource) {
        $scope.widgets = $scope.widgets || [];

        $scope.refresh = function () {
            $http.get('/api/widgets')
                .then(function (response) {
                    $scope.widgets = response.data;
                });
        }

        if ($scope.widgets.length == 0) {
            $scope.refresh();
        }
        // var widgets = $resource('/api/widgets');
        // widgets.query(function (widgets) {
        //     $scope.widgets = widgets;
        // });
    }
]);

app.controller('AddWidgetCtrl', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {
        $scope.save = function () {
            var widgets = $resource('/api/widgets');
            widgets.save($scope.widget, function () {
                $location.path('/widgets');
            });
        }
    }
]);

app.controller('EditWidgetCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function ($scope, $resource, $location, $routeParams) {
        var widgets = $resource('/api/widgets/:id', { id: $routeParams.id }, {
            update: { method: 'PUT' }
        });

        widgets.get({ id: $routeParams.id }, function (widget) {
            $scope.widget = widget;
        });

        $scope.save = function () {
            widgets.update($scope.widget, function () {
                $location.path('/widgets');
            })
        }
    }
]);

app.controller('DeleteWidgetCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function ($scope, $resource, $location, $routeParams) {
        var widgets = $resource('/api/widgets/:id');

        widgets.get({ id: $routeParams.id }, function (widget) {
            $scope.widget = widget;
        })

        $scope.delete = function () {
            widgets.delete({ id: $routeParams.id }, function (widget) {
                $location.path('/widgets');
            });
        }
    }]
);