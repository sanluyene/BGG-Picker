var bgApp = angular.module("bggDecision", []);

bgApp.controller("bggCtrl", function ($scope, $http) {
  // Default values; some for testing
  $scope.numPlayers = '4';
  $scope.username = 'sanluyene'; // Testing

  $scope.categories = [
    'Abstract Strategy',
    'Action / Dexterity',
    'Adventure',
    'Age of Reason',
    'American Civil War',
    'American Indian Wars',
    'American Revolutionary War',
    'American West',
    'Ancient',
    'Animals',
    'Arabian',
    'Aviation / Flight',
    'Bluffing',
    'Book',
    'Card Game',
    'Children\'s Game',
    'City Building',
    'Civil War',
    'Civilization',
    'Collectible Components',
    'Comic Book / Strip',
    'Deduction',
    'Dice',
    'Economic',
    'Educational',
    'Electronic',
    'Environmental',
    'Expansion for Base-game',
    'Exploration',
    'Fan Expansion',
    'Fantasy',
    'Farming',
    'Fighting',
    'Game System',
    'Horror',
    'Humor',
    'Industry / Manufacturing',
    'Korean War',
    'Mafia',
    'Math',
    'Mature / Adult',
    'Maze',
    'Medical',
    'Medieval',
    'Memory',
    'Miniatures',
    'Modern Warfare',
    'Movies / TV / Radio theme',
    'Murder/Mystery',
    'Music',
    'Mythology',
    'Napoleonic',
    'Nautical',
    'Negotiation',
    'Novel-based',
    'Number',
    'Party Game',
    'Pike and Shot',
    'Pirates',
    'Political',
    'Post-Napoleonic',
    'Prehistoric',
    'Print & Play',
    'Puzzle',
    'Racing',
    'Real-time',
    'Religious',
    'Renaissance',
    'Science Fiction',
    'Space Exploration',
    'Spies/Secret Agents',
    'Sports',
    'Territory Building',
    'Trains',
    'Transportation',
    'Travel',
    'Trivia',
    'Video Game Theme',
    'Vietnam War',
    'Wargame',
    'Word Game',
    'World War I',
    'World War II',
    'Zombies'
  ];

  $scope.collectionIds = [];
  $scope.collection = [];
  //$scope.username = $cookies.get('username');

  $scope.callBGG = function () {
    if ($scope.username == null) alert('Please enter a username.');
    else {
      //$cookies.put('username', $scope.username);
      $scope.urlIds = 'https://www.boardgamegeek.com/xmlapi2/collection?username=' + $scope.username;
      $scope.header = {};

      $http({
        method: 'GET',
        url: $scope.urlIds,
        headers: $scope.header,
        timeout: 10000
      }).then(function success(response) {
        $scope.xml = $.parseXML(response.data);
        $scope.jqX = $($scope.xml);
        $scope.jqX.find('item').each(function () {
          //console.log($(this).attr('objectid'));
          $scope.game = new Game($(this).attr('objectid'));
          $scope.collection.push($scope.game);
        });
      }, function failure(response) {
        alert("Something went wrong.");
      });
    }
  };
});

bgApp.filter('filterGames', function () {
  return function (items, numPlayers, complexityMax, complexityMin, time, expansions) {
    var newItems = [];

    for (var i = 0; i < items.length; i++) {
      var keep = true;
      if (expansions == undefined) expansions = false;

      // Check if the game supports the number of players
      if (numPlayers < parseInt(items[i].minPlayers) || numPlayers > parseInt(items[i].maxPlayers)) keep = false;

      // Check if the game meets complexity limits
      if (complexityMin > parseFloat(items[i].complexity) || complexityMax < parseFloat(items[i].complexity)) keep = false;

      // Check if the game meets time restrictions
      if (time < parseInt(items[i].minTime)) keep = false;

      if (!expansions && items[i].gameType == "boardgameexpansion") keep = false;

      if (keep) newItems.push(items[i]);
    };

    return newItems;
  }
});

bgApp.directive('slider', function () {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Initialize complexity sliders and setup change event to enable updating the value
      if (jQuery(element).context.id == 'complexityMin') {
        jQuery(element).slider({
          min: 1,
          max: 5,
          step: 0.01,
          value: 1,
          animate: true,
          'change': function () {
            scope.$evalAsync(setModelValue);
          }
        });
      }
      if (jQuery(element).context.id == 'complexityMax') {
        jQuery(element).slider({
          min: 1,
          max: 5,
          step: 0.01,
          value: 5,
          animate: true,
          'change': function () {
            scope.$evalAsync(setModelValue);
          }
        });
      }

      // Initialize time slider and setup change event to enable updating the value
      if (jQuery(element).context.id == 'time') {
        jQuery(element).slider({
          min: 0,
          max: 300,
          step: 15,
          value: 300,
          animate: true,
          'change': function () {
            scope.$evalAsync(setModelValue);
          }
        });
      }

      //Read data from model into custom control
      ngModel.$render = function () {
        jQuery(element).slider("value", ngModel.$viewValue || 0);
      };

      setModelValue();

      // Write data from control to the model
      function setModelValue() {
        var value = jQuery(element).slider("value");
        ngModel.$setViewValue(value);
        if (jQuery(element).context.id == 'time') {
          scope.timeDisplay = '';
          var hours = Math.floor(value / 60);
          var minutes = value % 60;

          //  if (hours == 1) scope.timeDisplay = hours + " hour";
          if (hours > 0) scope.timeDisplay = hours + " H";
          if (minutes > 0) scope.timeDisplay += " " + minutes + " M";
        }
      }
    }
  };
});

class Game {
  constructor(objectid) {
    var name = '';
    var minPlayers = '';
    var maxPlayers = '';
    var minTime = '';
    var maxTime = '';
    var complexity = '';
    var thumb = '';
    var gameType = '';

    this.id = objectid;
    this.url = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + objectid + '&stats=1';
    this.header = {};

    $.ajax({
      type: "GET",
      url: this.url,
      headers: this.header,
      async: false,
      dataType: 'xml',
      success: function success(response) {
        // console.log(response);
        // console.log($(response).find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value'));

        name = $(response).find("items").children('item').find('name').attr('value');
        minPlayers = $(response).find("items").children('item').find('minplayers').attr('value');
        maxPlayers = $(response).find("items").children('item').find('maxplayers').attr('value');
        minTime = $(response).find("items").children('item').find('minplaytime').attr('value');
        maxTime = $(response).find("items").children('item').find('maxplaytime').attr('value');
        complexity = $(response).find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value');
        thumb = $(response).find("items").children('item').find('thumbnail').text();

        // Denotes full game or expansion
        gameType = $(response).find("items").children('item').attr('type');

        // TODO get personal rating
        // TODO get categories
      }
    });

    this.name = name;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.complexity = complexity;
    this.thumb = thumb;
    this.gameType = gameType;
  }
}