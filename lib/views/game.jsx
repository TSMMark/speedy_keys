Views.Game = React.createClass({

  getDefaultProps: function () {
    return {
      mobile: false,
      ready: true
    }
  },

  mockOpponent: function (event) {
    if (confirm("Really mock opponent? (Refresh page to stop)")) {
      var self = this;
      setInterval(function () {
        self.handleInputValueChange(Math.random());
      }, 10);
    }
  },

  handleInputValueChange: function (value) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.setInputValueFor(currentUserId, value);
  },

  handleSubmitWord: function (value) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.submitWordFor(currentUserId, value);
  },

  render: function () {
    var mobile = !!this.props.mobile
      , currentUser = this.props.currentUser
      , currentUserId = currentUser.props._id
      , opponent = this.props.opponent
      , opponentId = opponent.props._id
      , game = this.props.game
      , currentUserGameComponent
      , opponentGameComponent
      , opponentName = opponent.props.profile.name
      , currentUserProgress = game.getProgressFor(currentUserId)
      , opponentProgress = game.getProgressFor(opponentId)
      , classes = {
          "game-container": true,
          "mobile": this.props.mobile
        };

    var sharedGameProps = {
      dual: mobile
    }

    currentUserGameComponent = (
      <div className="col m6">
        {
          !mobile
          ? <h2 className="game-player-name-header" onClick={this.mockOpponent}>
              You
              {" "}
              <Components.Emoji emoji={currentUser.props.profile.emoji}/>
            </h2>
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
                         enteredWords={game.getEnteredWordsFor(currentUserId)}
                         playerProgress={currentUserProgress}
                         opponentProgress={mobile ? opponentProgress : undefined}
                         player={currentUser}
                         opponent={opponent}
                         {...sharedGameProps} />
      </div>
    );

    if (!mobile) {
      opponentGameComponent = (
        <div className="col m6">
          <h2 className="game-player-name-header">
            {opponent.props.profile.name}
            {" "}
            <Components.Emoji emoji={opponent.props.profile.emoji}/>
          </h2>
          <Components.Game words={game.wordsFor(opponentId)}
                           key="opponentGame"
                           playable={false}
                           inputValue={game.getInputValueFor(opponentId)}
                           enteredWords={game.getEnteredWordsFor(opponentId)}
                           playerProgress={undefined}
                           opponentProgress={opponentProgress}
                           player={currentUser}
                           opponent={opponent}
                           {...sharedGameProps} />
        </div>);
    }

    return (
      <Components.Container className={cx(classes)}>
        <h1 className="game-match-title-header">
          v.s. {opponentName} <Components.Emoji emoji={opponent.props.profile.emoji}/>
        </h1>
        <div className="row">
          {currentUserGameComponent}
          {opponentGameComponent}
        </div>
      </Components.Container>
    );
  }

});

