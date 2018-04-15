( () => {

    "use strict";

    angular
        .module('angular.old')
        .directive('user', function () {
            return {
                restrict: 'E',
                templateUrl: 'directive/scenes/home/user.tpl.html',
                controller: userCtrl,
                controllerAs: 'vm',
            }

            function userCtrl() {
                const vm = this;

                const user = {
                    name: 'faizal andyka putra',
                    nickname: 'faizal',
                    age: '19',
                    born: 'trenggalek',
                    leave: 'semarang',
                }

                vm.user = user;
            }
        })
})()
