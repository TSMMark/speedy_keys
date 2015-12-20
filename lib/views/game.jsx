Views.Game = React.createClass({

  getDefaultProps: function () {
    return {
      mobile: false,
      ready: true
    }
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
      <div className="col-sm-6 clearfix">
        {
          !mobile
          ? <h2 onClick={this.mockOpponent}>You <Components.Emoji emoji={currentUser.props.profile.emoji}/></h2>
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
        <div className="col-sm-6 clearfix">
          <h2>{opponent.props.profile.name} <Components.Emoji emoji={opponent.props.profile.emoji}/></h2>
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
        <h1>
          v.s. {opponentName} <Components.Emoji emoji={opponent.props.profile.emoji}/>
        </h1>
        <div className="row">
          {currentUserGameComponent}
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
    var size = this.props.mobile ? 25 : 50
      , cancelButton
      , lifeClasses = {
          "game-of-life-wrapper": true
        };

    lifeClasses["size-" + size] = true;

    cancelButton = (
      <Components.LeaveGameButton className="btn btn-default btn-block">
        Cancel
      </Components.LeaveGameButton>
    );

    return (
      <div>
        <Components.Container>
          <h2>Get ready to type as fast as you can!</h2>
          <h6>Finding a worthy opponent...</h6>
        </Components.Container>
        <div className={cx(lifeClasses)}>
          <GameOfLife begin={true} size={size} />
        </div>
        <footer className="footer">
          <Components.Container>
            {cancelButton}
          </Components.Container>
        </footer>
      </div>
    );
  }

});
