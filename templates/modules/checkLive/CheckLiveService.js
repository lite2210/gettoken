angular.module('fbSupport.CheckLiveService', [])
    .factory('CheckLiveService', ['$http', '$q', '$filter', 'UtilService', '$window', CheckLiveService]);

function CheckLiveService($http, $q, $filter, UtilService) {
    function check(idsStr) {
        var deferred = $q.defer();
        $http.get('https://graph.facebook.com', {
            params: {
                access_token: '208289142921346|0GgvoKKA0eLtBdZcYnKkiTlueFk',
                ids: idsStr
            }
        })
            .then(function (result) {
                console.log("check live result", result.data);
                deferred.resolve(result.data);
            })
            .catch(function (err) {
                console.log("check live err", err);
                deferred.reject(err.data)
            });
        return deferred.promise;
    }
    
    function check2(idsStr) {
        var deferred = $q.defer();
        $http.get('https://graph.facebook.com', {
            params: {
                fields: 'picture.fields(is_silhouette)',
                ids: idsStr
            }
        })
            .then(function (result) {
                console.log("check live result", result.data);
                deferred.resolve(result.data);
            })
            .catch(function (err) {
                console.log("check live err", err);
                deferred.reject(err.data)
            });
        return deferred.promise;
    }

    return {
        check: check,
        check2: check2
    }
}
