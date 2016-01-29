var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select', 'budget.templates']);

d3.locale.de_DE = d3.locale({
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", " €"],
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"], // unused
  days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});

ngBabbageGlobals.numberFormat = d3.locale.de_DE.numberFormat("$,.");

truncate = function(name, maxlen, repl) {
  maxlen = maxlen || 30;
  repl = repl || '...';
  if (name.length > maxlen) {
    return name.substring(0, maxlen - repl.length) + repl;
  }
  return name;
};
treemapNameFunc = function(cell, ref, model) {
  return  truncate(cell[model.dimensions[ref].label_ref] + ' ('+cell[model.dimensions[ref].key_ref]+')');
};
ngBabbageGlobals.treemapNameFunc = treemapNameFunc;

ngBabbageGlobals.treemapHtmlFunc = function(d) {
  if (d._percentage < 0.02) {
    return '';
  }
  return d.children ? null : truncate(d._name + ' (' + d._key + ')') + '<span class="amount">' + d._area_fmt + '</span>';
};

var percentFormat = function(d) {
  return d3.locale.de_DE.numberFormat(".1f")(d*100)+" %";
};
demo.controller('DemoCtrl', function ($scope) {
	$scope.defaultCut = ['titelart:Ausgabetitel', 'jahr:2016', 'typ.bezeichnung'];
  $scope.state = {
    tile: ['einzelplan'],
    cut: $scope.defaultCut,
    hierarchies: {
      'einzelplan': {
        label: 'Einzelplan',
        levels: ['kapitel', 'titel']
      },
      'hauptgruppe': {
        label: 'Hauptgruppe',
        levels: [ 'obergruppe', 'gruppe']
      },
      'hauptfunktion': {
        label: 'Hauptfunktion',
        levels: ['oberfunktion', 'funktion']
      }
    }
  };
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'titelart:Einnahmetitel'},{label: 'Ausgaben', id: 'titelart:Ausgabetitel'}];
  $scope.jahr = [{label: '2016', id: 'jahr:2016'},{label: '2017', id: 'jahr:2017'}];
  $scope.typ = [{label: 'Alle', id: 'typ.bezeichnung'},{label: 'Bezirke', id: 'typ.bezeichnung:Bezirke'},{label: 'Senatsverwaltungen', id: 'typ.bezeichnung:Senatsverwaltungen'}, {label: 'Verfassungsorgane', id: 'typ.bezeichnung:Verfassungsorgane'}];
  $scope.anzeige = [{id: 'hauptgruppe', label: 'Gruppe' }, {id: 'hauptfunktion', label: 'Funktion'}, {id: 'einzelplan', label: 'Einzelplan'}];

  $scope.showTooltip = true;
  $scope.showTableKey = true;
  $scope.tooltipContent = function(d) {
    return "<b>" + d._name + ":</b> <br/>" + d._area_fmt + " (" + percentFormat(d._percentage) + ")";
  };

  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  };
});
