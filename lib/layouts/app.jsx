Layouts.App = React.createClass({
  mixins: [ReactRouter.RouteContext, ReactRouter.State, ReactMeteorData],

  getInitialState: function() {
    var responsiveState = this.getResponsiveState();
    return _.extend({
      // Nothing here yet.
    }, responsiveState);
  },

  childContextTypes: {
    history: React.PropTypes.object,
    ltSmall: React.PropTypes.bool,
    ltMedium: React.PropTypes.bool,
    ltLarge: React.PropTypes.bool,
    gtSmall: React.PropTypes.bool,
    gtMedium: React.PropTypes.bool,
    gtLarge: React.PropTypes.bool
  },

  getChildContext: function() {
    return {
      history: this.props.history,
      ltSmall: this.state.ltSmall, // TODO: DRY
      ltMedium: this.state.ltMedium, // TODO: DRY
      ltLarge: this.state.ltLarge, // TODO: DRY
      gtSmall: this.state.gtSmall, // TODO: DRY
      gtMedium: this.state.gtMedium, // TODO: DRY
      gtLarge: this.state.gtLarge // TODO: DRY
    };
  },

  getMeteorData: function () {
    const subscriptions = [
      Meteor.subscribe("users")
    ];

    const meteorSubscriptionsReady = _.all(subscriptions, function (subscription) {
      return subscription.ready();
    });

    // Get the current routes from React Router
    const routes = this.props.routes;

    return {
      meteorSubscriptionsReady: meteorSubscriptionsReady,
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

  // TODO: Mixin this?
  getResponsiveState: function () {
    var width = $(window).width()
    var widthMap = {
      Small: 600,
      Medium: 992,
      Large: 1200
    };

    return (
      _.reduce(widthMap, function (state, cutoff, screenName) {
        state["lt" + screenName] = width <= cutoff;
        state["gt" + screenName] = width > cutoff;
        return state;
      }, {})
    );
  },

  handleResize: function () {
    // TODO: include window innerHeight and innerWidth in state?
    this.setState(this.getResponsiveState());
  },

  render: function () {
    var content;

    if (!this.data.meteorSubscriptionsReady) {
      content = <Components.Spinner/>
    }
    else if (this.data.currentUser) {
      content = this.props.children;
    }
    else if (this.data.missingServiceConfig) {
      content = <Views.ConfigureServices/>;
    }
    else {
      content = <Views.SignIn {...this.state} {...this.props} includePassword={false} />;
    }

    return (
      <div id="app-container">
        <Partials.Navbar currentUser={this.data.currentUser} />
        <div id="main-content">
          {content}
        </div>
      </div>
    );
  }

});
