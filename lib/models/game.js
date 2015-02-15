Models.Game = function (props) {
}

var INCORRECT_SUBMIT_PENALTY = 3;

Models.createClass(Models.Game, {
  collection: Collections.Games,

  DEFAULT_STARTING_WORDS: 32,
  STARTING_COUNTDOWN: 5,

  attributes: {
    _id: {},
    winnerId: {},
    baseWords: {},
    playersWords: {},
    playersInputValues: {},
    playersEnteredWords: {},
    countdownSeconds: {}
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

  getRandomWords: function (count) {
    return _.sample(Config.allWords, count);
  },

  instanceMethods: {
    initializeWords: function () {
      this.props.playersWords = [
        _.clone(this.props.baseWords),
        _.clone(this.props.baseWords)
      ]
      this.props.playersInputValues = ["", ""];
      this.props.playersEnteredWords = [[], []];
      this.props.countdownSeconds = Models.Game.STARTING_COUNTDOWN;
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

    getProgressFor: function (playerId) {
      var index = this.playerIndexOf(playerId)
        , wordsCount = this.wordsFor(playerId).length
        , enteredWordsCount = this.getEnteredWordsFor(playerId).length;

      return enteredWordsCount / wordsCount;
    },

    wordsFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersWords[index];
    },

    appendRandomWordsFor: function (playerId, wordsCount) {
      var words = Models.Game.getRandomWords(wordsCount);
      this.appendWordsFor(playerId, words);
    },

    appendWordsFor: function (playerId, words) {
      var index = this.playerIndexOf(playerId)
        , $push = {};

      $push["playersWords." + index] = {
        $each: words
      };

      this.updateCollection({
        $push: $push
      });
    },

    submitWordFor: function (playerId, value) {
      var index = this.playerIndexOf(playerId)
        , wordIndex = this.props.playersEnteredWords[index].length
        , validWord = this.props.playersWords[index][wordIndex]
        , isValid = validWord === value
        , winnerId = this.props.winnerId
        , $set = {};

      if (!isValid) {
        this.appendRandomWordsFor(playerId, INCORRECT_SUBMIT_PENALTY);
      }

      $set["playersEnteredWords." + index + "." + wordIndex] =
        this.props.playersEnteredWords[index][wordIndex] = value;

      $set["playersInputValues." + index] =
        this.props.playersInputValues[index] = "";

      if (isValid && !winnerId && this.doesPlayerWin(index)) {
        $set["winnerId"] =
          this.props.winnerId = playerId;
      }

      this.saveOnly($set);
    },

    doesPlayerWin: function (index) {
      var enteredLength = this.props.playersEnteredWords[index].length
        , totalLength = this.props.playersWords[index].length;

      return enteredLength === totalLength;
    },

    setCountdownSeconds: function (countdownSeconds) {
      this.props.countdownSeconds = countdownSeconds;

      this.saveOnly({
        countdownSeconds: countdownSeconds
      });
    },

    getInputValueFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersInputValues[index];
    },

    setInputValueFor: function (playerId, value) {
      var index = this.playerIndexOf(playerId)
        , $set = {};

      $set["playersInputValues." + index] =
        this.props.playersInputValues[index] = value;

      this.saveOnly($set);
    },

    getEnteredWordsFor: function (playerId) {
      var index = this.playerIndexOf(playerId);
      return this.props.playersEnteredWords[index];
    },

    getWordIndexFor: function (playerId) {
      return this.getEnteredWordsFor(playerId).length;
    },

    playerIndexOf: function (playerId) {
      return this.props.playersIds.indexOf(playerId);
    }
  }
});
