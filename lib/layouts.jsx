Layouts = {};

Layouts.App = React.createClass({
  mixins: [Router.State, ReactMeteor.Mixin],

  getMeteorState: function () {
    Meteor.subscribe("users");

    return {
      currentUser: Meteor.user(),
      mobile: this.isMobile(),
      missingServiceConfig: missingServiceConfig()
    };
  },

  render: function () {
    var content
      , classes = {
          mobile: this.state.mobile
        };

    if (this.state.currentUser) {
      content = <RouteHandler {...this.state} />;
    }
    else if (this.state.missingServiceConfig) {
      content = <Views.ConfigureServices {...this.state}/>;
    }
    else {
      content = <Views.SignIn {...this.state} includePassword={false} />;
    }

    return (
      <div id="app-container" className={cx(classes)}>
        <Partials.Navbar currentPath={this.getPath()} />
        <div id="main-content">
          {content}
        </div>
      </div>
    );
  },

  handleResize: function () {
    // TODO: include window innerHeight and innerWidth in state
    this.setState({
      mobile: this.isMobile()
    })
  },

  isMobile: function () {
    var width = $(window).width()
      , cuttoff = 768;

    return width < cuttoff;
  },

  componentDidMount: function () {
    $(window).on("resize.layout", _.throttle(this.handleResize, 500));
  },

  componentWillUnmount: function () {
    $(window).off("resize.layout");
  }
});
