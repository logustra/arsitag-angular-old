(() => {
    function profileCtr($rootScope, $scope, profileFac) {
        const vm = this;

        $scope.callNow = ($event) => {
            const { target } = $event;
            const number = angular.element(target).attr('number');
            angular.element(target).text(number);
            angular.element(target).attr('href', `tel:${number}`);
        };

        profileFac.getProfile.then((response) => {
            vm.profile = response.data.data;
            vm.tabs = [
                {
                    id: 0,
                    title: 'About',
                    text: 'Sunt ipsum sit mollit non occaecat reprehenderit quis id. Do deserunt commodo magna est sunt elit aliqua labore. Eiusmod sunt eiusmod veniam sunt dolor commodo anim aliquip ex sunt. Aliqua ea Lorem magna commodo laboris nisi duis. Laboris occaecat officia consectetur consequat est dolor. Cupidatat anim sit et Lorem ut ut anim reprehenderit esse.',
                },
                {
                    id: 1,
                    title: 'Projects',
                    text: 'Occaecat ad eiusmod eiusmod culpa aliquip adipisicing magna exercitation non. Non velit Lorem in duis reprehenderit cillum. Nostrud do amet elit fugiat minim fugiat sit sunt occaecat veniam enim. Est magna eiusmod id sunt occaecat magna sunt deserunt pariatur aliquip excepteur.',
                },
                {
                    id: 2,
                    title: 'Reviews',
                    text: 'Tempor velit nulla id sint enim sit fugiat excepteur minim mollit esse eu ex dolore. Veniam exercitation cupidatat ex qui. Reprehenderit sit nostrud id nulla eiusmod proident. Esse amet exercitation qui nisi eiusmod voluptate non. Qui laborum velit sit anim consectetur. Cupidatat qui laborum ut ipsum elit eiusmod ut ad incididunt in adipisicing enim.',
                },
            ];
            vm.projects = {
                cards: [
                    {
                        img: 'images/p1.png',
                        title: 'Project Title 1',
                        photos_count: 3,
                    },
                    {
                        img: 'images/p2.png',
                        title: 'Project Title 2',
                        photos_count: 4,
                    },
                    {
                        img: 'images/p3.png',
                        title: 'Project Title 3',
                        photos_count: 5,
                    },
                    {
                        img: 'images/p4.png',
                        title: 'Project Title 4',
                        photos_count: 6,
                    },
                    {
                        img: 'images/p5.png',
                        title: 'Project Title 5',
                        photos_count: 7,
                    },
                    {
                        img: 'images/p6.png',
                        title: 'Project Title 6',
                        photos_count: 8,
                    },
                ],
                services: [
                    {
                        title: 'Profesional Categories in Selden',
                        body: 'Selden Driveway Instalation & Maintenance . Selden Fence Contractors . Selden Fireplaces . Selden Garage Door Sales.Selden Glass & Shower Door Dealers .Selden Handyman .Selden Hardwood Flooring Dealers . Selden Hot Tub & Spa Dealers.Selden Kitchen & Bath Fixtures.Selden Lighting',
                    },
                    {
                        title: 'Hardwood Flooring Dealers &amp; Installers near Selden',
                        body: 'Setauket-East Setauket Hardwood Flooring Dealers &amp; Installers . Kings Park Hardwood Flooring Dealers &amp; Installers . East Islip Hardwood Flooring Dealers & Installers .Stony Brook Hardwood Flooring Dealers & Installers . Saint James Hardwood Flooring Dealers & Installers .Ridge Hardwood Flooring Dealers & Installers .Nesconset Hardwood Flooring Dealers & Installers . Mastic Beach Hardwood Flooring Dealers & Installers .Terryville Hardwood Flooring Dealers & Installers . Patchogue Hardwood Flooring Dealers & Installers',
                    },
                ],
            };
            vm.reviews = [
                {
                    img: 'images/logo_tumblr_22.png',
                    name: 'Andra Martin',
                    rate: '2',
                    comment: 'Dolor laboris velit dolor in mollit ex sit nisi cupidatat nisi ullamco et amet consectetur.',
                },
                {
                    img: 'images/logo_tumblr_22.png',
                    name: 'John Doe',
                    rate: '3',
                    comment: 'Exercitation occaecat veniam ea exercitation laborum nisi ad do cupidatat cupidatat aliquip.',
                },
                {
                    img: 'images/logo_tumblr_22.png',
                    name: 'Andrew Matt',
                    rate: '4',
                    comment: 'Pariatur adipisicing anim irure adipisicing ea et commodo dolor eiusmod amet.',
                },
                {
                    img: 'images/logo_tumblr_22.png',
                    name: 'Matt Orto',
                    rate: '5',
                    comment: 'Exercitation anim laboris cupidatat anim ea mollit sit.',
                },
            ];
        }).catch((error) => {
            console.log(error);
        });
    }

    angular
        .module('angular.old')
        .controller('profileCtr', profileCtr);
})();
