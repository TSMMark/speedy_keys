Views.PlayGame = React.createClass({
  mixins: [Router.State, Router.Navigation, ReactMeteor.Mixin],

  getMeteorState: function () {
    // This is the only fucking way I could get it to autorun:
    Session.set("gameId", this.getParams().gameId);

    var gameId = Session.get("gameId")
      , currentUser = Meteor.user()
      , game = Models.Game.findById(gameId);

    Meteor.subscribe("games");

    return {
      gameId: gameId,
      game: game,
      opponent: game && game.opponentOf(currentUser._id),
      currentUser: currentUser
    };
  },

  render: function () {
    var currentUser = this.state.currentUser
      , gameId = this.state.gameId
      , game = this.state.game;

    if (!game) return (<Views.NotFound key="not-found"/>);

    if (!this.state.opponent) {
      return (<Views.WaitForOpponent key="waiting"/>);
    }

    return (
      <Views.Game currentUser={Models.User.initRaw(currentUser)}
                  opponent={this.state.opponent}
                  game={game}
                  key="game"/>);
  }
});

Views.Game = React.createClass({
  render: function () {
    var currentUser = this.props.currentUser
      , currentUserId = currentUser.props._id
      , opponent = this.props.opponent
      , opponentId = opponent.props._id
      , game = this.props.game;

    return (
      <Components.Container>
        <h1>v.s. {opponent.props.profile.name} (aka Your Worst Nightmare)</h1>
        <div className="row">
          <div className="col-sm-6 clearfix">
            <h2 onClick={this.mockOpponent}>You</h2>
            <Components.Game words={game.wordsFor(currentUserId)}
                             key="currentUserGame"
                             playable={true}
                             ref="current-user-input"
                             onChange={this.userChange}
                             inputValue={game.getInputValueFor(currentUserId)}
                             currentWordIndex={game.getWordIndexFor(currentUserId)}
                             wordStatuses={game.getWordStatusesFor(currentUserId)} />
          </div>
          <div className="col-sm-6 clearfix">
            <h2>{opponent.props.profile.name}</h2>
            <Components.Game words={game.wordsFor(opponentId)}
                             key="opponentGame"
                             playable={false}
                             inputValue={game.getInputValueFor(opponentId)}
                             currentWordIndex={game.getWordIndexFor(opponentId)}
                             wordStatuses={game.getWordStatusesFor(opponentId)} />
          </div>
        </div>
      </Components.Container>
    );
  },

  mockOpponent: function (event) {
    if (confirm("Really mock opponent? (Refresh page to stop)")) {
      var self = this;
      setInterval(function () {
        self.userChange(Math.random(), 0, []);
      }, 100);
    }
  },

  userChange: function (value, wordIndex, wordStatuses) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.updateGameStateFor(currentUserId,
      value, wordIndex, wordStatuses);
  }
});

Views.WaitForOpponent = React.createClass({
  getDefaultProps: function () {
    return {
      maxDots: 10,
      minDots: 0
    }
  },

  getInitialState: function () {
    return {
      dots: this.props.minDots
    }
  },

  render: function () {
    var dots = Array(this.state.dots + 1).join(".");

    return (
      <Components.Container>
        <h1>
          Waiting for opponent
          {dots}
        </h1>
      </Components.Container>);
  },

  incrementDots: function () {
    var dots = this.state.dots + 1;
    this.setState({
      dots: dots > this.props.maxDots ? this.props.minDots : dots
    });
  },

  componentDidMount: function () {
    this.interval = setInterval(this.incrementDots, 1000 / this.props.maxDots);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
    this.interval = undefined;
  }
});
