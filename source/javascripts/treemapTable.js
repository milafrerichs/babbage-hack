demo.directive('treemapTable', ['$rootScope', '$http', function($rootScope, $http) {
  return {
    restrict: 'EA',
    replace: true,
    require: '^babbage',
    scope: { showKey: '=?' },
    template: '<table class="treemap-table table table-condensed" ng-class="{last: lastLevel}"><thead> <tr> <th class="key" ng-show="showKey" colspan="2" ng-click="sort(\'key\');" ng-class="{ sort: activeOrder(\'key\') }"><div class="th-inner">{{keyTitle}} <div class="sort-container"><span class="caret"></span></div></div></th> <th colspan="{{titleColspan}}" ng-click="sort(\'name\')" ng-class="{ sort: activeOrder(\'name\'), asc: activeDirection(\'asc\'), desc: activeDirection(\'desc\')}"><div class="th-inner">{{nameTitle}}<div class="sort-container"><span class="caret"></span></div></div></th> <th class="num betrag" ng-click="sort(\'value\')" ng-class="{ sort: activeOrder(\'value\'), asc: activeDirection(\'asc\'), desc: activeDirection(\'desc\')}"><div class="th-inner">Betrag<div class="sort-container"><span class="caret"></span></div></div></th> <th class="num" ng-click="sort(\'value\')" ng-class="{ sort: activeOrder(\'value\'), asc: activeDirection(\'asc\'), desc: activeDirection(\'desc\')}"><div class="th-inner">Anteil<div class="sort-container"><span class="caret"></span></div></div></th> </tr></thead><tbody> <tr ng-repeat="row in rows"> <td class="color"> <i ng-style="{color: row.color};" class="fa fa-square"></i></td><td class="key" ng-show="showKey"> {{row.key}} </td><td><a href ng-click="setTile(row);"> {{row.name}} </a></td> <td class="num">{{row.value_fmt}}</td> <td class="num">{{row.percentage}}</td> </tr> </tbody><tfoot><tr> <th colspan="2"> Summe </th> <th ng-show="showKey"></th><th class="num">{{summary.value_fmt}}</th> <th class="num">100%</th> </tr></tfoot></table>',
    link: function(scope, element, attrs, babbageCtrl) {
      var orderKeys = {};
      scope.showKey = angular.isDefined(scope.showKey) ? scope.showKey: false;
      scope.titleColspan = scope.showKey ? 1 : 2;
      scope.order = [];
      currentOrder = 'value';
      scope.direction = ['desc', 'asc'];
      scope.rows = [];
			scope.summary = {};

      scope.activeOrder = function(order) {
        return currentOrder == order;
      };
      scope.activeDirection = function(direction) {
        return scope.direction[0] == direction;
      };

      scope.queryLoaded = false;

      scope.setTile = function(row) {
        var currentState = babbageCtrl.getState(),
          newLevel = babbageCtrl.getNextHierarchyLevel(),
            currentKey = babbageCtrl.getDimensionKey(currentState.tile[0]);
          cut = currentKey + ':' + row[currentKey];
        if(newLevel) {
          currentState.tile = [ newLevel];
          currentState.cut = currentState.cut.concat([cut]);
          babbageCtrl.setState(currentState);
        }
      };

      var query = function(model, state) {
        var tile = asArray(state.tile)[0],
            area = asArray(state.area)[0];
        area = area ? [area] : defaultArea(model);

        var q = babbageCtrl.getQuery();
        q.aggregates = area;
        q.drilldown = [tile];

        var order = scope.order;
        for (var i in q.order) {
          var o = q.order[i];
          if ([tile, area].indexOf(o.ref) != -1) {
            order.push(o);
          }
        }
        if (!order.length) {
          order = [{ref: area, direction: 'desc'}];
        }

        q.order = order;
        q.page = 0;
        q.pagesize = 500;

        scope.cutoffWarning = false;
        scope.queryLoaded = true;
        orderKeys.name = model.dimensions[tile].label_ref;
        orderKeys.key = model.dimensions[tile].key_ref;
        orderKeys.value = area[0];
        var dfd = $http.get(babbageCtrl.getApiUrl('aggregate'),
                            babbageCtrl.queryParams(q));
        dfd.then(function(res) {
          queryResult(res.data, q, model, state);
        });
      };
      var queryResult = function(data, q, model, state) {
        var tileRef = asArray(state.tile)[0],
            areaRef = asArray(state.area)[0];
        areaRef = areaRef ? [areaRef] : defaultArea(model);

        scope.rows = [];
        scope.nameTitle = scope.showKey ? model.dimensions[tileRef].label_attribute : model.dimensions[tileRef].label;
        scope.keyTitle = model.dimensions[tileRef].label;
        for (var i in data.cells) {
          var cell = data.cells[i];
          cell.value_fmt = ngBabbageGlobals.numberFormat(Math.round(cell[areaRef]));
          cell.name = cell[model.dimensions[tileRef].label_ref];
          cell.key = ngBabbageGlobals.keyFormat(cell[model.dimensions[tileRef].key_ref], model.dimensions[tileRef].key_ref);
          cell.color = ngBabbageGlobals.colorScale(i);
					cell.percentage = percentFormat(cell[areaRef] / Math.max(data.summary[areaRef], 1));
          scope.rows.push(cell);
        }
				scope.summary = { value_fmt: ngBabbageGlobals.numberFormat(Math.round(data.summary[areaRef]))};
      };
      var unsubscribe = babbageCtrl.subscribe(function(event, model, state) {
        query(model, state);
        scope.lastLevel = babbageCtrl.getNextHierarchyLevel() ? false : true;
      });
    scope.sort = function(order) {
      scope.direction = scope.direction.reverse();
      currentOrder = order;
      scope.order = [{ref: orderKeys[order], direction:  scope.direction[0]}];
      babbageCtrl.update();
    };
    scope.$on('$destroy', unsubscribe);
      var defaultArea = function(model) {
        for (var i in model.aggregates) {
          var agg = model.aggregates[i];
          if (agg.measure) {
            return [agg.ref];
          }
        }
        return [];
      };
    }
  };
}]);
