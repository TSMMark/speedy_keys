Components.FacebookLogin = React.createClass({
  mixins: [Mixins.RoutingHelpers],

  getDefaultProps: function () {
    return {
      children: ["Sign up with Facebook"],
      btn: true
    };
  },

  render: function () {
    var classes = {
      "btn": this.props.btn,
      "btn-facebook": this.props.btn
    };

    if (this.props.className) {
      classes[this.props.className] = true
    }

    return (
      <a href="#!" onClick={this.signIn}
         className={cx(classes)}>
        {this.props.children}
      </a>);
  },

  signIn: function (event) {
    var self = this;
    event.preventDefault();

    Meteor.loginWithFacebook({
      loginStyle: "redirect",
      requestPermissions: ["email"]
    }, function (error) {
      if (error) throw error;

      self.navigateToPath("/");
    });
  }

});

