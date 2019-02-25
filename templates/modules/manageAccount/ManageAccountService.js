angular.module('fbSupport.ManageAccountService', [])
    .factory('ManageAccountService', ['$http', '$q', '$filter', 'UtilService', '$window', ManageAccountService]);

function ManageAccountService($http, $q, $filter, UtilService) {
    function getToken(data) {
        var deferred = $q.defer();
        var url = 'api/getToken';
        $http.post(url, data)
            .then(function (result) {
                console.log("getToken result", result.data);
                deferred.resolve(result.data);
            })
            .catch(function (err) {
                console.log("getToken err", err);
                deferred.resolve([])
            });
        return deferred.promise;
    }

    return {
        getToken: getToken
    }
}
