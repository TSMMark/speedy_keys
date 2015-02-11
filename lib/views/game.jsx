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
                             onInputValueChange={this.handleInputValueChange}
                             onSubmitWord={this.handleSubmitWord}
                             inputValue={game.getInputValueFor(currentUserId)}
                             enteredWords={game.getEnteredWordsFor(currentUserId)} />
          </div>
          <div className="col-sm-6 clearfix">
            <h2>{opponent.props.profile.name}</h2>
            <Components.Game words={game.wordsFor(opponentId)}
                             key="opponentGame"
                             playable={false}
                             inputValue={game.getInputValueFor(opponentId)}
                             enteredWords={game.getEnteredWordsFor(opponentId)} />
          </div>
        </div>
      </Components.Container>
    );
  },

  handleInputValueChange: function (value) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.setInputValueFor(currentUserId, value);
  },

  handleSubmitWord: function (value) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.submitWordFor(currentUserId, value);
  },

  mockOpponent: function (event) {
    if (confirm("Really mock opponent? (Refresh page to stop)")) {
      var self = this;
      setInterval(function () {
        self.handleInputValueChange(Math.random());
      }, 100);
    }
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
