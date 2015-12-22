Mixins.Games = {
  // Mixing in Component must mixin in ReactRouter.Navigation as well.
  // mixins: [ReactRouter.Navigation]
  // mixins: [Mixins.RoutingHelpers],

  currentUserJoinGame: function () {
    var self = this;
    Meteor.call("joinGame", Meteor.userId(), function (error, gameId) {
      self.navigateToPath("/play/" + gameId);
    });
  }

}
