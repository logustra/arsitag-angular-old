(() => {
    function appSerives($rootScope, $http, BASE_URL) {
        $rootScope.makeRequest = (method, url) => {
            const requestUrl = `${BASE_URL}/${url}`;

            return $http({
                url: requestUrl,
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        };
    }

    angular
        .module('app.services', [])
        .constant('BASE_URL', 'http://iotator.com/api/v1')
        .run(appSerives);
})();
