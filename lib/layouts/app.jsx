Layouts.App = React.createClass({
  mixins: [ReactRouter.State, ReactMeteorData],

  getInitialState: function() {
    return {
      mobile: this.isMobile()
    };
  },

  childContextTypes: {
    history: React.PropTypes.object,
    mobile: React.PropTypes.bool
  },

  getChildContext: function() {
    return {
      history: this.props.history,
      mobile: this.state.mobile
    };
  },

  getMeteorData: function () {
    const subHandles = [
      Meteor.subscribe("users")
    ];

    const subsReady = _.all(subHandles, function (handle) {
      return handle.ready();
    });

    // Get the current routes from React Router
    const routes = this.props.routes;

    return {
      currentUser: Meteor.user(),
      missingServiceConfig: missingServiceConfig()
    };
  },

  componentDidMount: function () {
    $(window).on("resize.layout", _.throttle(this.handleResize, 500));
  },

  componentWillUnmount: function () {
    $(window).off("resize.layout");
  },

  isMobile: function () {
    var width = $(window).width()
      , cuttoff = 768;

    return width < cuttoff;
  },

  handleResize: function () {
    // TODO: include window innerHeight and innerWidth in state
    this.setState({
      mobile: this.isMobile()
    })
  },

  render: function () {
    var content
      , classes = {
          mobile: this.state.mobile
        };

    if (this.data.currentUser) {
      content = this.props.children;
    }
    else if (this.data.missingServiceConfig) {
      content = <Views.ConfigureServices/>;
    }
    else {
      content = <Views.SignIn {...this.state} {...this.props} includePassword={false} />;
    }

    return (
      <div id="app-container" className={cx(classes)}>
        <Partials.Navbar />
        <div id="main-content">
          {content}
        </div>
      </div>
    );
  }

});
