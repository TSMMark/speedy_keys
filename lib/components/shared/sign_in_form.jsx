Components.SignInForm = React.createClass({
  mixins: [Mixins.RoutingHelpers, Mixins.Games],

  propTypes: {
    includePassword: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      includePassword: true
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


  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-field black-text">
          <Components.Utils.AutoFitText>
            <h3>Make up a name:</h3>
          </Components.Utils.AutoFitText>
          <input type="text" id="username" ref="username" placeholder="Marty McFly" />
        </div>

        {
          this.props.includePassword
          ? (
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref="password" placeholder="Flux Capacitor" />
              </div>
            )
          : null
        }

        <ul className="vertical-buttons-list">
          <li>
            <button type="submit" className="btn btn-large btn-block">
              Play!
            </button>
          </li>
          <li>
            <Components.FacebookLogin btn={true} className="btn-block white black-text">
              Use Facebook name
            </Components.FacebookLogin>
          </li>
        </ul>
      </form>
    );
  }

})
