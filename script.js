var app = angular.module("bggDecision", []);
app.controller("bggCtrl", function($scope, $http) {
  $scope.collectionIds = [];
  $scope.collection = [];
  //$scope.username = $cookies.get('username');

  $scope.callBGG = function() {
    if ($scope.username == null) alert('Please enter a username.');
    else {
      //$cookies.put('username', $scope.username);
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
          $scope.game = new Game($(this).attr('objectid'));
          $scope.collection.push($scope.game);
        })
      },function failure(response) {
        alert("Something went wrong.");
      });
    }
  }

  $scope.filterGames = function(game) {
    var players = document.getElementById("numPlayers").value;
    if (players >= parseInt(game.minPlayers) && players <= parseInt(game.maxPlayers)) return true;

    return false;
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

function Game(objectid) {
  var minPlayers = '';
  var maxPlayers = '';
  var minTime = '';
  var maxTime = '';
  var complexity = '';
  var name = '';
  var thumb = '';

  this.id = objectid;
  this.url = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + objectid + '&stats=1';

  $.ajax({
    type: "GET",
    url: this.url,
    async: false,
    dataType: 'xml',
    success: function success(response) {
      // console.log(response);
      // console.log($(response).find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value'));

      minPlayers = $(response).find("items").children('item').find('minplayers').attr('value');
      maxPlayers = $(response).find("items").children('item').find('maxplayers').attr('value');
      minTime = $(response).find("items").children('item').find('minplaytime').attr('value');
      maxTime = $(response).find("items").children('item').find('maxplaytime').attr('value');
      complexity = $(response).find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value');
      name = $(response).find("items").children('item').find('name').attr('value');
      thumb = $(response).find("items").children('item').find('thumbnail').text();

      // categories
      // your rating
    }
  });

  this.minPlayers = minPlayers;
  this.maxPlayers = maxPlayers;
  this.minTime = minTime;
  this.maxTime = maxTime;
  this.complexity = complexity;
  this.name = name;
  this.thumb = thumb;
}