var app = angular.module("bggDecision", []);
app.controller("bggCtrl", function($scope, $http, $cookies) {
  $scope.collectionIds = [];
  $scope.collection = {};
  $scope.username = $cookies.get('username');

  $scope.callBGG = function() {
    if ($scope.username == null) alert('Please enter a username.');
    else {
      $cookies.put('username', $scope.username);
      $scope.urlIds = 'https://www.boardgamegeek.com/xmlapi2/collection?username=' + $scope.username;

      $http({
        method  : 'GET',
        url     : $scope.urlIds,
        timeout : 10000
      }).then(function success(response) {
        $scope.xml = $.parseXML(response.data);
        $scope.jqX = $($scope.xml);
        $scope.jqX.find('item').each(function () {
          //console.log($(this).attr('objectid'));
          $scope.collectionIds.push($(this).attr('objectid'));
          $scope.urlItem = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + $(this).attr('objectid');

          $http({
            method  : 'GET',
            url     : $scope.urlItem,
            timeout : 10000
          }).then(function success(response) {
            $scope.xmlI = $.parseXML(response.data);
            $scope.jqXI = $($scope.xmlI);
            // make object with attrs
            // min player
            // max player
            // complexity
            // categories
            // name
            // link
            // min play time
            // max play time
            // your rating

          },function failure(response) {
            // alert("Something went wrong.");
          });
        })
      },function failure(response) {
        alert("Something went wrong.");
      });
    }
  }
});

$("#complexity-range").slider({
  range: true,
  min: 0,
  max: 5,
  step: 0.01,
  values: [0, 5],
  slide: function(event, ui) {
    $("#complexity-amount").html(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
  }
});

$("#complexity-amount").html($("#complexity-range").slider("values", 0) + " - " + $("#complexity-range").slider("values", 1));

$("#time-range").slider({
  range: true,
  min: 0,
  max: 300,
  step: 5,
  values: [0, 300],
  slide: function(event, ui) {
    $("#time-amount").html(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
  }
});

$("#time-amount").html($("#time-range").slider("values", 0) + " - " + $("#time-range").slider("values", 1));