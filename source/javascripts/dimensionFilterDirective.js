demo.directive('dimensionFilter', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
      filter: '=',
      selected: '@',
      defaultCut: '='
    },
    template: '<div class="babbage-dimension-filter"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      scope.update = function(attr) {
        var state = babbageCtrl.getState();
        state.tile = [attr.id];
        state.cut = asArray(scope.defaultCut);
        scope.selected = attr.label;
        babbageCtrl.setState(state);
      };
    }
  };
}]);
