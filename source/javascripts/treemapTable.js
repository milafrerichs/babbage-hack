demo.directive('treemapTable', ['$rootScope', '$http', function($rootScope, $http) {
  return {
    restrict: 'EA',
    replace: true,
    require: '^babbage',
    scope: { },
    template: '<table class="treemap-table table table-condensed"> <tr> <th>Titel</th> <th class="num">Betrag</th> <th class="num">Anteil</th> </tr> <tr ng-repeat="row in rows"> <td> <i style="color: {{row.color}};" class="fa fa-square"></i> {{row.name}} </td> <td class="num">{{row.value_fmt}}</td> <td class="num">{{row.percentage}}</td> </tr> <tr> <th> Total </th> <th class="num">{{summary.value_fmt}}</th> <th class="num">100%</th> </tr>',
    link: function(scope, element, attrs, babbageCtrl) {
      scope.rows = [];
			scope.summary = {};

      scope.queryLoaded = false;

      var query = function(model, state) {
        var tile = asArray(state.tile)[0],
            area = asArray(state.area)[0],
            area = area ? [area] : defaultArea(model);

        var q = babbageCtrl.getQuery();
        q.aggregates = area;
        q.drilldown = [tile];

        var order = [];
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
        q.pagesize = 50;

        scope.cutoffWarning = false;
        scope.queryLoaded = true;
        var dfd = $http.get(babbageCtrl.getApiUrl('aggregate'),
                            babbageCtrl.queryParams(q));
        dfd.then(function(res) {
          queryResult(res.data, q, model, state);
        });
      }
      var queryResult = function(data, q, model, state) {
        var tileRef = asArray(state.tile)[0],
            areaRef = asArray(state.area)[0],
            areaRef = areaRef ? [areaRef] : defaultArea(model);

        scope.rows = [];
        for (var i in data.cells) {
          var cell = data.cells[i];
          cell.value_fmt = ngBabbageGlobals.numberFormat(Math.round(cell[areaRef]));
          cell.name = cell[tileRef];
          cell.color = ngBabbageGlobals.colorScale(i);
					cell.percentage = parseFloat(cell[areaRef] / Math.max(data.summary[areaRef], 1)*100).toFixed(2);
          scope.rows.push(cell);
        };
				scope.summary = { value_fmt: ngBabbageGlobals.numberFormat(Math.round(data.summary[areaRef]))};
      }
      var unsubscribe = babbageCtrl.subscribe(function(event, model, state) {
        query(model, state);
      });
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
  }
}]);
