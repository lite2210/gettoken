angular.module('fbSupport.CheckTokenService', [])
    .factory('CheckTokenService', ['$http', '$q', '$filter', 'UtilService', '$window', CheckTokenService]);

function CheckTokenService($http, $q, $filter, UtilService) {
    function checkToken(arr) {
        var deferred = $q.defer();
        var url = 'api/checkTokens';
        $http.post(url, {tokens: arr})
            .then(function (result) {
                console.log("check token result", result.data);
                deferred.resolve(result.data);
            })
            .catch(function (err) {
                console.log("check token err", err);
                deferred.resolve([])
            });
        return deferred.promise;
    }

    return {
        checkToken: checkToken
    }
}
