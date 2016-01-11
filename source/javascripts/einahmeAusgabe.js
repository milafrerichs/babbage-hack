demo.directive('einahmeAusgabe', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
      selected: '@',
      filter: '=',
      change: '&'
    },
    template: '<div class="einnahme-ausgabe"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      var getParentTile = function(tile) {
        var state = babbageCtrl.getState();
        for(var name in state.hierarchies) {
          if(name == tile) {
            return name;
          }
          var h = state.hierarchies[name];
          for(var i in h.levels) {
            if(h.levels[i] == tile) {
              return name;
            }
          }
        }
      }
      scope.update = function(attr) {
        var state = babbageCtrl.getState();
        state.cut = asArray(attr.id);
        state.tile = [getParentTile(state.tile[0])];
        scope.selected = attr.label;
        scope.change({attr: attr});
        babbageCtrl.setState(state);
      }
    }
  }
}]);
