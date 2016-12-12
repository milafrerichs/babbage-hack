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
ngBabbageGlobals.otherName = "Summe Sonstige";
ngBabbageGlobals.otherKey = "-";
ngBabbageGlobals.nullName = "Rundungsdifferenz";
ngBabbageGlobals.nullKey = "-";

ngBabbageGlobals.keyFormat = function(text, key) {
  var s = "000000000" + text;
  return addSpacingToKey(s.substr(s.length-numberOfLeadingZeros(key)));
};
ngBabbageGlobals.pageSize = 25;
ngBabbageGlobals.categoryColors = [
    "#BCD631", "#95C93D", "#48B85C", "#00833D", "#00B48D",
    "#60C4B1", "#27C4F4", "#478DCB", "#3E67B1", "#4251A3", "#59449B",
    "#CF3D1E", "#F15623", "#F68B1F", "#FFC60B", "#DFCE21",
    "#6E3F7C", "#6A246D", "#8A4873", "#EB0080", "#EF58A0", "#C05A89",
    "#BCD631", "#95C93D", "#48B85C", "#00833D", "#00B48D",
    "#60C4B1", "#27C4F4", "#478DCB", "#3E67B1", "#4251A3", "#59449B",
    "#CF3D1E", "#F15623", "#F68B1F", "#FFC60B", "#DFCE21",
    "#6E3F7C", "#6A246D", "#8A4873", "#EB0080", "#EF58A0", "#C05A89"
    ];
colorScale = d3.scale.ordinal().range(ngBabbageGlobals.categoryColors);

ngBabbageGlobals.colorScale = function(i) {
  return colorScale(i);
};

truncate = function(name, maxlen, repl) {
  maxlen = maxlen || 30;
  repl = repl || '…';
  if (name.length > maxlen) {
    return name.substring(0, maxlen - repl.length) + repl;
  }
  return name;
};
findKey = function(d) {
  var keyValue = d._key;
  for(var name in d) {
    if(d[name] == keyValue) return name;
  }
};
leadingZeros = function(d, text) {
  if(d._name == ngBabbageGlobals.otherName) { return text; }
  if(d._name == ngBabbageGlobals.nullName) { return text; }
  var s = "000000000" + text;
  return s.substr(s.length-numberOfLeadingZeros(findKey(d)));
};
numberOfLeadingZeros = function(key) {
  switch(key) {
    case 'gruppe.gruppe' : return 3;
    case 'obergruppe.obergruppe' : return 2;
    case 'hauptgruppe.hauptgruppe': return 1;
    case 'einzelplan.einzelplan': return 2;
    case 'kapitel.kapitel': return 4;
    case 'titel.titel': return 5;
    case 'hauptfunktion.hauptfunktion': return 1;
    case 'oberfunktion.oberfunktion': return 2;
    case 'funktion.funktion': return 3;
  }
};
addSpacingToKey = function(text) {
  var position = 3,
      kapitelLength = 4;
  if(text.length <= position) { return text; }
  if(text.length === kapitelLength) {
    return [text.slice(0, 2), " ", text.slice(2)].join('');
  }
  return [text.slice(0, position), " ", text.slice(position)].join('');
};
ngBabbageGlobals.treemapHtmlFunc = function(d) {
  if(d.data._name == "Hochbaumaßnahmen und Wohnungsbauförderung") {
    return 'Bau (' + addSpacingToKey(leadingZeros(d.data,d.data._key)) + ')' + '<span class="amount">' + d.data._area_fmt + '</span>';
  }
  if(d.data._name == "Ministerium für Wirtschaft, Klimaschutz, Energie und Landesplanung") {
    return 'MWKEL (' + addSpacingToKey(leadingZeros(d.data,d.data._key)) + ')' + '<span class="amount">' + d.data._area_fmt + '</span>';
  }
  if(d.data._name == "Ministerium für Umwelt, Energie, Ernährung und Forsten") {
    return 'MUEEF (' + addSpacingToKey(leadingZeros(d.data,d.data._key)) + ')' + '<span class="amount">' + d.data._area_fmt + '</span>';
  }
  if(d.data._name == "Ministerium für Familie, Frauen, Jugend, Integration und Verbraucherschutz") {
    return 'MFFJIV (' + addSpacingToKey(leadingZeros(d.data,d.data._key)) + ')' + '<span class="amount">' + d.data._area_fmt + '</span>';
  }
  if (d.data._percentage < 0.03) {
    return '';
  }
  return d.children ? null : truncate(d.data._name, 90) + ' (' + addSpacingToKey(leadingZeros(d.data,d.data._key)) + ')' + '<span class="amount">' + d.data._area_fmt + '</span>';
};

var percentFormat = function(d) {
  return d3.locale.de_DE.numberFormat(".1f")(d*100)+" %";
};
demo.controller('DemoCtrl', function ($scope) {
  $scope.einahmeAusgabe = 'Einnahmen';
	$scope.defaultCut = ['einnahmeausgabe.einnahmeausgabe:Ausgabe', 'jahr.jahr:2018'];
  $scope.state = {
    tile: ['einzelplan'],
    cut: $scope.defaultCut,
    tableOrder: '',
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
  $scope.jahr = [{label: '2018', id: 'jahr.jahr:2018'},{label: '2017', id: 'jahr.jahr:2017'},{label: '2016', id: 'jahr.jahr:2016'}];
  $scope.anzeige = [{id: 'einzelplan', label: 'Einzelpläne'}, {id: 'hauptfunktion', label: 'Politikfelder'},  {id: 'hauptgruppe', label: 'Gruppen' }];

  $scope.showTooltip = true;
  $scope.showTableKey = true;
  $scope.showKeyValue = true;
  $scope.tooltipContent = function(d) {
    if(d._name == ngBabbageGlobals.nullName) { return "<b> " + d._name; }
    if(d._name) {
      return "<b>" + d._name + " ("+ addSpacingToKey(leadingZeros(d, d._key))+"):</b> <br/>" + d._area_fmt + " (" + percentFormat(d._percentage) + ")";
    }
  };

  $scope.setTile = function(tile) {
    $scope.reset = true;
    $scope.state.tile = [tile];
    $scope.state.cut = [ $scope.defaultCut ];
    $scope.state.tableOrder = [];
  };
});
