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

ngBabbageGlobals.numberFormat = d3.locale.de_DE.numberFormat("$,.")

treemapNameFunc = function(cell, ref, model) {
  return cell[model.dimensions[ref].key_ref] + " - " + cell[model.dimensions[ref].label_ref];
};
ngBabbageGlobals.treemapNameFunc = treemapNameFunc;
demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'Einnahmen';
	$scope.defaultCut = ['einnahmeausgabe.einnahmeausgabe:Einnahme'];
  $scope.state = {
    tile: ['hauptgruppe'],
    cut: $scope.defaultCut,
    hierarchies: {
      'einzelplanbezeichnung': {
        label: 'Einzelplan',
        levels: ['kapitel', 'zweckbestimmung']
      },
      'hauptgruppe': {
        label: 'Hauptgruppe',
        levels: [ 'obergruppe', 'gruppenbezeichnung']
      },
      'hauptfunktion': {
        label: 'Hauptfunktion',
        levels: ['oberfunktion', 'funktionbezeichnung']
      }
    }
  }
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'einnahmeausgabe.einnahmeausgabe:Einnahme'},{label: 'Ausgaben', id: 'einnahmeausgabe.einnahmeausgabe:Ausgabe'}]
  $scope.anzeige = [{id: 'hauptgruppe', label: 'nach Gruppe' }, {id: 'hauptfunktion', label: 'nach Funktion'}, {id: 'einzelplanbezeichnung', label: 'nach Einzelplan'}];

  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  }
});
