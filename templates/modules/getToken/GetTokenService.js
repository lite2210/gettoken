angular.module('fbSupport.GetTokenService', [])
    .factory('GetTokenService', ['$http', '$q', '$filter', 'UtilService', '$window', GetTokenService]);

function GetTokenService($http, $q, $filter, UtilService) {
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
