(() => {
    angular
        .module('angular.old')
        .directive('layout', layout)

    function layout() {
        return {
            restrict: 'E',
            scope: {},
            transclude: {
                navigation: '?navigation',
            },
            replace: true,
            template: 'directive/components/layout/layout.tpl.html',
            controller: layoutCtr,
            controllerAs: 'vm',
        }

        function layoutCtr($scope) {
            const vm = this;
            vm.message = "bimillah";
        }
    }
})()
