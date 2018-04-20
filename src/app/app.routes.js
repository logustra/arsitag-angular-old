angular
    .module('app.routes', ['ui.router'])
    .config(($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.when('', '/profesional');
        $stateProvider
            .state('profesional', {
                url: '/profesional',
                templateUrl: 'directive/scenes/profile/profile.tpl.html',
                controller: 'profile.ctr as vm',
            });
    });
