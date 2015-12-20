Views.Home = React.createClass({

  componentDidMount: function () {
    // TODO: count down and auto-join game.
  },

  render: function () {
    return (
      <div>
        <Components.Container>
          <h1>Welcome to Speedy Keys</h1>
          <h3>Get ready to type as fast as you can!</h3>
        </Components.Container>
        <footer className="footer">
          <Components.Container>
            <Components.JoinGameButton className="btn btn-primary btn-lg btn-block">
              Play
            </Components.JoinGameButton>
          </Components.Container>
        </footer>
      </div>
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
        <footer className="footer">
          <Components.Container>
            <Link to="default" className="btn btn-default btn-block">Go Back</Link>
          </Components.Container>
        </footer>
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
