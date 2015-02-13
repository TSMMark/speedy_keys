Components.Overlay = React.createClass({
  getDefaultProps: function () {
    return {
      alpha: 1.0
    }
  },

  render: function () {
    var alpha = this.props.alpha
      , style = {
          background: "rgba(0, 0, 0, " + alpha + ")"
        }
      , classes = {
          "overlay-container": true
        };

    classes[this.props.className] = true;

    return (
      <div className={cx(classes)} style={style}>
        <div className="overlay-content">
          <div className="container">
            {this.props.children}
          </div>
        </div>
      </div>);
  }
});
