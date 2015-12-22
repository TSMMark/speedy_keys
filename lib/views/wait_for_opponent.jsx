Views.WaitForOpponent = React.createClass({

  propTypes: {
    mobile: React.PropTypes.bool.isRequired
  },

  render: function () {
    var size = this.props.mobile ? 25 : 50
      , cancelButton
      , lifeClasses = {
          "game-of-life-wrapper": true,
          "z-depth-2": true
        };

    lifeClasses["size-" + size] = true;

    cancelButton = (
      <Components.LeaveGameButton className="btn btn-block white black-text">
        Cancel
      </Components.LeaveGameButton>
    );

    return (
      <div>
        <Components.Container>
          <h2>Get ready to type as fast as you can!</h2>
          <h6>Finding a worthy opponent...</h6>
        </Components.Container>
        <Components.Container>
          <div className={cx(lifeClasses)}>
            <GameOfLife begin={true} size={size} />
          </div>
        </Components.Container>
        <footer className="footer">
          <Components.Container>
            {cancelButton}
          </Components.Container>
        </footer>
      </div>
    );
  }

});
