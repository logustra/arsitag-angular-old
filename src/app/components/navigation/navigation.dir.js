(() => {
    angular
        .module('angular.old')
        .directive('navigation', navigation)

    function navigation($window) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: templateUrlHandler,
            controller: navigationCtr,
            controllerAs: 'vm',
        }

        function templateUrlHandler() {
            const isMobile = $window.innerWidth <= 992;

            if (isMobile) {
                return 'directive/components/navigation/sidebar.tpl.html';
            } else {
                return 'directive/components/navigation/navigation.tpl.html';
            }
        }

        function navigationCtr($window) {
            const vm = this;

            const user2 = {
                name: 'user2',
            }

            const status = {
                isopen: false
            };

            vm.user2 = user2;
            vm.status = status;
        }
    }
})();
