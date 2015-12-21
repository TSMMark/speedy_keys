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
      <form onSubmit={this.handleSubmit} className="card-panel">
        <div className="input-field">
          <h3>Make up a name:</h3>
          <input type="text" id="username" ref="username"
                 placeholder="Marty McFly" />
        </div>

        {
          this.props.includePassword
          ? (
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref="password"
                       placeholder="Flux Capacitor" />
              </div>
            )
          : null
        }

        { this.props.mobile ? (
            <ul className="vertical-buttons-list">
              <li>
                <input type="submit" value="Play!" className="btn btn-large btn-block" />
              </li>
              <li>
                <Components.FacebookLogin btn={true} className="btn-block white black-text">
                  Use my Facebook name
                </Components.FacebookLogin>
              </li>
            </ul>
          ) : (
            <nav className="white z-depth-0">
              <div className="nav-wrapper">
                <ul className="right">
                  <li>
                    <Components.FacebookLogin btn={false} className="black-text">
                      Use my Facebook name
                    </Components.FacebookLogin>
                  </li>
                  <li>
                    <input type="submit" value="Play!" className="btn btn-large" />
                  </li>
                </ul>
              </div>
            </nav>
          )
        }
      </form>
    );
  },

  render: function () {
    return (
      <Components.Container>
        <div className={cx("row", { "valign-wrapper": !this.props.mobile })}>
          <div className={cx("col m6", { "valign": !this.props.mobile })}>
            { this.props.mobile? null : <h1>Speedy Keys</h1> }
            <h2>Can you text faster than your friends?</h2>
          </div>
          <div className="col m6 valign">
            { this.renderSignInForm() }
          </div>
        </div>

        <footer className="footer right-align">
          <Components.Container>A game by Mark Allen - Copyright 2015</Components.Container>
        </footer>
      </Components.Container>
    );
  }

});
