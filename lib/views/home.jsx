Views.Home = React.createClass({

  componentDidMount: function () {
    // TODO: count down and auto-join game.
  },

  render: function () {
    return (
      <div>
        <Components.Container>
          <Components.Utils.AutoFitText>
            <h1>Welcome to Speedy Keys</h1>
          </Components.Utils.AutoFitText>
          <h3>Get ready to type as fast as you can!</h3>
          <h5 className="light italic">Tap 'Play' to begin</h5>
        </Components.Container>
        <footer className="footer">
          <Components.Container>
            <Components.JoinGameButton className="btn btn-primary btn-large btn-block">
              Play
            </Components.JoinGameButton>
          </Components.Container>
        </footer>
      </div>
    );
  }

});
