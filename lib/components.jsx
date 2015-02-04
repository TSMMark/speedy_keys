Components = {};

if (React.addons) {
  ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
  cx = React.addons.classSet;
}

Components.Container = React.createClass({
  render: function () {
    return (<div className="container">
              {this.props.children}
            </div>);
  }
});

Components.Game = React.createClass({

  getInitialState: function () {
    return {
      currentWordIndex: 0,
      wordStatuses: []
    };
  },

  render: function () {
    var self = this
      , words = this.props.words.map(function (word, index) {
          var satus = self.state.wordStatuses[index]
            , classes = cx({
                "game-word": true,
                valid: satus === true,
                invalid: satus === false,
                active: index == self.state.currentWordIndex
              });
          return (<span className={classes} key={index}>{word}</span>);
        });

    return (
      <div className="game">
        {words}
        <input type="text" className="form-control"
               id="game-input" ref="game-input"
               onKeyDown={this.handleKeyDown} />
      </div>);
  },

  handleKeyDown: function (event) {
    var SPACE = 32, RETURN = 13
      , self = this
      , currentWordIndex = self.state.currentWordIndex;

    switch (event.keyCode) {
      case SPACE:
      case RETURN:
        event.preventDefault();
        self.submitWord();
        break;
      default:
        setTimeout(function () {
          if (self.isCompleteMatch()) {
            self.state.wordStatuses[currentWordIndex] = true;
          }
          else if (!self.isPartialMatch()) {
            self.state.wordStatuses[currentWordIndex] = false;
          }
          else {
            self.state.wordStatuses[currentWordIndex] = undefined;
          }
          self.setState({});
        }, 0);
    }
  },

  isPartialMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.state.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord.indexOf(inputValue) === 0;
  },

  isCompleteMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.state.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord === inputValue;
  },

  submitWord: function () {
    var input = this.refs["game-input"].getDOMNode()
      , currentWordIndex = this.state.currentWordIndex
      , valid = this.isCompleteMatch()

    this.state.wordStatuses[currentWordIndex] = valid;
    input.value = "";

    this.setState({
      currentWordIndex: currentWordIndex + 1
    })
  }
});

Components.JoinGameButton = React.createClass({
  mixins: [Router.Navigation],

  render: function () {
    return (
      <a href="#" onClick={this.joinGame} className={this.props.className}>
        {this.props.children}
      </a>);
  },

  joinGame: function (event) {
    event.preventDefault();
    this.transitionTo("playGame", { gameId: "whatever" });
  }
});

Components.FacebookLogin = React.createClass({
  mixins: [Router.Navigation],

  render: function () {
    if (this.props.currentUser) {
      return (
        <button onClick={this.signOut}
                className="btn btn-default">
          <span className="fa fa-power-off"></span>
        </button>);
    }
    else {
      return (
        <button onClick={this.signIn}
           className="btn btn-facebook">
          Sign in with Facebook
        </button>);
    }
  },

  signIn: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.loginWithFacebook({
      requestPermissions: ['email']
    }, function (error) {
      Meteor._debug("FacebookLogin", error);
      if (error) throw error;

      self.transitionTo("default");
    });
  },

  signOut: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.logout(function (error) {
      Meteor._debug("Logout", error);
      if (error) throw error;

      self.transitionTo("default");
    });
  }
});
