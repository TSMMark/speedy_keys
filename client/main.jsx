Meteor.startup(function () {
  updateDeps = function () {
    Collections.Users.find().fetch();
    Collections.Games.find().fetch();

    Meteor.subscribe("games");
    Meteor.subscribe("users");
  }

  render = function () {
    var currentUser = Meteor.user()
      , subRoutes
      , routes;

      updateDeps();

      if (currentUser) {
        subRoutes = [
          (<DefaultRoute name="default" key="default" handler={Views.Home}/>)
        ];
      }
      else if (missingServiceConfig()) {
        subRoutes = (<DefaultRoute name="default" key="default" handler={Views.ConfigureServices}/>);
      }
      else {
        subRoutes = (<DefaultRoute name="default" key="default" handler={Views.SignIn}/>);
      }

      routes = (
        <Route name="app" path="/" handler={Views.App}>
          {subRoutes}
        </Route>
      );

    Router.run(routes, Router.HistoryLocation, function (Handler) {
      React.render(<Handler/>,
                   document.getElementById("main-app"));
    });
  }

  updateDeps();
  Tracker.autorun(render);

  $(window).resize(_.throttle(render, 600));
});
