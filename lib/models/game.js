Models.Game = function (props) {
}

// TODO: When you get one word wrong, append 2 words.

Models.createClass(Models.Game, {
  collection: Collections.Games,
  attributes: {
    _id: {},
    baseWords: {},
    playersWords: {},
    playersInputValues: {},
    playersEnteredWords: {}
  },
  oneToMany: {
    players: {
      modelName: "User",
      singular: "player",
      attributes: {
        _id: {},
        profile: {}
      }
    }
  },

  currentLobbyFor: function (userId) {
    var rawGame = this.collection.findOne({
      playersIds: { $size: 1, $in: [userId] }
    });
    return rawGame && this.initRaw(rawGame);
  },

  findWaitingFor: function (userId) {
    var rawGame = this.collection.findOne({
      playersIds: { $size: 1, $nin: [userId] }
    });
    return rawGame && this.initRaw(rawGame);
  },

  instanceMethods: {
    initializeWords: function () {
      this.props.playersWords = [
        _.clone(this.props.baseWords),
        _.clone(this.props.baseWords)
      ]
      this.props.playersInputValues = ["", ""];
      this.props.playersEnteredWords = [[], []];
      return this;
    },

    isReady: function () {
      return this.props.playersIds.length > 1;
    },

    addPlayerRaw: function (rawPlayer) {
      var player = Models.User.initRaw(rawPlayer);
      this.props.players.push(player);
      this.props.playersIds.push(player.props._id);
      return this;
    },

    opponentOf: function (playerId) {
      var p1 = this.props.players[0]
        , p2 = this.props.players[1];

      return p1.props._id == playerId ? p2 : p1;
    },

    wordsFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersWords[index];
    },

    updateGameStateFor: function (playerId, value, enteredWords) {
      var index = this.playerIndexOf(playerId)
        , $set = {};

      $set["playersInputValues." + index] =
        this.props.playersInputValues[index] = value;
      $set["playersEnteredWords." + index] =
        this.props.playersEnteredWords[index] = enteredWords;

      this.saveOnly($set);
    },

    getInputValueFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersInputValues[index];
    },

    setInputValueFor: function (playerId, value) {
      var index = this.playerIndexOf(playerId);
      this.props.playersInputValues[index] = value;
    },

    getEnteredWordsFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersEnteredWords[index];
    },

    setEnteredWordsFor: function (playerId, enteredWords) {
      var index = this.playerIndexOf(playerId);
      this.props.playersEnteredWords[index] = enteredWords;
    },

    getWordIndexFor: function (playerId) {
      return this.getEnteredWordsFor(playerId).length;
    },

    playerIndexOf: function (playerId) {
      return this.props.playersIds.indexOf(playerId);
    }
  }
});
