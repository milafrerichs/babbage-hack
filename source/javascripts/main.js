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
demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'Einnahmen';
	$scope.defaultCut = ['einnahmeausgabe.einnahmeausgabe:Einnahme'];
  $scope.state = {
    tile: ['hauptgruppe.hauptgruppenbezeichnung'],
    cut: $scope.defaultCut,
    hierarchies: {
      'einzelplanbezeichnung.einzelplanbezeichnung': {
        label: 'Einzelplan',
        levels: ['kapitel.kapitelbezeichnung', 'zweckbestimmung.zweckbestimmung']
      },
      'hauptgruppe.hauptgruppenbezeichnung': {
        label: 'Hauptgruppe',
        levels: [ 'obergruppe.obergruppenbezeichnung', 'gruppenbezeichnung.gruppenbezeichnung']
      },
      'hauptfunktion.hauptfunktionbezeichnung': {
        label: 'Hauptfunktion',
        levels: ['oberfunktion.oberfunktionbezeichnung', 'funktionbezeichnung.funktionbezeichnung']
      }
    }
  }
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'einnahmeausgabe.einnahmeausgabe:Einnahme'},{label: 'Ausgaben', id: 'einnahmeausgabe.einnahmeausgabe:Ausgabe'}]

  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  }
});
