Components.Container = React.createClass({
  render: function () {
    return (<div className="container">
              {this.props.children}
            </div>);
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
    var self = this;
    event.preventDefault();
    Meteor.call("joinGame", Meteor.userId(), function (error, gameId) {
      console.log("Components.JoinGameButton gameId: " + gameId);
      self.transitionTo("playGame", { gameId: gameId });
    });
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
