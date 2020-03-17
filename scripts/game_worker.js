self.addEventListener('message', function (e) {
    self.postMessage(e.data);
    for (var i = 0; i < e.data.length; i++) {
        var game = e.data[i];
        self.postMessage(game);

        var name = '';
        var minPlayers = '';
        var maxPlayers = '';
        var minTime = '';
        var maxTime = '';
        var complexity = '';
        var thumb = '';
        var gameType = '';

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(response);
                // console.log(response.find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value'));
                name = response.find("items").children('item').find('name').attr('value');
                minPlayers = response.find("items").children('item').find('minplayers').attr('value');
                maxPlayers = response.find("items").children('item').find('maxplayers').attr('value');
                minTime = response.find("items").children('item').find('minplaytime').attr('value');
                maxTime = response.find("items").children('item').find('maxplaytime').attr('value');
                complexity = response.find("items").children('item').find('statistics').find('ratings').find('averageweight').attr('value');
                thumb = response.find("items").children('item').find('thumbnail').text();

                // Denotes full game or expansion
                gameType = response.find("items").children('item').attr('type');
                // TODO get personal rating
                // TODO get categories
            }
        };
        xhttp.open("GET", game.url, true);
        xhttp.setRequestHeader('Access-Control-Allow-Origin', null);
        xhttp.send();




        e.data[i].name = name;
        e.data[i].minPlayers = minPlayers;
        e.data[i].maxPlayers = maxPlayers;
        e.data[i].minTime = minTime;
        e.data[i].maxTime = maxTime;
        e.data[i].complexity = complexity;
        e.data[i].thumb = thumb;
        e.data[i].gameType = gameType;
    }

    self.postMessage(e.data);
}, false);