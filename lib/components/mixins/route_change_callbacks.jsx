// TODO rename to something to do with routeChange.
Mixins.RouteChangeCallbacks = {

  propTypes: {
    currentPath: React.PropTypes.string.isRequired
  },

  componentWillMount: function() {
    this.setState({
      _routePath: this._getPath()
    });
  },

  // Note: Does not fire on query param change, only on path change.
  componentWillReceiveProps: function() {
    var newPath = this._getPath()
      , oldPath = this.state._routePath;

    if (oldPath !== newPath) {
      this.setState({
        _routePath: newPath,
      });

      if (this.routeDidChange) {
        this.routeDidChange(oldPath, newPath);
      }
    }
  },

  _getPath: function () {
    return this.props.currentPath;
  }

}
