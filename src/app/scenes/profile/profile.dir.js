(() => {
    function profile() {
        return {
            restrict: 'A',
            templateUrl: 'directive/scenes/profile/profile.tpl.html',
        };
    }

    angular
        .module('angular.old')
        .directive('profile', profile);
})();
