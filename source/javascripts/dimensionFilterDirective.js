demo.directive('dimensionFilter', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
      dimension: '@',
      defaultCut: '='
    },
    template: '<div class="babbage-dimension-filter"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      scope.update = function() {
        var state = babbageCtrl.getState();
        state.tile = [scope.dimension];
        state.cut = asArray(scope.defaultCut);
        babbageCtrl.setState(state);
      }
    }
  }
}]);
