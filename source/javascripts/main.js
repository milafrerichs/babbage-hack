var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'einnahmeausgabe.einnahmeausgabe:Einnahme';
  $scope.defaultCut = [$scope.einahmeAusgabe];
  $scope.state = {
    tile: ['hauptgruppe.hauptgruppenbezeichnung'],
    cut: [ $scope.einahmeAusgabe],
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
  $scope.changeEinahmenAusgaben = function(attr) {
    $scope.einahmeAusgabe = attr.id;
    $scope.state.cut = [attr.id];
    $scope.defaultCut = [$scope.einahmeAusgabe];
  }
  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  }
});
