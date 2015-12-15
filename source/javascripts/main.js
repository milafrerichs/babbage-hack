var demo = angular.module('demo', ['ngRoute', 'ngBabbage', 'angular.filter', 'ui.bootstrap', 'ui.select']);

demo.controller('DemoCtrl', function ($scope) {
  $scope.state = {
    tile: ['funktionbezeichnung.funktionbezeichnung'],
    cut: [ 'einnahmeausgabe.einnahmeausgabe:Einnahme' ]
  }
  $scope.einahmenausgaben = [{label: 'Einnahmen', id: 'einnahmeausgabe.einnahmeausgabe:Einnahme'},{label: 'Ausgaben', id: 'einnahmeausgabe.einnahmeausgabe:Ausgabe'}]
  $scope.changeEinahmenAusgaben = function(attr) {
    $scope.state.cut = [attr.id];
  }
});
