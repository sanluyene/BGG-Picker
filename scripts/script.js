var bgApp = angular.module("bggDecision", []);

bgApp.controller("bggCtrl", function ($scope, $http) {
  // Default values
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

  $scope.callBGG = async function () {
    if ($scope.username == null) alert('Please enter a username.');
    else {
      const collection = await $scope.GetCollection();
    }
  }

  $scope.GetCollection = function () {
    //$cookies.put('username', $scope.username);
    let urlIds = 'https://www.boardgamegeek.com/xmlapi2/collection?own=1&username=' + $scope.username;
    let header = {};

    $http({
      method: 'GET',
      url: urlIds,
      headers: header,
      timeout: 10000
    }).then(function (response) {
      if (response.status == 202) {
        setTimeout(function () {
          callBGG();
        }, 3000)
      } else if (response.status == 200) {
        // Success
        const xml = $.parseXML(response.data);
        const jqX = $(xml);
        jqX.find('item').each(function () {
          $scope.collectionIds.push($(this).attr('objectid'));
        });

        return $scope.GetGames();
      }
    }, function (response) {
      // Failure
      console.log("Something went wrong.");
      console.log(response);
    });
  }

  $scope.GetGames = function () {
    // After we've collected the Game IDs, we can get each of their details
    const ids = Object.values($scope.collectionIds);
    const id_string = ids.join();
    const urlGs = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + id_string + '&stats=1';
    let header = {};

    $http({
      method: 'GET',
      url: urlGs,
      headers: header,
      timeout: 10000
    }).then(function (response) {
      if (response.status == 202) {
        setTimeout(function () {
          GetGames();
        }, 3000)
      } else if (response.status == 200) {
        // Success
        let xml = $.parseXML(response.data);
        let jqX = $(xml);
        jqX.find('item').each(function () {
          let id = $(this).attr('objectid');
          let url = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + id + '&stats=1';
          let name = $(this).find('name').attr('value');
          let minPlayers = $(this).find('minplayers').attr('value');
          let maxPlayers = $(this).find('maxplayers').attr('value');
          let minTime = $(this).find('minplaytime').attr('value');
          let maxTime = $(this).find('maxplaytime').attr('value');
          let complexity = $(this).find('statistics').find('ratings').find('averageweight').attr('value');
          let thumb = $(this).find('thumbnail').text();

          // Denotes full game or expansion
          let gameType = $(this).attr('type');

          // TODO get personal rating
          // TODO get categories

          let game = new Game(id, url, name, minPlayers, maxPlayers, minTime, maxTime, complexity, thumb, gameType);
          $scope.collection.push(game);
        })
      }
    }, function (response) {
      // Failure
      console.log("Something went wrong.");
      console.log(response);
    });
  }
});

bgApp.controller("swfCtrl", function ($scope, $http) {
  // Default values
  $scope.numPlayers = '4';
  $scope.username = 'sanluyene'; // Testing

  $scope.categories = [
    'Pirates',
    'Zombies'
  ];

  $scope.collectionIds = [];
  $scope.collection = [];
  //$scope.username = $cookies.get('username');

  $scope.callSteam = async function () {
    if ($scope.username == null) alert('Please enter a username.');
    else {
      // const collection = await $scope.GetCollection();
    }
  }

  $scope.GetCollection = function () {
    //$cookies.put('username', $scope.username);
    let urlIds = 'https://www.boardgamegeek.com/xmlapi2/collection?own=1&username=' + $scope.username;
    let header = {};

    $http({
      method: 'GET',
      url: urlIds,
      headers: header,
      timeout: 10000
    }).then(function (response) {
      if (response.status == 202) {
        setTimeout(function () {
          callswf();
        }, 3000)
      } else if (response.status == 200) {
        // Success
        const xml = $.parseXML(response.data);
        const jqX = $(xml);
        jqX.find('item').each(function () {
          $scope.collectionIds.push($(this).attr('objectid'));
        });

        return $scope.GetGames();
      }
    }, function (response) {
      // Failure
      console.log("Something went wrong.");
      console.log(response);
    });
  }

  $scope.GetGames = function () {
    // After we've collected the Game IDs, we can get each of their details
    const ids = Object.values($scope.collectionIds);
    const id_string = ids.join();
    const urlGs = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + id_string + '&stats=1';
    let header = {};

    $http({
      method: 'GET',
      url: urlGs,
      headers: header,
      timeout: 10000
    }).then(function (response) {
      if (response.status == 202) {
        setTimeout(function () {
          GetGames();
        }, 3000)
      } else if (response.status == 200) {
        // Success
        let xml = $.parseXML(response.data);
        let jqX = $(xml);
        jqX.find('item').each(function () {
          let id = $(this).attr('objectid');
          let url = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + id + '&stats=1';
          let name = $(this).find('name').attr('value');
          let minPlayers = $(this).find('minplayers').attr('value');
          let maxPlayers = $(this).find('maxplayers').attr('value');
          let minTime = $(this).find('minplaytime').attr('value');
          let maxTime = $(this).find('maxplaytime').attr('value');
          let complexity = $(this).find('statistics').find('ratings').find('averageweight').attr('value');
          let thumb = $(this).find('thumbnail').text();

          // Denotes full game or expansion
          let gameType = $(this).attr('type');

          // TODO get personal rating
          // TODO get categories

          let game = new Game(id, url, name, minPlayers, maxPlayers, minTime, maxTime, complexity, thumb, gameType);
          $scope.collection.push(game);
        })
      }
    }, function (response) {
      // Failure
      console.log("Something went wrong.");
      console.log(response);
    });
  }
});

bgApp.filter('filterGames', function () {
  return function (items, numPlayers, complexityMax, complexityMin, time, expansions) {
    var newItems = [];
    if (items) {

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
    }
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
  constructor(id, url, name, minPlayers, maxPlayers, minTime, maxTime, complexity, thumb, gameType) {
    this.id = id;
    this.url = url;
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

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  var includes = $('[data-include]')
  $.each(includes, function () {
    var file = $(this).data('include') + '.html'
    $(this).load(file)
  })
}