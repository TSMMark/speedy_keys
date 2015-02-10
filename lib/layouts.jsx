Layouts = {};

Layouts.App = React.createClass({
  render: function () {
    var content;

    if (Meteor.user()) {
      content = <RouteHandler/>;
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
