demo.directive('babbageRefresh', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
      hierarchies: '='
    },
    template: '<div class="refresh"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
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
            if(cutElements[0] == babbageCtrl.getDimensionKey(levels[j])) {
              include = false;
            }
          }
          if(include) {
            newCuts.push(cut);
          }
        }
        return newCuts;
      };
      var isCurrentLevel = function (tile, level) {
        return tile == level;
      };
      var findRootHierarchy = function(level) {
        for(var name in scope.hierarchies) {
          if(name === level) { return level; }
          var levels = scope.hierarchies[name].levels;
          var levelLength = levels.length;
          for(var i=0;i<levelLength;i++) {
            if(isCurrentLevel(level, levels[i])) {
              return name;
            }
          }
        }
      };
      scope.update = function(attr) {
        var state = babbageCtrl.getState();
        var tile = findRootHierarchy(state.tile[0]);
        state.tile = [tile];
        state.cut = cutsWithOutLevels([tile].concat(state.hierarchies[tile].levels));
        babbageCtrl.update();
      };
    }
  };
}]);
