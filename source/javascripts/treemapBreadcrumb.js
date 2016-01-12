demo.directive('treemapBreadcrumb', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    replace: true,
    require: '^babbage',
    scope: { },
    template: '<ol class="breadcrumb"><li ng-repeat="level in levels" ng-class="{ active: isActive(level) }"><a href="" ng-click="setTile(level);">{{valueForLevel(level)}}</a></li></ol>',
    link: function(scope, element, attrs, babbageCtrl) {
      var dimensions;
      babbageCtrl.subscribe(function(event, model, state) {
        dimensions = model.dimensions;
        scope.levels = getLevels(state.hierarchies);
      });
      var removeLevels = function(level) {
        var levelLength = scope.levels.length;
        for(var i=0;i<levelLength;i++) {
          if(scope.levels[i] == level) {
            return scope.levels.slice(i);
          };
        }
      }
      var cutsWithOutLevels = function(levels) {
        var state = babbageCtrl.getState();
        var cutLength = state.cut.length;
        var levelLength = levels.length;
        var newCuts = [];
        for(var i=0;i<cutLength;i++) {
          var cut = state.cut[i];
          var cutElements = cut.split(":");
          var include = true;
          for(var j=0;j<levelLength;j++) {
            if(cutElements[0] == levels[j]) {
              include = false;
            }
          }
          if(include) {
            newCuts.push(cut);
          }
        }
        return newCuts;
      }
      scope.valueForLevel = function(level) {
        for(var name in dimensions) {
          if(dimensions[name].label_ref == level) {
            return dimensions[name].label;
          }
        }
      }
      scope.isActive = function(level) {
        var state = babbageCtrl.getState();
        return level == state.tile[0];
      }
      scope.setTile = function(name) {
        var state = babbageCtrl.getState();
        state.cut = cutsWithOutLevels(removeLevels(name));
        state.tile = [name];
        babbageCtrl.setState(state);
      }
      var getLevels = function(hierarchies) {
        var state = babbageCtrl.getState();
        for(var name in hierarchies) {
          var hierarchy = hierarchies[name];
          var levels = hierarchy.levels;
          var levelLength = levels.length;
          var prevs = [name];
          for(var i=0;i<levelLength;i++) {
            prevs.push(levels[i]);
            if(state.tile[0] == levels[i]) {
              return prevs;
            }
          }
        }
        return [state.tile[0]];
      };
      var state = babbageCtrl.getState();
      scope.levels = getLevels(state.hierarchies);
    }
  }
}]);
