Controllers.PlayGame = React.createClass({
  mixins: [Router.State, Router.Navigation, ReactMeteor.Mixin],

  getMeteorState: function () {
    // This is the only fucking way I could get it to autorun:
    // TODO: Use meteor session for currentGameId
    //       Use /play/:id route for observing.
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

  componentWillUnmount: function () {
    Meteor.call("leaveGame", this.props.currentUser._id);
  },

  render: function () {
    var currentUser = this.props.currentUser
      , gameId = this.state.gameId
      , game = this.state.game
      , maxCount = Models.Game.STARTING_COUNTDOWN
      , maxTransparency = 0.7
      , rate = maxTransparency / maxCount
      , overlayAlpha = 1 - ((maxCount - this.state.countdown) * rate)
      , overlay
      , main;

    if (!game) {
      main = <Views.NotFound key="not-found" />;
    }
    else if (!this.state.opponent) {
      main = <Views.WaitForOpponent key="waiting"
                                    mobile={this.props.mobile} />;
    }
    else {
      var player = Models.User.initRaw(currentUser)
        , opponent = this.state.opponent;

      if (this.state.countdown > 0) {
        overlay = (
          <Components.Overlay className="countdown-overlay"
                              key="countdown-overlay"
                              alpha={overlayAlpha}>
            <h2>v.s. {opponent.props.profile.name}</h2>
            <h1>{this.state.countdown}</h1>
          </Components.Overlay>);
      }
      else if (game.props.winnerId) {
        var winnerIsMe = game.props.winnerId === currentUser._id
          , winner = winnerIsMe ? player : opponent
          , heading = (winnerIsMe ? "Great job, " : "Sorry, ") + player.props.profile.name;

        overlay = (
          <Components.Overlay className="winner-overlay"
                              key="winner-overlay"
                              alpha={maxTransparency}>
            <Components.Panel heading={heading}>
              <div className="form-group">
                <h2 className={winnerIsMe ? "text-primary" : "text-danger"}>
                  {winner.props.profile.name} wins!
                </h2>
              </div>

              <div className="form-group">
                <Components.GameStatsTable game={game}
                                           currentUserId={this.props.currentUser._id} />
              </div>

              <div className="form-group">
                <Components.JoinGameButton className="btn btn-lg btn-primary">
                  Play Again
                </Components.JoinGameButton>
              </div>
            </Components.Panel>
          </Components.Overlay>);
      }

      main = (
        <Views.Game currentUser={player}
                    opponent={this.state.opponent}
                    game={game}
                    mobile={this.props.mobile}
                    ready={this.state.countdown == 0}
                    key={"game:" + gameId} />);
    }

    return (
      <div>
        {main}
        <TimeoutTransitionGroup transitionName="overlay"
                                enterTimeout={500}
                                leaveTimeout={0}
                                transitionEnter={true}
                                transitionLeave={false}>
          {overlay}
        </TimeoutTransitionGroup>
      </div>);
  }
});
