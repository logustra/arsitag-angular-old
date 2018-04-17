import * as angular from 'angular';

(() => {
    function profile() {
        function userCtrl() {
            const vm = this;

            const user = {
                name: 'faizal andyka putra',
                nickname: 'faizal',
                age: '19',
                born: 'trenggalek',
                leave: 'semarang',
            };

            vm.user = user;
        }

        return {
            restrict: 'E',
            templateUrl: 'directive/scenes/profile/profile.tpl.html',
            controller: userCtrl,
            controllerAs: 'vm',
        };
    }

    angular
        .module('angular.old')
        .directive('profile', profile);
})();
