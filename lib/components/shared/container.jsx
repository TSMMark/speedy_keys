Components.Container = React.createClass({

  render: function () {
    var classes = {
      "container": true
    }

    classes[cx(this.props.className)] = true;

    return (
      <div className={cx(classes)}>
        {this.props.children}
      </div>
    );
  }

});
