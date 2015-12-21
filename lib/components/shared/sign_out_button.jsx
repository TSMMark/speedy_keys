Components.SignOutButton = React.createClass({
  mixins: [Mixins.RoutingHelpers],

  getDefaultProps: function () {
    return {};
  },

  render: function () {
    var classes = {
      "btn": true,
      "btn-default": true
    };

    return (
      <button onClick={this.signOut}
              className={cx(classes)}>
        <span className="fa fa-power-off"></span> Sign Out
      </button>);
  },

  signOut: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.logout(function (error) {
      Meteor._debug("Logout", error);
      if (error) throw error;

      self.navigateToPath("/");
    });
  }

});
