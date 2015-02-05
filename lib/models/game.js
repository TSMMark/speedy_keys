Models.Game = function (props) {
}

Models.createClass(Models.Game, {
  collection: Collections.Games,
  availableWords: "greater had gathering void were under let itself it you're a isn't darkness shall made rule forth blessed void said together void moved moving make itself don't so seasons divide may isn't sixth us years without sea moving a night living deep lights itself be seed beginning so they're doesn't you'll don't great winged creepeth creeping dominion there a forth in also land fruit give two fowl unto dominion second fruitful meat likeness upon bring creepeth first kind all together he fruit in created day image very first moving bearing rule make male give great bring give brought hath said gathered isn't blessed which air earth moved fifth whose us rule gathered is abundantly void seasons had waters fruit rule were life yielding days won't signs called shall lesser fowl for under itself day moving behold very beast rule was beast there kind sixth creepeth seasons void gathering his creeping they're female man let upon fill shall and you're air behold moving lesser place after darkness one dry firmament you're shall he hath creature moved own herb unto saw signs winged abundantly meat land yielding i land his morning void two set is fly place midst dominion green".split(" "),
  attributes: {
    _id: {},
    words: {}
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

  // parseRaw: function (rawData) {
  //   return _.reduce(rawData, function (memo, value, key) {
  //     if (this.oneToMany.hasOwnProperty(key)) {
  //       var assocsIds = []
  //         , assocsData = value.map(function (rawAssoc) {
  //             assocsIds.push(rawAssoc._id);
  //             return rawAssoc;
  //           });

  //       memo[key] = assocsData;
  //       memo[key + "Ids"] = assocsIds;
  //     }
  //     else if (this.attributes.hasOwnProperty(key)) {
  //       memo[key] = value;
  //     }

  //     return memo;
  //   }, {}, this);
  // },

  // propsToRaw: function (props) {
  //   return _.reduce(props, function (memo, value, key) {
  //     console.log("memo, value, key", memo, value, key);
  //     return memo;
  //   }, {}, this);
  //   // return {
  //   //   _id: props._id,
  //   //   words: props.words,
  //   //   players: props.players.map(function (player) {
  //   //     return player.propsToRaw();
  //   //   }),
  //   //   playersIds: props.players.map(function (player) {
  //   //     return player.props._id;
  //   //   })
  //   // }
  // },

  // rawToProps: function (rawData) {
  //   rawData = this.parseRaw(rawData);

  //   return _.reduce(this.oneToMany, function (memo, modelName, assocName) {
  //     memo[assocName] = memo[assocName].map(function (rawAssoc) {
  //       return Models[modelName].initRaw(rawAssoc);
  //     });
  //     return memo;
  //   }, rawData, this);

  //   // var players = rawData.players.map(function (rawPlayer) {
  //   //       return Models.User.initRaw(rawPlayer);
  //   //     });

  //   // return {
  //   //   _id: rawData._id,
  //   //   words: rawData.words || this.getWords(),
  //   //   players: players,
  //   //   playersIds: players.map(function (player) {
  //   //     return player.props._id;
  //   //   })
  //   // }
  // },

  findWaitingFor: function (userId) {
    var rawGame = this.collection.findOne({
          // playersIds: { $size: { $lt: 2 }, $not: { $in: [userId] } }
        });
    console.log("findWaitingFor", rawGame);
    return rawGame && this.initRaw(rawGame);
  },

  getWords: function () {
    return _.shuffle(this.availableWords);
  },

  instanceMethods: {
    isReady: function () {
      return this.props.playersIds.length > 1;
    },

    addPlayer: function (rawPlayer) {
      var player = Models.User.initRaw(rawPlayer);
      this.props.players.push(player);
      this.props.playersIds.push(player.props._id);
      return this.save();
    }
  }
});
