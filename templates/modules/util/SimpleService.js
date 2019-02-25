angular.module('fbSupport.SimpleService', [])
    .factory('SimpleService', ['$http', '$q', '$filter', 'UtilService', '$window', SimpleService]);

function SimpleService($http, $q, $filter, UtilService) {
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

    function send(task, data) {
        var deferred = $q.defer();
        var url = 'api/simpleTask';
        $http.post(url, { task: task, data: data })
            .then(function (result) {
                console.log("simpleTask result", result.data);
                deferred.resolve(result.data);
            })
            .catch(function (err) {
                console.log("simpleTask err", err);
                deferred.resolve([])
            });
        return deferred.promise;
    }

    return {
        send: send,
        getToken: getToken
    }
}
