import * as angular from 'angular';

(() => {
    angular
        .module('angular.old')
        .controller('angular.old.ctr', ($scope) => {
            $scope.message = 'bismillah';
        });
})();
