demo.directive('treemapBreadcrump', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    require: '^babbage',
    scope: {
      state: '=',
      reset: '='
    },
    template: '<div><ul><li ng-repeat="level in levels" ng-class="{ active: isActive(level) }"><a href="" ng-click="setTile(level);">{{valueForLevel(level)}}</a></li></ul></div>',
    link: function(scope, element, attrs, babbageCtrl) {
      var dimensions;
      babbageCtrl.subscribe(function(event, model, state) {
        dimensions = model.dimensions;
        scope.levels = getLevels(scope.state.hierarchies);
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
        var cutLength = scope.state.cut.length;
        var levelLength = levels.length;
        var newCuts = [];
        for(var i=0;i<cutLength;i++) {
          var cut = scope.state.cut[i];
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
          if(dimensions[name].key_ref == level) {
            return dimensions[name].label;
          }
        }
      }
      scope.isActive = function(level) {
        return level == scope.state.tile[0];
      }
      scope.setTile = function(name) {
        scope.state.cut = cutsWithOutLevels(removeLevels(name));
        scope.state.tile = [name];
      }
      var getLevels = function(hierarchies) {
        for(var name in hierarchies) {
          var hierarchy = hierarchies[name];
          var levels = hierarchy.levels;
          var levelLength = levels.length;
          var prevs = [name];
          for(var i=0;i<levelLength;i++) {
            prevs.push(levels[i]);
            if(scope.state.tile[0] == levels[i]) {
              return prevs;
            }
          }
        }
        return [scope.state.tile[0]];
      };
      var resetTiles = function() {
        scope.tiles = [];
      }

      scope.levels = getLevels(scope.state.hierarchies);
      scope.$watch('reset', function(reset) {
        if(reset) { resetTiles();scope.reset = false; }
      });
    }
  }
}]);
