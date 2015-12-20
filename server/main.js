Meteor.publish("games", function () {
  return Collections.Games.find({
    playersIds: { $in: [this.userId] }
  });
});

Meteor.publish("users", function () {
  return Collections.Users.find({ _id: this.userId });
});

var createGameForPlayer = function (rawPlayer) {
  var count = Models.Game.DEFAULT_STARTING_WORDS
    , baseWords = Models.Game.getRandomWords(count)
    , game;

  return Models.Game.createRaw({
    "players": [rawPlayer],
    "baseWords": baseWords
  });
}

// TODO: resume countdowns on meteor startup.
var beginCountdown = function (game) {
  var countdown = Models.Game.STARTING_COUNTDOWN
    , callback = Meteor.bindEnvironment(function () {
        countdown -= 1;
        console.log("Countdown: ", countdown);
        game.setCountdownSeconds(countdown);

        if (countdown === 0) {
          clearInterval(interval);
          // startAI(game); // TODO
        }
      })
    , interval = setInterval(callback, 1000);
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
      beginCountdown(gameToJoin);
    }
    else {
      gameToJoin = createGameForPlayer(rawPlayer);
    }

    return gameToJoin.props._id;
  },

  // TODO: Leave game whenever the user leaves the game route.
  leaveGame: function (playerId) {
    var currentLobby = Models.Game.currentLobbyFor(playerId);

    if (!currentLobby ||
        currentLobby.props.playersIds.length > 1) {
      return false;
    }

    currentLobby.destroy();
    return true;
  }

});
