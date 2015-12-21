Views.WaitForOpponent = React.createClass({

  render: function () {
    var size = this.props.mobile ? 25 : 50
      , cancelButton
      , lifeClasses = {
          "game-of-life-wrapper": true
        };

    lifeClasses["size-" + size] = true;

    cancelButton = (
      <Components.LeaveGameButton className="btn btn-default btn-block">
        Cancel
      </Components.LeaveGameButton>
    );

    return (
      <div>
        <Components.Container>
          <h2>Get ready to type as fast as you can!</h2>
          <h6>Finding a worthy opponent...</h6>
        </Components.Container>
        <div className={cx(lifeClasses)}>
          <GameOfLife begin={true} size={size} />
        </div>
        <footer className="footer">
          <Components.Container>
            {cancelButton}
          </Components.Container>
        </footer>
      </div>
    );
  }

});
