Meteor.publish("games", function () {
  if (this.userId) {
    return Collections.Games.find();
    // return Collections.Games.find({ "playersIds": this.userId });
  }
  else {
    return [];
  }
});

Meteor.publish("users", function () {
  return Collections.Users.find();
});

Meteor.methods({
  joinGame: function (playerData) {
    var gameToJoin = Models.Game.findWaitingFor(playerData._id);

    if (gameToJoin) {
      gameToJoin.addPlayer(playerData);
      console.log("Joined a game", gameToJoin);
    }
    else {
      gameToJoin = Models.Game.createRaw({
        "players": [playerData]
      });
      console.log("Created game");
    }

    return gameToJoin.props._id;
  }
});
