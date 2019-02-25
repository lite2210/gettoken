(function () {
    'use strict';
    var myApp = angular.module('fbSupport', [
        'ngAnimate',
        'ui.bootstrap',
        'toaster',
        'ngRoute',
        'angular-md5',
        'ngDialog',
        'smart-table',
        'ui.dateTimeInput',
        'ui.bootstrap.datetimepicker',
        'frapontillo.bootstrap-switch',

        'fbSupport.UtilService',
        'fbSupport.SimpleService',
        'fbSupport.UtilDirective',
        
        'fbSupport.GetTokenController',
        'fbSupport.GetTokenService',
        
        'fbSupport.ManageAccountController',
        'fbSupport.ManageAccountService',

        'fbSupport.CheckLiveController',
        'fbSupport.CheckLiveService'
    ]);

    myApp.config(['$routeProvider', '$locationProvider' ,'$sceDelegateProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/getToken'
            });
        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
    }]);
})();