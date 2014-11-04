'use strict';

/**
 * @ngdoc overview
 * @name nflowVisApp
 * @description
 * # nflowVisApp
 *
 * Main module of the application.
 */
angular
  .module('nflowVisApp', [
    'nflowVisApp.services',
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        activeTab: 'main'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'WorkflowSearchCtrl',
        activeTab: 'search'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        activeTab: 'about'
      })
      .when('/workflow-definition/:type', {
        templateUrl: 'views/workflow_definition.html',
        controller: 'WorkflowDefinitionCtrl',
        activeTab: 'main'
      })
      .when('/workflow/:id', {
        templateUrl: 'views/workflow.html',
        controller: 'WorkflowCtrl',
        activeTab: 'search'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, $route){
    var path = function() {
      if($route && $route.current && $route.current.$$route) {
        return $route.current.$$route.activeTab;
      }
      return '';
    };
    $rootScope.$watch(path, function(newVal, oldVal){
      $rootScope.activeTab = newVal;
    });
    $rootScope.isActiveTab = function(tab) {
      return $rootScope.activeTab === tab;
    };
  })
  .filter('reverse', function() {
    return function(items) {
      if(!items) {
        return [];
      }
      return items.slice().reverse();
    };
  })
  .filter('fromNow', function() {
    return function(value) {
      if(!value) {
        return '';
      }
      try {
        return moment(value).fromNow();
      } catch(e){
        return value;
      }
    }
  });
