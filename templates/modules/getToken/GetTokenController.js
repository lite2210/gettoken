angular.module('fbSupport.GetTokenController', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/getToken', {
                templateUrl: 'modules/getToken/get_token.html',
                controller: 'GetTokenController'
            })
    }])
    .controller('GetTokenController', ['$scope', '$routeParams', '$filter', '$timeout', 'toaster',
        'UtilService', 'ngDialog', 'GetTokenService',
        function ($scope, $routeParams, $filter, $timeout, toaster, UtilService, ngDialog, GetTokenService) {

            $scope.inputData = '';
            $scope.acc = {};
            $scope.proxy = {};
            $scope.isShowToken = false;
            $scope.result = '';

            $scope.startGetTokenMultiple = startGetTokenMultiple;

            function getDraft() {
                const data = $scope.inputData.trim().split(/[\||\t]/);
                if (data.length > 2) {
                    $scope.proxy = {
                        host: data[0],
                        port: data[1],
                        user: data[2],
                        pw: data[3]
                    }
                    $scope.acc = {
                        email: data[4],
                        pw: data[5],
                    }
                } else if (data.length == 2) {
                    $scope.acc = {
                        email: data[0],
                        pw: data[1],
                    };
                    $scope.proxy = {};
                }
            }

            function getToken() {
                $scope.isShowToken = false;
                // console.log('before request', $scope.acc);
                GetTokenService.getToken({ acc: $scope.acc, proxy: $scope.proxy }).then(function (result) {
                    $scope.isShowToken = true;
                    $scope.result = result.access_token || result.error_msg;
                })
            }

            function parseAccs() {
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
                            fbpw: data[5]
                        })
                    } else if (data.length == 2) {
                        rows.push({
                            email: data[0],
                            fbpw: data[1]
                        })

                    }
                });

                return rows;
            }

            async function startGetTokenMultiple() {
                $scope.result = '';
                let accs = parseAccs();
                accs = await getTokenMultile(accs);
                console.log('accs =', accs);

                $scope.$apply(function () {
                    $scope.result = accs.map(function (el) {
                        delete el.stt;
                        console.log('check values', Object.values(el).join('|'));
                        return Object.values(el).join('|');
                    }).join('\n');
                });
            }

            async function getTokenMultile(accs) {
                $scope.isShowToken = true;
                let currentAcc = $filter('filter')(accs, { stt: '!DONE' });
                if (currentAcc.length == 0) {
                    console.log('stop', currentAcc);
                    return accs;
                }
                currentAcc = currentAcc[0];
                console.log('current acc', currentAcc);
                const resp = await GetTokenService.getToken(currentAcc);
                console.log('resp', resp);
                currentAcc.fbId = resp.uid;
                currentAcc.token = resp.access_token || resp.error_msg;
                currentAcc.stt = 'DONE';
                $scope.result += ((resp.error_msg || resp.access_token) + '\n');
                return getTokenMultile(accs);
            }
        }]);