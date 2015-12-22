Components.JoinGameButton = React.createClass({
  mixins: [Mixins.RoutingHelpers, Mixins.Games],

  handleClick: function (event) {
    event.preventDefault();
    this.currentUserJoinGame();
  },

  render: function () {
    return (
      <a href="#join-game"
        onClick={this.handleClick}
        className={cx(this.props.className)}>
        {this.props.children}
      </a>
    );
  }

});
