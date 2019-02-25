angular.module('fbSupport.ManageAccountController', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/manageAccount', {
                templateUrl: 'modules/manageAccount/manage_account.html',
                controller: 'ManageAccountController'
            })
    }])
    .controller('ManageAccountController', ['$scope', '$routeParams', '$filter', '$timeout', 'toaster',
        'UtilService', 'ngDialog', 'SimpleService',
        function ($scope, $routeParams, $filter, $timeout, toaster, UtilService, ngDialog, SimpleService) {

            $scope.inputData = 'abc.proxy.com|3128|myusername|andpassword|mark.zuck@gmail.com|1234567\nabc.proxy.com|3128|myusername|andpassword|mark.zuck@gmail.com|123456';
            $scope.acc = {};
            $scope.proxy = {};
            $scope.isShowToken = false;

            $scope.importAccount = importAccount;

            function parseData() {
                let rows = [];
                $scope.inputData.split('\n').forEach(function (data) {
                    data = data.trim().trim().split(/[\||\t]/);
                    if (data.length > 2) {
                        rows.push({
                            host: data[0],
                            port: data[1],
                            user: data[2],
                            pw: data[3],
                            email: data[4],
                            fbpw: data[5],
                        })
                    } else if (data.length == 2) {
                        rows.push({
                            email: data[0],
                            fbpw: data[1]
                        })
                    }
                });

                console.log('accs =', rows);
                return rows;
            }

            async function importAccount() {
                const accs = parseData();
                await SimpleService.send('IMPORT', accs);
            }
        }]);