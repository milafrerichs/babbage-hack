demo.directive('dimensionFilterDropdown', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    require: '^babbage',
    scope: {
      filter: '=',
      selected: '@',
      defaultCut: '='
    },
    template: '<div class="babbage-dimension-filter"> <div class="dropdown"> <div class="btn-group" dropdown ng-show="filter.length"> <a class="btn btn-default dropdown-toggle ng-click" dropdown-toggle>{{selected}} <span class="caret"></span></a> <ul class="dropdown-menu"> <li ng-repeat="attr in filter"> <a ng-click="update(attr)"> <strong>{{attr.label}}</strong> </a> </li> </ul> </div> </div></div>',
    link: function(scope, element, attrs, babbageCtrl, transclude) {
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
