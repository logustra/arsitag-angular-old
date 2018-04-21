(() => {
    angular
        .module('app.services')
        .factory('profileFac', ($rootScope) => {
            function getProfile() {
                return $rootScope.makeRequest('GET', 'profile/1');
            }

            return {
                getProfile: getProfile(),
            };
        });
})();
