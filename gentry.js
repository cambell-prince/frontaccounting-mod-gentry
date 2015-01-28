'use strict';

angular.module('sgw.gentry',
    [
          'ui.router',
          'gentry.services',
          'gentry.entry'
    ])
  .run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
      // Add $state and $stateParams to the $rootScope so that we can access them from any scope.
      // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
      // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/entry');

    $stateProvider
      .state('entry', {
        url: '/entry',
        templateUrl: '/modules/sgw_gentry/views/entry.html',
        controller: 'EntryCtrl'
      })
      .state('post', {
        url: '/post',
        templateUrl: '/modules/sgw_gentry/views/post.html'
      })
      ;
  }])
  .controller('MainCtrl', ['$scope', function($scope) {

    $scope.onTest = function() {
      console.log('test');
    };

  }])
  ;
