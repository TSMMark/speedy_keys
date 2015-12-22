Components.PlayersProgress = React.createClass({

  propTypes: {
    dual: React.PropTypes.bool.isRequired,
    playerProgress: React.PropTypes.number,
    opponentProgress: React.PropTypes.number,
    playerEmoji: React.PropTypes.string.isRequired,
    opponentEmoji: React.PropTypes.string.isRequired
  },

  render: function () {

    var dual = this.props.dual
      , playerEmoji = this.props.playerEmoji
      , opponentEmoji = this.props.opponentEmoji
      , playerProgress
      , opponentProgress
      , centerIndicator
      , modifier = 1.0;

    if (this.props.playerProgress >= 0) {
      playerProgress = (
        <div className="player-progress">
          <Components.ProgressBar progress={this.props.playerProgress}
            mainColor="teal"
            backgroundColor="teal lighten-5"
            modifier={modifier} />
          <div className="player-icon-container">
            <Components.Emoji emoji={playerEmoji}
              style={{ left: (this.props.playerProgress * 100) + "%" }} />
          </div>
        </div>
      );
    }

    if (this.props.opponentProgress >= 0) {
      opponentProgress = (
        <div className="opponent-progress">
          <Components.ProgressBar progress={this.props.opponentProgress}
            mainColor="red"
            backgroundColor="red lighten-5"
            modifier={modifier} />
          <div className="opponent-icon-container">
            <Components.Emoji emoji={opponentEmoji}
              style={{ left: (this.props.opponentProgress * 100) + "%" }} />
          </div>
        </div>
      );
    }

    if (dual) {
      centerIndicator = <div className="center-indicator" />;
    }

    return (
      <div className={cx({ "players-progress": true, "dual-progress": dual })}>
        {playerProgress}
        {opponentProgress}
      </div>
    );
  }

});
