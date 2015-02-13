Views.Game = React.createClass({
  getDefaultProps: function () {
    return {
      mobile: false,
      ready: true
    }
  },

  render: function () {
    var currentUser = this.props.currentUser
      , currentUserId = currentUser.props._id
      , opponent = this.props.opponent
      , opponentId = opponent.props._id
      , game = this.props.game
      , opponentGameComponent
      , opponentName = opponent.props.profile.name
      , classes = {
          "game-container": true,
          "mobile": true
        };

    if (!this.props.mobile) {
      opponentGameComponent = (
        <div className="col-sm-6 clearfix">
          <h2>{opponent.props.profile.name}</h2>
          <Components.Game words={game.wordsFor(opponentId)}
                           key="opponentGame"
                           playable={false}
                           inputValue={game.getInputValueFor(opponentId)}
                           enteredWords={game.getEnteredWordsFor(opponentId)} />
        </div>);

      opponentName += " (aka Your Worst Nightmare)";
      classes["mobile"] = false;
    }

    return (
      <Components.Container className={cx(classes)}>
        <h1>
          v.s. {opponentName}
        </h1>
        <div className="row">
          <div className="col-sm-6 clearfix">
            {
              !this.props.mobile
              ? <h2 onClick={this.mockOpponent}>You</h2>
              : null
            }
            <Components.Game words={game.wordsFor(currentUserId)}
                             key="currentUserGame"
                             playable={true}
                             ref="current-user-input"
                             ready={this.props.ready}
                             onInputValueChange={this.handleInputValueChange}
                             onSubmitWord={this.handleSubmitWord}
                             inputValue={game.getInputValueFor(currentUserId)}
                             enteredWords={game.getEnteredWordsFor(currentUserId)} />
          </div>
          {opponentGameComponent}
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
      }, 10);
    }
  }
});

Views.WaitForOpponent = React.createClass({
  render: function () {
    return (
      <Components.Container>
        <h1>
          Waiting for opponent
        </h1>
        <div className="game-of-life-wrapper">
          <GameOfLife begin={true}/>
        </div>
      </Components.Container>);
  }
});
