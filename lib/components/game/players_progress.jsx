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
      , playerProgressBar
      , opponentProgressBar
      , playerProgressEmoji
      , opponentProgressEmoji
      , centerIndicator
      , modifier = 1.0;

    if (this.props.playerProgress >= 0) {
      playerProgressBar = (
        <Components.ProgressBar progress={this.props.playerProgress}
                                mainColor="teal"
                                backgroundColor="teal lighten-5"
                                modifier={modifier} />
      );

      playerProgressEmoji = (
        <div className="player-icon-container">
          <Components.Emoji emoji={playerEmoji}
            style={{ left: (this.props.playerProgress * 100) + "%" }} />
        </div>
      );
    }

    if (this.props.opponentProgress >= 0) {
      opponentProgressBar = (
        <Components.ProgressBar progress={this.props.opponentProgress}
                                mainColor="red"
                                backgroundColor="red lighten-5"
                                modifier={modifier} />
      );

      opponentProgressEmoji = (
        <div className="opponent-icon-container">
          <Components.Emoji emoji={opponentEmoji}
            style={{ left: (this.props.opponentProgress * 100) + "%" }} />
        </div>
      );
    }

    if (dual) {
      centerIndicator = <div className="center-indicator" />;
    }

    return (
      <div className={cx({ "players-progress": true, "dual-progress": dual })}>
        <div className="player-progress">
          {playerProgressBar}
          {playerProgressEmoji}
        </div>
        <div className="opponent-progress">
          {opponentProgressBar}
          {opponentProgressEmoji}
        </div>
      </div>
    );
  }

});
