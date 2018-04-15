(() => {
    angular
        .module('angular.old')
        .directive('navigation', function() {
            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'directive/components/navigation/navigation.tpl.html',
                controller: navigationCtr,
                controllerAs: 'vm',
            }

            function navigationCtr() {
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
        })
})();
