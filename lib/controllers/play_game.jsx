Controllers.PlayGame = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation, ReactMeteorData],

  contextTypes: {
    mobile: React.PropTypes.bool.isRequired
  },

  getMeteorData: function () {
    // This is the only fucking way I could get it to autorun:
    // TODO: Use meteor session for currentGameId
    //       Use /play/:id route for observing.
    Session.set("gameId", this.props.params.gameId);
    Session.get("gameId");

    const subHandles = [
      Meteor.subscribe("games")
    ];

    const subsReady = _.all(subHandles, function (handle) {
      return handle.ready();
    });

    // Get the current routes from React Router
    const routes = this.props.routes;

    var gameId = this.props.params.gameId
      , game = Models.Game.findById(gameId)
      , currentUserId = Meteor.user()._id;

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
    if (Meteor.user()) {
      Meteor.call("leaveGame", Meteor.user()._id);
    }
  },

  render: function () {
    var currentUser = Meteor.user()
      , gameId = this.data.gameId
      , game = this.data.game
      , maxCount = Models.Game.STARTING_COUNTDOWN
      , maxTransparency = 0.7
      , rate = maxTransparency / maxCount
      , overlayAlpha = 1 - ((maxCount - this.data.countdown) * rate)
      , overlay
      , main;

    if (!game) {
      // TODO: Add a notice "Game not found, try again." and redirect home.
      main = <Views.NotFound key="not-found" />;
    }
    else if (!this.data.opponent) {
      main = <Views.WaitForOpponent key="waiting" mobile={this.context.mobile}/>;
    }
    else {
      var player = Models.User.initRaw(currentUser)
        , opponent = this.data.opponent;

      if (this.data.countdown > 0) {
        overlay = (
          <Components.Overlay className="countdown-overlay"
                              key="countdown-overlay"
                              alpha={overlayAlpha}>
            <h2>v.s. {opponent.props.profile.name} <Components.Emoji emoji={opponent.props.profile.emoji}/></h2>
            <h1>{this.data.countdown}</h1>
          </Components.Overlay>
        );
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
                                           currentUserId={currentUser._id} />
              </div>

              <div className="form-group">
                <Components.JoinGameButton className="btn btn-large btn-primary">
                  Play Again
                </Components.JoinGameButton>
              </div>
            </Components.Panel>
          </Components.Overlay>
        );
      }

      main = (
        <Views.Game currentUser={player}
                    opponent={this.data.opponent}
                    game={game}
                    mobile={this.context.mobile}
                    ready={this.data.countdown == 0}
                    key={"game:" + gameId} />
      );
    }

    return (
      <div>
        {main}
        <ReactCSSTransitionGroup transitionName="overlay"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={0}
                                 transitionEnter={true}
                                 transitionLeave={false}>
          {overlay}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});
