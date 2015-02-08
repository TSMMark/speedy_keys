var createGameForPlayer = function (rawPlayer) {
  var baseWords = _.shuffle(Config.allWords)
    , game;

  return Models.Game.createRaw({
    "players": [rawPlayer],
    "baseWords": baseWords
  });
}

Meteor.publish("games", function () {
  return Collections.Games.find();
});

Meteor.publish("users", function () {
  return Collections.Users.find();
});

Meteor.methods({
  joinGame: function (playerId) {
    var rawPlayer = Collections.Users.findOne(playerId)
      , gameToJoin = Models.Game.currentLobbyFor(playerId);

    if (gameToJoin) {
      console.log("Already in lobby", JSON.stringify(gameToJoin.props));
      return gameToJoin.props._id;
    }

    gameToJoin = Models.Game.findWaitingFor(playerId);

    if (gameToJoin) {
      gameToJoin.addPlayerRaw(rawPlayer);
      gameToJoin.initializeWords();
      gameToJoin.save();
      console.log("Joined a game", JSON.stringify(gameToJoin.props));
    }
    else {
      gameToJoin = createGameForPlayer(rawPlayer);
      console.log("Created game", JSON.stringify(gameToJoin.props));
    }

    return gameToJoin.props._id;
  }
});
