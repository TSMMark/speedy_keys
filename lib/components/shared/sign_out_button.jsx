Components.SignOutButton = React.createClass({
  mixins: [Mixins.RoutingHelpers],

  getDefaultProps: function () {
    return {};
  },

  signOut: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.logout(function (error) {
      Meteor._debug("Logout", error);
      if (error) throw error;

      self.navigateToPath("/");
    });
  },

  render: function () {
    var classes = {
      "btn": true,
      "white-text": true
    };

    return (
      <a onClick={this.signOut} className={cx(classes)}>
        <span className="fa fa-power-off"></span> Sign Out
      </a>
    );
  }

});
