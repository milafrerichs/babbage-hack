demo.directive('babbageCutFilter', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
      selected: '@',
      filter: '=',
      defaultCut: '='
    },
    template: '<div class="cut-filter"></div>',
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
      var findCutPosition = function(attrId) {
        var cutLength = scope.defaultCut.length;
        for(var i=0;i<cutLength;i++) {
          var cut = scope.defaultCut[i].split(':');
          var attr = attrId.split(':');
          if(cut[0] == attr[0]) { return i; }
        }
        return -1;
      }
      var setNewCut = function(attrId) {
        var pos = findCutPosition(attrId);
        if(pos !== -1) {
           scope.defaultCut[pos] = attrId;
        }
        return scope.defaultCut;
      }
      scope.update = function(attr) {
        var state = babbageCtrl.getState();
        state.cut = setNewCut(attr.id);
        state.tile = [getParentTile(state.tile[0])];
        scope.selected = attr.label;
        babbageCtrl.setState(state);
      }
    }
  }
}]);
