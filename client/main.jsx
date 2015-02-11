Meteor.startup(function () {
  var routes
    , render;

  routes = (
    <Route name="app" path="/" handler={Layouts.App}>
      <Route name="playGame" key="playGame" handler={Controllers.PlayGame}
             path="play/:gameId" />
      <DefaultRoute name="default" key="default" handler={Views.Home}/>
    </Route>
  );

  render = function () {
    Meteor.subscribe("users");
    var currentUser = Meteor.user();

    Router.run(routes, Router.HistoryLocation, function (Handler) {
      React.render(<Handler currentUser={currentUser}/>,
                   document.getElementById("main-app"));
    });
  }

  render();
  Tracker.autorun(render);
});
