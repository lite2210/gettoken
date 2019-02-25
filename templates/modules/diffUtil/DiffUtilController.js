angular.module('fbSupport.DiffUtilController', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/diff', {
                templateUrl: 'modules/diffUtil/diff_util.html',
                controller: 'DiffUtilController'
            })
    }])
    .controller('DiffUtilController', ['$scope', '$routeParams', '$filter', '$timeout', 'toaster',
        'UtilService', 'FastShareService',
        function ($scope, $routeParams, $filter, $timeout, toaster, UtilService, FastShareService) {
            $scope.sourceInput = '';
            $scope.targetInput = '';
            $scope.desInput = '';
            $scope.getDiff = getDiff;
            $scope.uniqueSource = uniqueSource;
            $scope.getSame = getSame;

            function getSame() {
                var sourceArray = $scope.sourceInput.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                });
                var targetArray = $scope.targetInput.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                });

                var desArray = UtilService.sameArray(sourceArray, targetArray).join('\n');
                $scope.desInput = desArray ? desArray : null;
            }

            function uniqueSource() {
                var sourceArray = $scope.sourceInput.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                });
                console.log("check", UtilService.uniq(sourceArray));
                var desArray = UtilService.uniq(sourceArray).join('\n');
                $scope.desInput = desArray ? desArray : null;
            }

            function getDiff() {
                var sourceArray = $scope.sourceInput.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                });
                var targetArray = $scope.targetInput.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                });

                var desArray = UtilService.simpleDiff(sourceArray, targetArray).join('\n');
                $scope.desInput = desArray ? desArray : null;
            }

        }]);