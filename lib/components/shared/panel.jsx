Components.Panel = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    bodyClassName: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      className: "",
      bodyClassName: ""
    }
  },

  render: function () {
    var heading
      , classes = {
          "card": true
        }
      , bodyClasses = {
          "card-content": true
        };

    classes[this.props.className] = true;
    bodyClasses[this.props.bodyClassName] = true;

    if (this.props.heading) {
      heading = (
        <span className="card-title">
          {this.props.heading}
        </span>
      );
    }

    return (
      <div className={cx(classes)}>
        <div className={cx(bodyClasses)}>
          {heading}
          {this.props.children}
        </div>
      </div>
    );
  }

});
