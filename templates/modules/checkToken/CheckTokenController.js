angular.module('fbSupport.CheckTokenController', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/checkToken', {
                templateUrl: 'modules/checkToken/check_token.html',
                controller: 'CheckTokenController'
            })
    }])
    .controller('CheckTokenController', ['$scope', '$routeParams', '$filter', '$timeout', 'toaster',
        'UtilService','ngDialog', 'CheckTokenService',
        function ($scope, $routeParams, $filter, $timeout, toaster, UtilService, ngDialog, CheckTokenService) {
            $scope.listToken = '';
            $scope.tokenResultArr = [];
            $scope.listTokenResult = '';
            $scope.duplicatedValue = 0;

            $scope.checkToken = checkToken;
            $scope.exportToken = exportToken;

            function exportToken() {
                var exportData = {};
                var selectedArray = $scope.tokenResultArr.filter(function (item) {
                    return item.selected && item.status === 'ALIVE';
                });
                if(selectedArray.length === 0){
                    selectedArray = $scope.tokenResultArr.filter(function (item) {
                        return item.status === 'ALIVE';
                    });
                }

                exportData.listGroupId = selectedArray.map(function (group) {
                    return group.fbAccountId;
                }).join('\n');
                exportData.listData = '';
                selectedArray.forEach(function (item, index) {
                    var newLineCharacter = (index !== selectedArray.length -1 ) ? '\n' : '';
                    var singleLine = item.fbToken + '|' +
                        item.fbAccountId + '|' +
                        item.fbAccountName + newLineCharacter;

                    console.log("single Line =", singleLine);
                    exportData.listData += singleLine;
                });
                ngDialog.open({
                    template: 'modules/fastShare/popup_group.html',
                    className: 'ngdialog-theme-default',
                    data: exportData,
                    width: '80%',
                    height: '100%'
                });
            }

            function checkToken() {
                $scope.tokenResultArr = [];
                var tokenArr = $scope.listToken.split('\n').filter(function (item) {
                    return (item && item.length > 0)
                }).map(function (item, index) {
                    return {fbToken: item, id: index}
                });

                console.log("token arr =", tokenArr);

                CheckTokenService.checkToken(tokenArr).then(function (result) {
                    tokenArr.forEach(function (item) {
                        item.status = 'DEAD';
                        result.forEach(function (resultItem) {
                            if (item.fbToken == resultItem.fbToken) {
                                item.fbAccountId = resultItem.fbAccountId;
                                item.fbAccountName = resultItem.fbAccountName;
                                item.birthday = resultItem.birthday;
                                item.location = resultItem.location;
                                item.status = resultItem.status;
                            }
                        })
                    });

                    var distinctArr = UtilService.uniqueArr(tokenArr, 'fbToken');
                    $scope.duplicatedValue = tokenArr.length - distinctArr.length;
                    $scope.listTokenResult = distinctArr.filter(function (item) {
                        return item.status == 'ALIVE';
                    }).map(function (item) {
                        return item.fbToken
                    }).join('\n');
                    $scope.tokenResultArr = distinctArr;
                })
            }

        }]);