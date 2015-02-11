Meteor.publish("games", function () {
  return Collections.Games.find({
    playersIds: { $in: [this.userId] }
  });
});

Meteor.publish("users", function () {
  return Collections.Users.find({ _id: this.userId });
});

var createGameForPlayer = function (rawPlayer) {
  var length = 42
    , baseWords = _.first(_.shuffle(Config.allWords), length)
    , game;

  return Models.Game.createRaw({
    "players": [rawPlayer],
    "baseWords": baseWords
  });
}

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
      gameToJoin.initializeWords();
      gameToJoin.save();
    }
    else {
      gameToJoin = createGameForPlayer(rawPlayer);
    }

    return gameToJoin.props._id;
  }
});
