Mixins.Games = {
  // Mixing in Component must mixin in Router.Navigation as well.
  // mixins: [Router.Navigation]

  currentUserJoinGame: function () {
    var self = this;
    Meteor.call("joinGame", Meteor.userId(), function (error, gameId) {
      self.transitionTo("playGame", { gameId: gameId });
    });
  }

}
