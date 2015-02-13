Layouts = {};

Layouts.App = React.createClass({
  getInitialState: function () {
    return {
      mobile: this.isMobile()
    }
  },

  render: function () {
    var content
      , classes = {
          mobile: this.state.mobile
        };

    if (this.props.currentUser) {
      content = <RouteHandler currentUser={this.props.currentUser}
                              mobile={this.state.mobile}/>;
    }
    else if (missingServiceConfig()) {
      content = <Views.ConfigureServices/>;
    }
    else {
      content = <Views.SignIn/>;
    }

    return (
      <div id="app-container" className={cx(classes)}>
        <Partials.Navbar/>
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

    return width <= cuttoff;
  },

  componentDidMount: function () {
    $(window).on("resize.layout", _.throttle(this.handleResize, 500));
  },

  componentWillUnmount: function () {
    $(window).off("resize.layout");
  }
});
