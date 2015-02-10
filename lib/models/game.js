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
    playersWordIndexes: {},
    playersWordStatuses: {}
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
      this.props.playersWordIndexes = [0, 0];
      this.props.playersWordStatuses = [[], []];
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

    updateGameStateFor: function (playerId, value, wordIndex, wordStatuses) {
      var index = this.playerIndexOf(playerId)
        , $set = {};

      $set["playersInputValues." + index] =
        this.props.playersInputValues[index] = value;
      $set["playersWordIndexes." + index] =
        this.props.playersWordIndexes[index] = wordIndex;
      $set["playersWordStatuses." + index] =
        this.props.playersWordStatuses[index] = wordStatuses;

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

    getWordIndexFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersWordIndexes[index];
    },

    setWordIndexFor: function (playerId, wordIndex) {
      var index = this.playerIndexOf(playerId);
      this.props.playersWordIndexes[index] = wordIndex;
    },

    getWordStatusesFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersWordStatuses[index];
    },

    setWordStatusesFor: function (playerId, wordStatuses) {
      var index = this.playerIndexOf(playerId);
      this.props.playersWordStatuses[index] = wordStatuses;
    },

    appendWordStatusFor: function (playerId, status) {
      var index = this.playerIndexOf(playerId);
      this.props.playersWordStatuses[index].push(status);
    },

    playerIndexOf: function (playerId) {
      return this.props.playersIds.indexOf(playerId);
    }
  }
});
