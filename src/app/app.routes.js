(() => {
    function appRoutes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'directive/scenes/home/home.tpl.html',
            })
            .state('inspirasi', {
                url: '/inspirasi',
                templateUrl: 'directive/scenes/inspirasi/inspirasi.tpl.html',
            })
            .state('artikel', {
                url: '/artikel',
                templateUrl: 'directive/scenes/artikel/artikel.tpl.html',
            })
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
