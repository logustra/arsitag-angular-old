(() => {
    function inspirasi() {
        return {
            restrict: 'A',
            templateUrl: 'directive/scenes/inspirasi/inspirasi.tpl.html',
        };
    }

    angular
        .module('angular.old')
        .directive('inspirasi', inspirasi);
})();
