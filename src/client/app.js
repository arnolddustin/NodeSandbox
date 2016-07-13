var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html'
        })
        .when('/widgets', {
            templateUrl: 'partials/widgets.html',
            controller: 'ListCtrl'
        })
        .when('/add-widget', {
            templateUrl: 'partials/widget-form.html',
            controller: 'AddWidgetCtrl'
        })
        .when('/widget/:id', {
            templateUrl: 'partials/widget-form.html',
            controller: 'EditWidgetCtrl'
        })
        .when('/widget/delete/:id', {
            templateUrl: 'partials/widget-delete.html',
            controller: 'DeleteWidgetCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HeaderCtrl', ['$scope', '$location', 
function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}
]);

app.controller('ListCtrl', ['$scope', '$resource',
    function ($scope, $resource) {
        var widgets = $resource('/api/widgets');
        widgets.query(function (widgets) {
            $scope.widgets = widgets;
        });
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