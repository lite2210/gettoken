angular.module('fbSupport.CheckLiveController', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/checkLive', {
                templateUrl: 'modules/checkLive/check_live.html',
                controller: 'CheckLiveController'
            })
    }])
    .controller('CheckLiveController', ['$scope', '$routeParams', '$filter', '$timeout', 'toaster',
        'UtilService', 'ngDialog', 'CheckLiveService',
        function ($scope, $routeParams, $filter, $timeout, toaster, UtilService, ngDialog, CheckLiveService) {
            $scope.inputData = '';
            $scope.accounts = [];
            $scope.msg = '';

            $scope.moveIdToCheckLive = () => {
                $scope.inputData = $scope.listId;
                $scope.checkLive();
            }

            $scope.checkLive = function () {
                $scope.liveAcc = [];
                $scope.deadAcc = [];
                const data = $scope.inputData.trim().replace(/\s+/g, ',');
                CheckLiveService.check(data).then(function (result) {

                    $scope.accounts = $scope.inputData.trim().split(/\s+/).map(function (elm) {
                        const accInfo = result[elm];
                        if (accInfo) {
                            $scope.liveAcc.push(accInfo.id);
                        } else {
                            $scope.deadAcc.push(elm);
                        }
                        return {
                            input: elm,
                            accId: accInfo ? accInfo.id : elm,
                            accName: accInfo ? accInfo.name : '------------',
                            stt: accInfo ? 'ALIVE' : 'DEAD'
                        }
                    });

                    $scope.liveAcc = $scope.liveAcc.join('\n');
                    $scope.deadAcc = $scope.deadAcc.join('\n');
                }).catch((err) => {
                    console.log('catch ctrl', err);
                    if (err.error) {
                        $scope.msg = err.error.message;
                        console.log('error', $scope.msg);
                        return;
                    }
                })
            }
            
            $scope.checkLive2 = function () {
                $scope.liveAcc = [];
                $scope.deadAcc = [];
                const data = $scope.inputData.trim().replace(/\s+/g, ',');
                CheckLiveService.check2(data).then(function (result) {

                    $scope.accounts = $scope.inputData.trim().split(/\s+/).map(function (elm) {
                        const accInfo = result[elm];
                        if (accInfo) {
                            $scope.liveAcc.push(accInfo.id);
                        } else {
                            $scope.deadAcc.push(elm);
                        }
                        return {
                            input: elm,
                            accId: accInfo ? accInfo.id : elm,
                            accName: accInfo ? accInfo.name || accInfo.id : '------------',
                            stt: accInfo ? 'ALIVE' : 'DEAD'
                        }
                    });

                    $scope.liveAcc = $scope.liveAcc.join('\n');
                    $scope.deadAcc = $scope.deadAcc.join('\n');
                }).catch((err) => {
                    console.log('catch ctrl', err);
                    if (err.error) {
                        $scope.msg = err.error.message;
                        console.log('error', $scope.msg);
                        return;
                    }
                })
            }

            $scope.getAccIdByRegex = () => {
                const pattern = /("accId"|"c_user") : "(\d+)"/g;
                $scope.listId = [];
                let matched;
                while (matched = pattern.exec($scope.dataMongo)) {
                    $scope.listId.push(matched[2]);
                };
                $scope.listId = $scope.listId.join('\n');
            }

        }]);