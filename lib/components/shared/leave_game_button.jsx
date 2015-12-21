Components.LeaveGameButton = React.createClass({
  mixins: [Mixins.RoutingHelpers],

  render: function () {
    return (
      <a href="#leave-game" onClick={this.handleClick}
                            className={cx(this.props.className)}>
        {this.props.children}
      </a>);
  },

  handleClick: function (event) {
    event.preventDefault();
    this.navigateToPath("/");

    // Note:
    //   We don't NEED this as long as `leaveGame` is called on
    //     PlayGame controller unmount...
    //   However, I think we should verify leaveGame is
    //     successful before navigating.
    Meteor.call("leaveGame", Meteor.userId(), function (error, wasSuccessful) {
      if (wasSuccessful) {
        this.navigateToPath("/");
      }
    }.bind(this));
  }

});
