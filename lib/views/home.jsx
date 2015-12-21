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
