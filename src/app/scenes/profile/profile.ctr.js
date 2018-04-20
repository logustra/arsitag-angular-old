(() => {
    angular
        .module('angular.old')
        .controller('profile.ctr', ($scope) => {
            $scope.callNow = function ($event) {
                const target = $event.target;
                const number = angular.element(target).attr('number');
                angular.element(target).text(number);
                angular.element(target).attr('href', `tel:${number}`);
            };
        });
})();
