var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

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

treemapNameFunc = function(cell, ref, model) {
  return cell[model.dimensions[ref].key_ref] + " - " + cell[model.dimensions[ref].label_ref];
};
ngBabbageGlobals.treemapNameFunc = treemapNameFunc;
demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'Einnahmen';
	$scope.defaultCut = ['einnahmeausgabe.einnahmeausgabe:Ausgabe'];
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
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'einnahmeausgabe.einnahmeausgabe:Einnahme'},{label: 'Ausgaben', id: 'einnahmeausgabe.einnahmeausgabe:Ausgabe'}];
  $scope.anzeige = [{id: 'einzelplan', label: 'Einzelplan'}, {id: 'hauptfunktion', label: 'Politikfelder'},  {id: 'hauptgruppe', label: 'Gruppe' }];

  $scope.showTooltip = true;
  $scope.tooltipContent = function(d) {
    return "<b>" + d._name + ":</b> <br/>" + d._area_fmt + " ( " + d3.format("%")(d._percentage) + " )";
  };

  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  };
});
