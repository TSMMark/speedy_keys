Views = {};

Views.App = React.createClass({
  render: function () {
    return (
      <div>
        <Partials.Navbar/>
        <div id="main-content">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

Views.Home = React.createClass({
  render: function () {
    var currentUser = Meteor.user();

    return (
      <Components.Container>
        <h1>Welcome to Speedy Keys</h1>
        <Components.JoinGameButton className="btn btn-primary">
          Join a Game!
        </Components.JoinGameButton>
      </Components.Container>
    );
  }
});

Views.NotFound = React.createClass({
  getDefaultProps: function () {
    return {
      message: "Oops! Something went wrong.",
      submessage: "We couldn't find what you were looking for."
    }
  },

  render: function () {
    return (
      <Components.Container>
        <h1>{this.props.message}</h1>
        <h2>{this.props.submessage}</h2>
        <Link to="home" className="btn btn-default">Go Back</Link>
      </Components.Container>
    );
  }
});

Views.SignIn = React.createClass({
  render: function () {
    return (
      <Components.Container>
        <div className="jumbotron">
          <h1>Speedy Keys</h1>
          <h2>Play the new addicting speed-typing game with your friends.</h2>
          <Components.FacebookLogin/>
        </div>
      </Components.Container>
    );
  }
});

Views.ConfigureServices = React.createClass({
  mixins: [Router.State, Router.Navigation],

  render: function () {
    return (
      <Components.Container>
        <form onSubmit={this.handleSubmit}>
          <p>Enter the Facebook app data:</p>
          <label htmlFor="app_id">app_id</label>
          <input type="text" ref="app_id" id="app_id" name="app_id" />
          <label htmlFor="app_secret">app_secret</label>
          <input type="text" ref="app_secret" id="app_secret" name="app_secret" />
          <input type="submit" className="btn btn-default" />
        </form>
      </Components.Container>);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var app_id = this.refs.app_id.getDOMNode().value
      , app_secret = this.refs.app_secret.getDOMNode().value

    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: app_id,
      secret: app_secret
    });
  }
});
