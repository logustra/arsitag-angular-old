(() => {
    function artikel() {
        return {
            restrict: 'A',
            templateUrl: 'directive/scenes/artikel/artikel.tpl.html',
        };
    }

    angular
        .module('angular.old')
        .directive('artikel', artikel);
})();
