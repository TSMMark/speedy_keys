Components.Panel = React.createClass({

  getDefaultProps: function () {
    return {
      className: {
        "panel-default": true
      },
      bodyClassName: {}
    }
  },

  render: function () {
    var heading
      , classes = {
          "panel": true
        }
      , bodyClasses = {
          "panel-body": true
        };

    classes[cx(this.props.className)] = true;
    bodyClasses[cx(this.props.bodyClassName)] = true;

    if (this.props.heading) {
      heading = (
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.heading}
          </h3>
        </div>
      );
    }

    return (
      <div className={cx(classes)}>
        {heading}
        <div className={cx(bodyClasses)}>
          {this.props.children}
        </div>
      </div>
    );
  }

});
