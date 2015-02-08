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
      return gameToJoin.props._id;
    }

    gameToJoin = Models.Game.findWaitingFor(playerId);

    if (gameToJoin) {
      gameToJoin.addPlayerRaw(rawPlayer);
      console.log("Joined a game", JSON.stringify(gameToJoin.props));
    }
    else {
      gameToJoin = Models.Game.createRaw({
        "players": [rawPlayer]
      });
      console.log("Created game", JSON.stringify(gameToJoin.props));
    }

    return gameToJoin.props._id;
  }
});
