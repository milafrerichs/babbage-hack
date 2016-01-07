demo.directive('filter', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    require: '^babbage',
    scope: {
      state: '='
    },
    link: function(scope, element, attrs, babbageCtrl) {
      babbageCtrl.setState(scope.state);

      scope.$watch('state', function(oldValue, newValue) {
        if(oldValue !== newValue) {
          babbageCtrl.update();
        };
      }, true);
    }
  }
}]);
