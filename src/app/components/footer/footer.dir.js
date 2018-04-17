(() => {
    function footer() {
        return {
            restrict: 'A',
            templateUrl: 'directive/components/footer/footer.tpl.html',
        };
    }

    angular
        .module('angular.old')
        .directive('footer', footer);
})();
