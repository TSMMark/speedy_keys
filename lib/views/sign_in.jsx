var getRandomEmoji = function () {
  return _.sample(_.keys(emojione.emojioneList));
}

Views.SignIn = React.createClass({
  getDefaultProps: function () {
    return {
      includePassword: true
    }
  },

  render: function () {
    return (
      <Components.Container>
        <div className="jumbotron">
          <div className="row">

            <div className="col-md-6 col-md-offset-0">
              <h1>Speedy Keys</h1>
              <h2>Play the addicting new speed-typing game with your friends.</h2>
              <p>
                Put your typing skills to the test
                by battling against your friends or randos.
              </p>
              <p>
                Compare your words-per-minute on
                the global leaderboards.
              </p>
            </div>

            <div className="col-md-6 col-md-offset-0 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username"><h2>Make up a name:</h2></label>
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
                         className="btn btn-primary btn-lg btn-block" />
                </div>

                <div className="form-group text-right">
                  {"or "}
                  <Components.FacebookLogin btn={false}>
                    use Facebook name
                  </Components.FacebookLogin>
                </div>
              </form>
            </div>

          </div>
        </div>
        <footer className="pull-right">
          Copyright Mark Allen 2015
        </footer>
      </Components.Container>
    );
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var username = this.refs["username"].getDOMNode().value
      , password = this.refs["password"] ? this.refs["password"].getDOMNode().value : Math.random(9999999).toString();

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
            name: username,
            emoji: getRandomEmoji()
          }
        }, callback);
        return;
      }

      callback();
    });
  }
});
