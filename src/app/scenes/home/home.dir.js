(() => {
    function home() {
        return {
            restrict: 'A',
            templateUrl: 'directive/scenes/home/home.tpl.html',
        };
    }

    angular
        .module('angular.old')
        .directive('home', home);
})();
