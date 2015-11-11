'use strict';
/**
 * @ngdoc controller
 * @param $scope
 * @param $location
 * @param Auth
 * @param NavBarService
 */
// @ngInject
module.exports = function ($rootScope, $scope, $location, $state, $window, Auth, NavBarService, $http, featureToggle) {

    // Hero Style
    $scope.navbarService = NavBarService;
    $scope.logoState = NavBarService.logoState === undefined ? 'shell' : NavBarService.logoState;
    $scope.logoStateParams = NavBarService.logoStateParams;
    $scope.helpClass = 'na-link-disable';

    $scope.showHelpMenu = true;

    if ($state.current.name === 'shell') {
        $scope.isLandingPage = true;
    }

    // Fot the avatar popover
    $scope.status = [{
        name: 'Online'
    }, {
        name: 'Offline'
    }];

    $scope.statusSelectedItem = $scope.status[0];

    var currentUser = Auth.getCurrentUser();
    if (currentUser.$promise) {
        currentUser.$promise.then(function (user) {
            $scope.currentUser = user;
            $scope.isLoggedIn = Auth.isLoggedIn();
        });
    }
    else {
        $scope.currentUser = null;
        $scope.isLoggedIn = false;
    }
    $scope.logout = function () {
        Auth.logout();
        $rootScope.currentProject = null;
        $location.path('/login');
    };

    Auth.getSecurityConfig()
        .then(function (d) {
            var settings = d.settings;
            var isProviderLocal = settings && settings.provider && settings.provider.local === true;
            $scope.showLogout = function () {
                return isProviderLocal;
            };
            $rootScope.isAdminConsole = settings && settings.application && settings.application.admin === true;
            $rootScope.hideAvatarPopover = $rootScope.isAdminConsole && !isProviderLocal;

            if ($rootScope.isAdminConsole) {
                $scope.helpUrl = 'http://www.build.me/BUILD-Help-Site/AdminConsoleHelp.html';
                $scope.helpClass = 'na-avatar-link';
                return null;
            }
            else {
                return featureToggle.isEnabled('internal-customer');
            }
        }).then(function (internal) {
            if (!$rootScope.isAdminConsole) {
                $scope.helpUrl = 'http://www.build.me/BUILD-Help-Site/';
                if (internal) {
                    $scope.helpUrl = 'http://www.build.me/BUILD-Help-Site/';
                }
                $scope.helpClass = 'na-avatar-link';
            }
        });

    $scope.isActive = function (route) {
        return route === $location.path();
    };

    $scope.navigateToLanding = function () {
        $rootScope.currentProject = null;
        NavBarService.updateHeading();
        $rootScope.$broadcast('shell.aside.updated');
        $state.go($scope.logoState, $scope.logoStateParams);
    };

    $scope.$on('show-help-menu', function (event, state) {
        $scope.showHelpMenu = state;
    });

    /**
     * Open a new tab for the help
     */
    $scope.goHelp = function ($event) {
        if ($scope.helpClass === 'na-link-disable') {
            $event.preventDefault();
            return;
        }
        $window.open($scope.helpUrl, '_blank');
    };

    var privacyStmtPath = '/legal/terms/privacy_statement_EN.txt';
    $rootScope.showPrivacyStmt = false;
    $http.get(privacyStmtPath)
        .then(function (success) {
            $rootScope.showPrivacyStmt = true;
            $scope.privacystatement = success.data;
        });

};
