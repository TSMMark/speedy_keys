Meteor.startup(function () {
  var routes;

  routes = (
    <Route name="app" path="/" handler={Layouts.App}>
      <Route name="playGame" key="playGame" handler={Controllers.PlayGame}
             path="play/:gameId" />
      <DefaultRoute name="default" key="default" handler={Views.Home}/>
    </Route>);

  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>,
                 document.getElementById("main-app"));
  });

  window.addEventListener("beforeunload", function (_error) {
    Meteor.call("leaveGame", Meteor.userId());
  });

});
