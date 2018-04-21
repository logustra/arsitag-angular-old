(() => {
    function appRoutes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/profesional');
        $stateProvider
            .state('profesional', {
                url: '/profesional',
                templateUrl: 'directive/scenes/profile/profile.tpl.html',
                controller: 'profileCtr as vm',
            });
    }

    angular
        .module('app.routes', ['ui.router'])
        .config(appRoutes);
})();
