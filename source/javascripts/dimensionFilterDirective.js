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
    templateUrl: function(tElement, tAttrs) {
      if(tAttrs.type) {
        if(tAttrs.type === 'dropdown') {
          return 'budget-templates/dimension-filter-dropdown.html';
        }
      } else {
        return 'budget-templates/dimension-filter.html';
      }
    },
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      scope.update = function(attr) {
        var state = babbageCtrl.getState();
        state.tile = [attr.id];
        state.cut = asArray(scope.defaultCut);
        state.tableOrder = [];
        scope.selected = attr.label;
        babbageCtrl.setState(state);
      };
    }
  };
}]);
