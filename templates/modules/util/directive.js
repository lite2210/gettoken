angular.module('fbSupport.UtilDirective', [])
    .directive('selectOnClick', function ($window) {
        return {
            link: function (scope, element) {
                element.on('click', function () {
                    var selection = $window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(element[0]);
                    selection.removeAllRanges();
                    selection.addRange(range);
                });
            }
        }
    });