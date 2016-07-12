'use strict';
var myApp = angular.module('mockbank', ['ui.router', 'lbServices', 'ngResource', 'textAngular']);
var api_url = "api_url";
myApp.config(['$httpProvider', '$locationProvider', '$urlRouterProvider','$stateProvider','LoopBackResourceProvider',function($httpProvider, $locationProvider, $urlRouterProvider,$stateProvider, LoopBackResourceProvider){

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $urlRouterProvider.otherwise('/');
  LoopBackResourceProvider.setAuthHeader('X-Access-Token');
  LoopBackResourceProvider.setUrlBase('api_url');

  // $locationProvider.html5Mode(
  //   {
  //       enabled: true,
  //       requireBase: true
  //   });

  // $locationProvider.hashPrefix('!');

  $stateProvider
  		.state('layout',{
        	url: '',
        	abstract: true,
        	views: {
          	'header': {
            		templateUrl: 'layout/header.html',
            		},
        	},
      })

  		.state('layout.home', {
  			url: '/',
        views: {
            'header': {
                templateUrl: 'layout/header.html',
                },
            'body@': {
                templateUrl: 'views/home.html',
                controller: function($scope){
                  console.log("Welcome to Admin Panel :)");
                },
              },
          },
  		})

      .state('layout.upload', {
        url: '/upload',
        views: {
            'body@': {
                templateUrl: 'views/upload/uploadFile.html',
                controller: 'UploadController',
              },
          },
      })

      .state('layout.notify', {
        url: '/notify',
        views: {
            'body@': {
                templateUrl: 'views/notify/notification.html',
                controller: 'NotificationController',
              },
          },
      })

      .state('layout.htmlEdit', {
        url: '/html',
        views: {
            'body@': {
                templateUrl: 'views/jobs/htmlEdit.html',
                controller: 'HtmlController',
              },
          },
      })

      .state('layout.addJob', {
        url: '/addJob',
        views: {
            'body@': {
                templateUrl: 'views/jobs/addJob.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.addOrg', {
        url: '/addOrg',
        views: {
            'body@': {
                templateUrl: 'views/orgs/addOrg.html',
                controller: 'OrgController',
              },
          },
      })

      .state('layout.addLoc', {
        url: '/addLoc',
        views: {
            'body@': {
                templateUrl: 'views/locs/addLoc.html',
                controller: 'LocController',
              },
          },
      })

      .state('layout.editDetails', {
        url: '/details',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editDetails.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editEli', {
        url: '/eligibility',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editEligibility.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editTag', {
        url: '/tag',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editTags.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editRef', {
        url: '/reference',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editReferences.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editCon', {
        url: '/othercontent',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editContents.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listDetails', {
        url: '/listDetails',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listDetails.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listLifecycle', {
        url: '/listLifecycle',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listLifecycle.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listLang', {
        url: '/listLanguageTest',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listLanguageTest.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listEli', {
        url: '/listEligibility',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listEligibility.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listTag', {
        url: '/listTags',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listTags.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listRef', {
        url: '/listReferences',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listReferences.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.listContent', {
        url: '/listOtherContents',
        views: {
            'body@': {
                templateUrl: 'views/jobs/listContents.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editLifecycles', {
        url: '/lifecycle',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editLifecycle.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editLang', {
        url: '/languageTest',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editLangTest.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.editFilter', {
        url: '/filter',
        views: {
            'body@': {
                templateUrl: 'views/jobs/editFilter.html',
                controller: 'JobsController',
              },
          },
      })

      .state('layout.jobs', {
        url: '/jobs',
        views: {
            'body@': {
                templateUrl: 'views/jobs/jobs.html',
                controller: 'JobsController'
              },
          },
      })

      .state('layout.locs', {
        url: '/locations',
        views: {
            'body@': {
                templateUrl: 'views/locs/locs.html',
                controller: 'LocController'
              },
          },
      })

      .state('layout.orgs', {
        url: '/organization',
        views: {
            'body@': {
                templateUrl: 'views/orgs/orgs.html',
                controller: 'OrgController'
              },
          },
      });
}]);
