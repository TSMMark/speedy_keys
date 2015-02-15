Components.Container = React.createClass({
  render: function () {
    var classes = {
      "container": true
    }

    classes[cx(this.props.className)] = true;

    return (<div className={cx(classes)}>
              {this.props.children}
            </div>);
  }
});

Components.Panel = React.createClass({
  getDefaultProps: function () {
    return {
      className: {
        "panel-default": true
      },
      bodyClassName: {}
    }
  },

  render: function () {
    var heading
      , classes = {
          "panel": true
        }
      , bodyClasses = {
          "panel-body": true
        };

    classes[cx(this.props.className)] = true;
    bodyClasses[cx(this.props.bodyClassName)] = true;

    if (this.props.heading) {
      heading = (
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.heading}
          </h3>
        </div>);
    }

    return (
      <div className={cx(classes)}>
        {heading}
        <div className={cx(bodyClasses)}>
          {this.props.children}
        </div>
      </div>);
  }
});

Components.JoinGameButton = React.createClass({
  mixins: [Router.Navigation],

  render: function () {
    return (
      <a href="#join-game" onClick={this.joinGame}
                           className={cx(this.props.className)}>
        {this.props.children}
      </a>);
  },

  joinGame: function (event) {
    var self = this;
    event.preventDefault();
    Meteor.call("joinGame", Meteor.userId(), function (error, gameId) {
      self.transitionTo("playGame", { gameId: gameId });
    });
  }
});

Components.LeaveGameButton = React.createClass({
  mixins: [Router.Navigation],

  render: function () {
    return (
      <a href="#leave-game" onClick={this.leaveGame}
                            className={cx(this.props.className)}>
        {this.props.children}
      </a>);
  },

  leaveGame: function (event) {
    event.preventDefault();
    this.transitionTo("default");

    // Note:
    //   We don't NEED this as long as `leaveGame` is called on
    //     PlayGame controller unmount...
    //   However, I think we should verify leaveGame is
    //     successful before navigating.
    Meteor.call("leaveGame", Meteor.userId(), function (error, wasSuccessful) {
      if (wasSuccessful) {
        this.transitionTo("default");
      }
    }.bind(this));
  }
});

Components.SignOutButton = React.createClass({
  mixins: [Router.Navigation],

  getDefaultProps: function () {
    return {};
  },

  render: function () {
    var classes = {
      "btn": true,
      "btn-default": true
    };

    return (
      <button onClick={this.signOut}
              className={cx(classes)}>
        <span className="fa fa-power-off"></span> Sign Out
      </button>);
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

Components.FacebookLogin = React.createClass({
  mixins: [Router.Navigation],

  getDefaultProps: function () {
    return {};
  },

  render: function () {
    var classes = {
      "btn": true,
      "btn-facebook": true
    };

    if (this.props.className) {
      classes[this.props.className] = true
    }

    return (
      <button onClick={this.signIn}
         className={cx(classes)}>
        Sign up with Facebook
      </button>);
  },

  signIn: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.loginWithFacebook({
      requestPermissions: ["email"]
    }, function (error) {
      if (error) throw error;

      self.transitionTo("default");
    });
  }
});

