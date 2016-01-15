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
    template: '<div class="babbage-dimension-filter" ng-class="{active: active}"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      var isActive = function() {
        var state = babbageCtrl.getState();
        if(state.hierarchies) {
            hierarchy = state.hierarchies[state.tile[0]];
          if(hierarchy) {
            scope.active = (state.tile[0] == scope.dimension)
            return;
          }else {
            for(var name in state.hierarchies) {
               var hierarchy = state.hierarchies[name];
               if(hierarchy && hierarchy.levels) {
                 var levelLength = hierarchy.levels.length;
                  for(var i=0;i<levelLength;i++) {
                    if(state.tile[0] == hierarchy.levels[i]) {
                      scope.active = (name == scope.dimension)
                      return;
                    }
                  }
               }
            }
          }
        } else {
          scope.active = (state.tile[0] == scope.dimension)
        }
      }
      isActive();
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      babbageCtrl.subscribe(function(event, model, state) {
        isActive();
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
