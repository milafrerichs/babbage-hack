var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'Einnahmen';
  $scope.defaultCut = ['titelart:Einnahmetitel', 'jahr:2016'];
  $scope.state = {
    tile: ['hauptgruppe.hauptgruppenbezeichnung'],
    cut: $scope.defaultCut,
    hierarchies: {
      'einzelplan.einzelplanbezeichnung': {
        label: 'Einzelplan',
        levels: ['kapitel.kapitelbezeichnung', 'titel.titelbezeichnung']
      },
      'hauptgruppe.hauptgruppenbezeichnung': {
        label: 'Hauptgruppe',
        levels: [ 'obergruppe.obergruppenbezeichnung', 'gruppe.gruppenbezeichnung']
      },
      'hauptfunktion.hauptfunktionsbezeichnung': {
        label: 'Hauptfunktion',
        levels: ['oberfunktion.oberfunktionsbezeichnung', 'funktion.funktionsbezeichnung']
      }
    }
  }
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'titelart:Einnahmetitel'},{label: 'Ausgaben', id: 'titelart:Ausgabetitel'}]
  $scope.changeEinahmenAusgaben = function(attr) {
    $scope.defaultCut = [attr.id];
  }
  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
  }
});
