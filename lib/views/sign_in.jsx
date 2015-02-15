Views.SignIn = React.createClass({
  render: function () {
    return (
      <Components.Container>
        <div className="jumbotron">
          <div className="row">
            <div className="col-md-6 col-md-offset-0">
              <h1>Speedy Keys</h1>
              <h2>Play the addicting new speed-typing game with your friends.</h2>
            </div>
            <div className="col-md-6 col-md-offset-0 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <div className="panel-title">Sign Up or Sign In</div>
                </div>
                <div className="panel-body">
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input type="text" id="username" ref="username"
                             className="form-control input-lg"
                             placeholder="Marty McFly" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" id="password" ref="password"
                             className="form-control input-lg"
                             placeholder="Flux Capacitor" />
                    </div>

                    <div className="form-group">
                      <input type="submit" value="Submit"
                             className="btn btn-primary btn-lg btn-block" />
                    </div>

                    <div className="form-group">
                      <Components.FacebookLogin className="btn-lg btn-block" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Components.Container>
    );
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var username = this.refs["username"].getDOMNode().value
      , password = this.refs["password"].getDOMNode().value;

    if (!username) {
      return alert("Username required");
    }

    if (!password) {
      return alert("Password required");
    }

    var callback = function (error) {
      if (error) {
        return alert(error.reason + " Incorrect password?");
      }
      Meteor.user();
    }

    var user = { username: username };

    Meteor.loginWithPassword(user, password, function (error) {
      if (error) {
        Accounts.createUser({
          username: username,
          password: password,
          profile: {
            name: username
          }
        }, callback);
        return;
      }

      callback();
    });
  }
});
