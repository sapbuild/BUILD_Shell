'use strict';

/**
 * controller for the help popup displaying the videos
 *
 * @param  {[type]} $rootScope [description]
 * @param  {[type]} $scope     [description]
 * @param  {[type]} $location  [description]
 * @param  {[type]} $state     [description]
 * @param  {[type]} $window    [description]
 * @param  {[type]} Auth       [description]
 * @param  {[type]} $http      [description]
 * @param  {[type]} $sce       [description]
 * @param  {[type]} uiError    [description]
 * @return {[type]}            [description]
 */
// @ngInject
module.exports = function ($rootScope, $scope, $location, $state, $window, Auth, $http, $sce, uiError, featureToggle) {

    var vm = this;

    vm.showHelpMenu = true;
    vm.hideFTUOverlay = true;
    vm.disableHelp = false;

    vm.aVideoSliderItems = [{
        title: 'Getting Started',
        src: 'https://youtube.com/embed/PQaZqxVtln4'
    }, {
        title: 'Create User Research Studies',
        src: 'https://youtube.com/embed/Z8BMghLixvE'
    }, {
        title: 'Create Prototypes',
        src: 'https://youtube.com/embed/Hka3_sWwHwI'
    }, {
        title: 'Data Modelling',
        src: 'https://youtube.com/embed/vZHxsHzefz0'
    }];

    featureToggle.isEnabled('internal-customer').then(function (internal) {
        if (internal) {
            vm.aVideoSliderItems.push({
                title: 'Smart Templates',
                src: 'https://www.youtube.com/embed/RPrYT4zXa3U'
            });
        }
    });

    vm.closeHelpOverlay = close;
    vm.sliderVideoSelected = setVideo;

    init();


    /**
     * @name init
     * Initialize the flash help popup
     */
    function init() {
        if (vm.aVideoSliderItems.length > 0) {
            vm.overlayActiveVideo = $sce.trustAsResourceUrl(vm.aVideoSliderItems[0].src + '?controls=2');
            vm.overlayActiveTitle = vm.aVideoSliderItems[0].title;
        }

        if ($state.current.name === 'shell') {
            vm.isLandingPage = true;
        }

        getPreferences();
    }

    /**
     * @name getPreferences
     * @desc Get the user preferences for the current user
     */
    function getPreferences() {
        Auth.getPreferences().then(function (data) {
            vm.userPrefrences = data.preferences;
            if (vm.userPrefrences && vm.userPrefrences.help) {
                vm.hideFTUOverlay = vm.userPrefrences.help.disable;
            }
        }).catch(function error(res) {
            uiError.create({
                content: res.data.error,
                dismissOnTimeout: false
            });
        });
    }

    /**
     * @name setVideo
     * Set the current acive video
     * @param {object} video A video object
     */
    function setVideo(video) {
        vm.overlayActiveVideo = $sce.trustAsResourceUrl(video.src + '?autoplay=1&controls=2');
        vm.overlayActiveTitle = video.title;
    }

    /**
     * @name close
     * Close the popup
     */
    function close() {
        vm.hideFTUOverlay = true;
        vm.showHelpMenu = false;

        angular.element(document.querySelector('.help-content')).css('display', 'none');

        $rootScope.$broadcast('show-help-menu', false);

        $rootScope.$broadcast('popup-open', {
            id: 'na-help-popover'
        });

        if (vm.disableHelp) {
            vm.userPrefrences.help.disable = true;
            Auth.updatePreferences(vm.userPrefrences);
        }
    }

};
