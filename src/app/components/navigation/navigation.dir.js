(() => {
    angular
        .module('angular.old')
        .directive('testB', function() {
            return {
                restrict: 'E',
                scope: {},
                templateUrl: 'directive/components/navigation/navigation.tpl.html',
                controller: testBCtr,
                controllerAs: 'vm',
            }

            function testBCtr() {
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
