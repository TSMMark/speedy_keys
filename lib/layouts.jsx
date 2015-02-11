Layouts = {};

Layouts.App = React.createClass({
  render: function () {
    var content;

    if (this.props.currentUser) {
      content = <RouteHandler currentUser={this.props.currentUser}/>;
    }
    else if (missingServiceConfig()) {
      content = <Views.ConfigureServices/>;
    }
    else {
      content = <Views.SignIn/>;
    }

    return (
      <div>
        <Partials.Navbar/>
        <div id="main-content">
          {content}
        </div>
      </div>
    );
  }
});
