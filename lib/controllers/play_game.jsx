Controllers.PlayGame = React.createClass({
  mixins: [Router.State, Router.Navigation, ReactMeteor.Mixin],

  getMeteorState: function () {
    // This is the only fucking way I could get it to autorun:
    Session.set("gameId", this.getParams().gameId);
    Session.get("gameId");

    Meteor.subscribe("games");

    var gameId = this.getParams().gameId
      , game = Models.Game.findById(gameId)
      , currentUserId = this.props.currentUser._id;

    var countdown = game ? game.props.countdownSeconds
                         : Models.Game.STARTING_COUNTDOWN

    return {
      gameId: gameId,
      game: game,
      opponent: game && game.opponentOf(currentUserId),
      countdown: countdown
    };
  },

  render: function () {
    var currentUser = this.props.currentUser
      , gameId = this.state.gameId
      , game = this.state.game;

    if (!game) {
      return (<Views.NotFound key="not-found"/>);
    }

    if (!this.state.opponent) {
      return (<Views.WaitForOpponent key="waiting"/>);
    }

    var maxCount = Models.Game.STARTING_COUNTDOWN
      , maxTransparency = 0.7
      , rate = maxTransparency / maxCount
      , overlayAlpha = 1 - ((maxCount - this.state.countdown) * rate)
      , overlay;

    if (this.state.countdown > 0) {
      overlay = (
        <Components.Overlay className="countdown-overlay"
                            alpha={overlayAlpha}>
          {this.state.countdown}
        </Components.Overlay>);
    }

    return (
      <div>
        <Views.Game currentUser={Models.User.initRaw(currentUser)}
                    opponent={this.state.opponent}
                    game={game}
                    mobile={this.props.mobile}
                    key={"game:" + gameId}/>
        {overlay}
      </div>);
  }
});
