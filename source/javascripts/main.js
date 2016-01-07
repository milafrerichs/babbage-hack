var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

demo.controller('DemoCtrl', function ($scope) {
  $scope.reset = false;
  $scope.einnahmenAusgaben = 'einnahmeausgabe.einnahmeausgabe:Einnahme';
  $scope.state = {
    //tile: ['einzelplanbezeichnung.einzelplanbezeichnung'],
    tile: ['hauptgruppe.hauptgruppenbezeichnung'],
    cut: [ 'einnahmeausgabe.einnahmeausgabe:Einnahme' ],
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
    $scope.einnahmenAusgaben = attr.id;
    $scope.state.cut = [attr.id];
  }
});
