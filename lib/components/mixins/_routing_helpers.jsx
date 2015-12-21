// TODO: use ReactRouter.Lifecycle
// https://github.com/rackt/react-router/blob/latest/docs/guides/advanced/ConfirmingNavigation.md

Mixins.RoutingHelpers = {

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  navigateToPath: function (path) {
    return this.context.history.push(path);
  }

};
