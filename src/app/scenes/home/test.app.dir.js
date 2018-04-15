( () => {

    "use strict";

    angular
        .module('app')
        .directive('user', () => {
            return {
                restrict: 'E',
                templateUrl: 'directive/scenes/home/user.tpl.html',
                controller: userCtrl,
                controllerAs: 'vm',
                link: (scope, el, attr) => {
                    el.on('click', function (event) {
                        console.log(event.target);
                    })
                }
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
