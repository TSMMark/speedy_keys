Views.SignIn = React.createClass({
  mixins: [Mixins.RoutingHelpers, Mixins.Games],

  propTypes: {
    history: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      includePassword: true,
      mobile: false
    }
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var username = this.refs["username"].value
      , password = this.refs["password"] ? this.refs["password"].value : Math.random(9999999).toString();

    if (!username) {
      return alert("Username required");
    }

    if (!password) {
      return alert("Password required");
    }

    var callback = function () {
      Meteor.user();
    }

    var user = { username: username };

    var self = this;
    Meteor.loginWithPassword(user, password, function (error) {
      if (error) { // If no user existed.
        Accounts.createUser({
          username: username,
          password: password,
          profile: {
            name: username
          }
        }, function (error) {
          if (error) {
            return alert(error.reason + " Incorrect password?");
          }
          callback();
          self.currentUserJoinGame();
        });
        return;
      }

      callback();
    });
  },

  renderSignInForm: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="username"><h3>Make up a name:</h3></label>
          <input type="text" id="username" ref="username"
                 className="form-control input-lg"
                 placeholder="Marty McFly" />
        </div>

        {
          this.props.includePassword
          ? (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref="password"
                       className="form-control input-lg"
                       placeholder="Flux Capacitor" />
              </div>
            )
          : null
        }

        <div className="form-group">
          <input type="submit" value="Play!"
                 className="btn btn-primary btn-large btn-block" />
        </div>

        <div className="form-group text-right">
          {"or "}
          <Components.FacebookLogin btn={false}>
            use Facebook name
          </Components.FacebookLogin>
        </div>
      </form>
    );
  },

  render: function () {
    return (
      <Components.Container>
        <div className={cx({ jumbotron: !this.props.mobile })}>
          <div className="row">

            <div className="col-md-6 col-md-offset-0">
              { this.props.mobile? null : <h1>Speedy Keys</h1> }
              <h2>Can you text faster than your friends?</h2>
            </div>

            <div className="col-md-6 col-md-offset-0 col-sm-8 col-sm-offset-2">
              { this.renderSignInForm() }
            </div>

          </div>
        </div>
        <footer className="footer text-right">
          <Components.Container>A game by Mark Allen - Copyright 2015</Components.Container>
        </footer>
      </Components.Container>
    );
  }

});
