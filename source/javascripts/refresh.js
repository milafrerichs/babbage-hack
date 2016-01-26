demo.directive('babbageRefresh', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^babbage',
    scope: {
    },
    template: '<div class="refresh"></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
      transclude(scope, function(clone, scope) {
        element.append(clone);
      });
      scope.update = function(attr) {
        babbageCtrl.update();
      };
    }
  };
}]);
