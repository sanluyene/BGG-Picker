
class Game {
    constructor() {
        var name = '';
        var minPlayers = '';
        var maxPlayers = '';
        var minTime = '';
        var maxTime = '';
        var complexity = '';
        var thumb = '';
        var gameType = '';
        // this.id = objectid;
        // this.url = 'https://www.boardgamegeek.com/xmlapi2/thing?id=' + objectid + '&stats=1';
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
