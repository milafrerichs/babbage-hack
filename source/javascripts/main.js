var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

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
