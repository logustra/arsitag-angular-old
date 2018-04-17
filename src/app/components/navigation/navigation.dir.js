import * as angular from 'angular';

(() => {
    function navigation($window) {
        function templateUrlHandler() {
            const isMobile = $window.innerWidth <= 992;

            if (isMobile) {
                return 'directive/components/navigation/sidebar.tpl.html';
            }
            return 'directive/components/navigation/navigation.tpl.html';
        }

        function navigationCtr() {
            const vm = this;

            vm.isOpen = false;
        }

        return {
            restrict: 'E',
            scope: {},
            templateUrl: templateUrlHandler,
            controller: navigationCtr,
            controllerAs: 'vm',
        };
    }

    angular
        .module('angular.old')
        .directive('navigation', navigation);
})();
