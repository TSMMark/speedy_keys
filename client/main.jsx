const {
  Router,
  Route,
  IndexRoute
} = ReactRouter;

// TODO: remove this commented line if ReactRouter.history.useQueries works.
// const createHistory = ReactRouter.history.createHistory;
const history = ReactRouter.history.useQueries(ReactRouter.history.createHistory)()

const routes = (
  <Route path="/" component={Layouts.App}>
    <IndexRoute component={Views.Home}/>
    <Route path="play/:gameId" component={Controllers.PlayGame}/>
  </Route>
);

const router = (
  <Router history={history}>
    {routes}
  </Router>
);

Meteor.startup(function () {
  ReactDOM.render(router, document.getElementById("main-app"));

  window.addEventListener("beforeunload", function (_error) {
    Meteor.call("leaveGame", Meteor.userId());
  });
});
