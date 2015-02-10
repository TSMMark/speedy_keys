Meteor.startup(function () {
  updateDeps = function () {
    Meteor.subscribe("users");
    Meteor.user();
  }

  render = function () {
    var currentUser = Meteor.user()
      , subRoutes
      , routes;

      updateDeps();

      routes = (
        <Route name="app" path="/" handler={Layouts.App}>
          <Route name="playGame" key="playGame" handler={Views.PlayGame}
                 path="play/:gameId" />
          <DefaultRoute name="default" key="default" handler={Views.Home}/>
        </Route>
      );

    Router.run(routes, Router.HistoryLocation, function (Handler) {
      React.render(<Handler/>,
                   document.getElementById("main-app"));
    });
  }

  updateDeps();
  render();
  Tracker.autorun(render);
});
